const pool = require("../config/db");

// Create new company
const createCompany = async (req, res) => {
  try {
    const { name, gst_number, address, state, financial_year } = req.body;
    const user_id = req.user.id;

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
// Get all companies of logged in user
const getCompanies = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Owner ki companies
    const ownedCompanies = await pool.query(
      "SELECT *, 'owner' as access_role FROM companies WHERE user_id = $1",
      [user_id]
    );

    // Employee ki assigned companies
    const assignedCompanies = await pool.query(
      `SELECT c.*, cu.role as access_role 
       FROM companies c
       LEFT JOIN company_users cu ON c.id = cu.company_id
       WHERE cu.user_id = $1`,
      [user_id]
    );

    // Dono merge karo
    const allCompanies = [
      ...ownedCompanies.rows,
      ...assignedCompanies.rows,
    ];

    // Duplicates remove karo
    const uniqueCompanies = allCompanies.filter(
      (company, index, self) =>
        index === self.findIndex((c) => c.id === company.id)
    );

    res.status(200).json({
      message: "Companies fetched successfully ✅",
      companies: uniqueCompanies,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gst_number, address, state, financial_year } = req.body;
    const user_id = req.user.id;

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

// Delete company with all related data
const deleteCompany = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if company belongs to this user
    const company = await client.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (company.rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    await client.query("BEGIN");

    // Delete all related data first
    await client.query(
      "DELETE FROM sales_items WHERE sales_voucher_id IN (SELECT id FROM sales_vouchers WHERE company_id = $1)",
      [id]
    );
    await client.query(
      "DELETE FROM sales_vouchers WHERE company_id = $1",
      [id]
    );
    await client.query(
      "DELETE FROM purchase_items WHERE purchase_voucher_id IN (SELECT id FROM purchase_vouchers WHERE company_id = $1)",
      [id]
    );
    await client.query(
      "DELETE FROM purchase_vouchers WHERE company_id = $1",
      [id]
    );
    await client.query(
      "DELETE FROM customers WHERE company_id = $1",
      [id]
    );
    await client.query(
      "DELETE FROM suppliers WHERE company_id = $1",
      [id]
    );
    await client.query(
      "DELETE FROM items WHERE company_id = $1",
      [id]
    );
    await client.query(
      "DELETE FROM companies WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    res.status(200).json({ message: "Company deleted successfully ✅" });

  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

module.exports = { createCompany, getCompanies, updateCompany, deleteCompany };