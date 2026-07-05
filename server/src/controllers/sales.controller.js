const pool = require("../config/db");

// Create sales voucher
const createSalesVoucher = async (req, res) => {
  const client = await pool.connect();

  try {
    const { customer_id, items, payment_type, date } = req.body;
    const company_id = req.headers["company-id"];

    // Start transaction — ya sab hoga ya kuch nahi
    await client.query("BEGIN");

    // Calculate total amount and gst
    let total_amount = 0;
    let gst_amount = 0;

    for (const item of items) {
      const itemTotal = item.quantity * item.rate;
      const itemGst = (itemTotal * item.gst_percent) / 100;
      total_amount += itemTotal;
      gst_amount += itemGst;
    }

    // Generate invoice number
    // Generate invoice number - unique across all companies
const invoiceCount = await client.query(
  "SELECT COUNT(*) FROM sales_vouchers WHERE company_id = $1",
  [company_id]
);

const invoice_no = `INV-${company_id}-${String(parseInt(invoiceCount.rows[0].count) + 1).padStart(4, "0")}`;
    // Create sales voucher
    const voucher = await client.query(
      "INSERT INTO sales_vouchers (company_id, customer_id, invoice_no, total_amount, gst_amount, payment_type, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [company_id, customer_id, invoice_no, total_amount + gst_amount, gst_amount, payment_type, date]
    );

    const voucher_id = voucher.rows[0].id;

    // Save each item and reduce stock
    for (const item of items) {
      const itemTotal = item.quantity * item.rate;

      // Save sales item
      await client.query(
        "INSERT INTO sales_items (sales_voucher_id, item_id, quantity, rate, total) VALUES ($1, $2, $3, $4, $5)",
        [voucher_id, item.item_id, item.quantity, item.rate, itemTotal]
      );

      // Reduce stock quantity automatically
      await client.query(
        "UPDATE items SET quantity = quantity - $1 WHERE id = $2",
        [item.quantity, item.item_id]
      );
    }

    // Update customer balance if credit sale
    if (payment_type === "credit") {
      await client.query(
        "UPDATE customers SET balance = balance + $1 WHERE id = $2",
        [total_amount + gst_amount, customer_id]
      );
    }

    // Commit transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Sales voucher created successfully ✅",
      voucher: voucher.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Get all sales vouchers
const getSalesVouchers = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    const vouchers = await pool.query(
      `SELECT sv.*, c.name as customer_name 
       FROM sales_vouchers sv 
       LEFT JOIN customers c ON sv.customer_id = c.id 
       WHERE sv.company_id = $1 
       ORDER BY sv.created_at DESC`,
      [company_id]
    );

    res.status(200).json({
      message: "Sales vouchers fetched successfully ✅",
      vouchers: vouchers.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single sales voucher with items
const getSalesVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.headers["company-id"];

    // Get voucher
    const voucher = await pool.query(
      `SELECT sv.*, c.name as customer_name 
       FROM sales_vouchers sv 
       LEFT JOIN customers c ON sv.customer_id = c.id 
       WHERE sv.id = $1 AND sv.company_id = $2`,
      [id, company_id]
    );

    if (voucher.rows.length === 0) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Get voucher items
    const items = await pool.query(
      `SELECT si.*, i.name as item_name, i.unit
       FROM sales_items si
       LEFT JOIN items i ON si.item_id = i.id
       WHERE si.sales_voucher_id = $1`,
      [id]
    );

    res.status(200).json({
      message: "Sales voucher fetched successfully ✅",
      voucher: voucher.rows[0],
      items: items.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSalesVoucher, getSalesVouchers, getSalesVoucherById };