const pool = require("../config/db");

// Create new supplier
const createSupplier = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if company id is provided
    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Save new supplier in database
    const newSupplier = await pool.query(
      "INSERT INTO suppliers (company_id, name, mobile, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [company_id, name, mobile, address]
    );

    res.status(201).json({
      message: "Supplier created successfully ✅",
      supplier: newSupplier.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all suppliers of a company
const getSuppliers = async (req, res) => {
  try {
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if company id is provided
    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Fetch all suppliers of this company
    const suppliers = await pool.query(
      "SELECT * FROM suppliers WHERE company_id = $1 ORDER BY created_at DESC",
      [company_id]
    );

    res.status(200).json({
      message: "Suppliers fetched successfully ✅",
      suppliers: suppliers.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params; // Get supplier id from URL
    const { name, mobile, address } = req.body;
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if supplier belongs to this company
    const supplier = await pool.query(
      "SELECT * FROM suppliers WHERE id = $1 AND company_id = $2",
      [id, company_id]
    );

    if (supplier.rows.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update supplier in database
    const updatedSupplier = await pool.query(
      "UPDATE suppliers SET name = $1, mobile = $2, address = $3 WHERE id = $4 RETURNING *",
      [name, mobile, address, id]
    );

    res.status(200).json({
      message: "Supplier updated successfully ✅",
      supplier: updatedSupplier.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params; // Get supplier id from URL
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if supplier belongs to this company
    const supplier = await pool.query(
      "SELECT * FROM suppliers WHERE id = $1 AND company_id = $2",
      [id, company_id]
    );

    if (supplier.rows.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Delete supplier from database
    await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);

    res.status(200).json({
      message: "Supplier deleted successfully ✅",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier };