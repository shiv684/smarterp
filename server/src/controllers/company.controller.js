const pool = require("../config/db");

// Create new company
const createCompany = async (req, res) => {
  try {
    const { name, gst_number, address, state, financial_year } = req.body;
    const user_id = req.user.id; // Get user id from JWT token

    // Check if user already has 5 companies
    const companyCount = await pool.query(
      "SELECT COUNT(*) FROM companies WHERE user_id = $1",
      [user_id]
    );

    if (parseInt(companyCount.rows[0].count) >= 5) {
      return res.status(400).json({ message: "Maximum 5 companies allowed" });
    }

    // Save new company in database
    const newCompany = await pool.query(
      "INSERT INTO companies (user_id, name, gst_number, address, state, financial_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, name, gst_number, address, state, financial_year]
    );

    res.status(201).json({
      message: "Company created successfully ✅",
      company: newCompany.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all companies of logged in user
const getCompanies = async (req, res) => {
  try {
    const user_id = req.user.id; // Get user id from JWT token

    // Fetch all companies of this user
    const companies = await pool.query(
      "SELECT * FROM companies WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );

    res.status(200).json({
      message: "Companies fetched successfully ✅",
      companies: companies.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params; // Get company id from URL
    const { name, gst_number, address, state, financial_year } = req.body;
    const user_id = req.user.id; // Get user id from JWT token

    // Check if company belongs to this user
    const company = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (company.rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update company in database
    const updatedCompany = await pool.query(
      "UPDATE companies SET name = $1, gst_number = $2, address = $3, state = $4, financial_year = $5 WHERE id = $6 RETURNING *",
      [name, gst_number, address, state, financial_year, id]
    );

    res.status(200).json({
      message: "Company updated successfully ✅",
      company: updatedCompany.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params; // Get company id from URL
    const user_id = req.user.id; // Get user id from JWT token

    // Check if company belongs to this user
    const company = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (company.rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Delete company from database
    await pool.query(
      "DELETE FROM companies WHERE id = $1",
      [id]
    );

    res.status(200).json({
      message: "Company deleted successfully ✅",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCompany, getCompanies, updateCompany, deleteCompany };