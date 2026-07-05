const pool = require("../config/db");

// Create purchase voucher
const createPurchaseVoucher = async (req, res) => {
  const client = await pool.connect();

  try {
    const { supplier_id, items, payment_type, date } = req.body;
    const company_id = req.headers["company-id"];

    // Start transaction
    await client.query("BEGIN");

    // Calculate total amount
    let total_amount = 0;

    for (const item of items) {
      total_amount += item.quantity * item.rate;
    }

    // Create purchase voucher
    const voucher = await client.query(
      "INSERT INTO purchase_vouchers (company_id, supplier_id, total_amount, payment_type, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company_id, supplier_id, total_amount, payment_type, date]
    );

    const voucher_id = voucher.rows[0].id;

    // Save each item and increase stock
    for (const item of items) {
      const itemTotal = item.quantity * item.rate;

      // Save purchase item
      await client.query(
        "INSERT INTO purchase_items (purchase_voucher_id, item_id, quantity, rate, total) VALUES ($1, $2, $3, $4, $5)",
        [voucher_id, item.item_id, item.quantity, item.rate, itemTotal]
      );

      // Increase stock quantity automatically
      await client.query(
        "UPDATE items SET quantity = quantity + $1 WHERE id = $2",
        [item.quantity, item.item_id]
      );
    }

    // Update supplier balance if credit purchase
    if (payment_type === "credit") {
      await client.query(
        "UPDATE suppliers SET balance = balance + $1 WHERE id = $2",
        [total_amount, supplier_id]
      );
    }

    // Commit transaction
    await client.query("COMMIT");

    res.status(201).json({
      message: "Purchase voucher created successfully ✅",
      voucher: voucher.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

// Get all purchase vouchers
const getPurchaseVouchers = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    const vouchers = await pool.query(
      `SELECT pv.*, s.name as supplier_name 
       FROM purchase_vouchers pv 
       LEFT JOIN suppliers s ON pv.supplier_id = s.id 
       WHERE pv.company_id = $1 
       ORDER BY pv.created_at DESC`,
      [company_id]
    );

    res.status(200).json({
      message: "Purchase vouchers fetched successfully ✅",
      vouchers: vouchers.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPurchaseVoucher, getPurchaseVouchers };