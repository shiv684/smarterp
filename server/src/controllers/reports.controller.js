const pool = require("../config/db");

// Stock Summary Report
const getStockSummary = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    const stocks = await pool.query(
      `SELECT 
        id, name, sku, unit,
        purchase_price, selling_price,
        quantity,
        (quantity * purchase_price) as stock_value,
        gst_percent
       FROM items 
       WHERE company_id = $1 
       ORDER BY name ASC`,
      [company_id]
    );

    // Calculate total stock value
    const totalValue = stocks.rows.reduce(
      (sum, item) => sum + parseFloat(item.stock_value), 0
    );

    res.status(200).json({
      message: "Stock summary fetched successfully ✅",
      stocks: stocks.rows,
      totalValue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sales Report
const getSalesReport = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    const sales = await pool.query(
      `SELECT 
        sv.invoice_no,
        c.name as customer_name,
        sv.total_amount,
        sv.gst_amount,
        sv.payment_type,
        sv.date
       FROM sales_vouchers sv
       LEFT JOIN customers c ON sv.customer_id = c.id
       WHERE sv.company_id = $1
       ORDER BY sv.date DESC`,
      [company_id]
    );

    // Calculate totals
    const totalSales = sales.rows.reduce(
      (sum, s) => sum + parseFloat(s.total_amount), 0
    );
    const totalGst = sales.rows.reduce(
      (sum, s) => sum + parseFloat(s.gst_amount), 0
    );

    res.status(200).json({
      message: "Sales report fetched successfully ✅",
      sales: sales.rows,
      totalSales,
      totalGst,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Purchase Report
const getPurchaseReport = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    const purchases = await pool.query(
      `SELECT 
        pv.id,
        s.name as supplier_name,
        pv.total_amount,
        pv.payment_type,
        pv.date
       FROM purchase_vouchers pv
       LEFT JOIN suppliers s ON pv.supplier_id = s.id
       WHERE pv.company_id = $1
       ORDER BY pv.date DESC`,
      [company_id]
    );

    // Calculate total purchases
    const totalPurchases = purchases.rows.reduce(
      (sum, p) => sum + parseFloat(p.total_amount), 0
    );

    res.status(200).json({
      message: "Purchase report fetched successfully ✅",
      purchases: purchases.rows,
      totalPurchases,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard Summary
const getDashboardSummary = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    // Total sales
    const salesResult = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM sales_vouchers WHERE company_id = $1",
      [company_id]
    );

    // Total purchases
    const purchaseResult = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM purchase_vouchers WHERE company_id = $1",
      [company_id]
    );

    // Total customers
    const customerResult = await pool.query(
      "SELECT COUNT(*) as total FROM customers WHERE company_id = $1",
      [company_id]
    );

    // Total suppliers
    const supplierResult = await pool.query(
      "SELECT COUNT(*) as total FROM suppliers WHERE company_id = $1",
      [company_id]
    );

    // Total stock value
    const stockResult = await pool.query(
      "SELECT COALESCE(SUM(quantity * purchase_price), 0) as total FROM items WHERE company_id = $1",
      [company_id]
    );

    // Outstanding customers balance
    const outstandingResult = await pool.query(
      "SELECT COALESCE(SUM(balance), 0) as total FROM customers WHERE company_id = $1",
      [company_id]
    );

    res.status(200).json({
      totalSales: parseFloat(salesResult.rows[0].total),
      totalPurchases: parseFloat(purchaseResult.rows[0].total),
      totalCustomers: parseInt(customerResult.rows[0].total),
      totalSuppliers: parseInt(supplierResult.rows[0].total),
      totalStockValue: parseFloat(stockResult.rows[0].total),
      outstandingBalance: parseFloat(outstandingResult.rows[0].total),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Profit & Loss Report
const getProfitLoss = async (req, res) => {
  try {
    const company_id = req.headers["company-id"];

    // Total sales
    const salesResult = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total, COALESCE(SUM(gst_amount), 0) as gst FROM sales_vouchers WHERE company_id = $1",
      [company_id]
    );

    // Total purchases
    const purchaseResult = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM purchase_vouchers WHERE company_id = $1",
      [company_id]
    );

    const totalSales = parseFloat(salesResult.rows[0].total);
    const totalGst = parseFloat(salesResult.rows[0].gst);
    const totalPurchases = parseFloat(purchaseResult.rows[0].total);
    const grossProfit = totalSales - totalPurchases;

    res.status(200).json({
      totalSales,
      totalGst,
      totalPurchases,
      grossProfit,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStockSummary,
  getSalesReport,
  getPurchaseReport,
  getDashboardSummary,
  getProfitLoss,
};