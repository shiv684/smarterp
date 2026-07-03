const pool = require("../config/db");

// Create new customer
const createCustomer = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if company id is provided
    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Save new customer in database
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_id, name, mobile, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [company_id, name, mobile, address]
    );

    res.status(201).json({
      message: "Customer created successfully ✅",
      customer: newCustomer.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all customers of a company
const getCustomers = async (req, res) => {
  try {
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if company id is provided
    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Fetch all customers of this company
    const customers = await pool.query(
      "SELECT * FROM customers WHERE company_id = $1 ORDER BY created_at DESC",
      [company_id]
    );

    res.status(200).json({
      message: "Customers fetched successfully ✅",
      customers: customers.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params; // Get customer id from URL
    const { name, mobile, address } = req.body;
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if customer belongs to this company
    const customer = await pool.query(
      "SELECT * FROM customers WHERE id = $1 AND company_id = $2",
      [id, company_id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update customer in database
    const updatedCustomer = await pool.query(
      "UPDATE customers SET name = $1, mobile = $2, address = $3 WHERE id = $4 RETURNING *",
      [name, mobile, address, id]
    );

    res.status(200).json({
      message: "Customer updated successfully ✅",
      customer: updatedCustomer.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params; // Get customer id from URL
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if customer belongs to this company
    const customer = await pool.query(
      "SELECT * FROM customers WHERE id = $1 AND company_id = $2",
      [id, company_id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Delete customer from database
    await pool.query("DELETE FROM customers WHERE id = $1", [id]);

    res.status(200).json({
      message: "Customer deleted successfully ✅",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomer, getCustomers, updateCustomer, deleteCustomer };