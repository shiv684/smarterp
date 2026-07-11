const pool = require("../config/db");

const addUserToCompany = async (req, res) => {
  try {
    const { company_id, email, role } = req.body;
    const owner_id = req.user.id;

    const company = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [company_id, owner_id]
    );

    if (company.rows.length === 0) {
      return res.status(403).json({ message: "You are not the owner of this company" });
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.rows[0].id === owner_id) {
      return res.status(400).json({ message: "You are already the owner" });
    }

    const companyUser = await pool.query(
      "INSERT INTO company_users (company_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (company_id, user_id) DO UPDATE SET role = $3 RETURNING *",
      [company_id, user.rows[0].id, role || "user"]
    );

    res.status(201).json({
      message: "User added to company successfully ✅",
      companyUser: companyUser.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCompanyUsers = async (req, res) => {
  try {
    const { company_id } = req.params;
    const owner_id = req.user.id;

    const company = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [company_id, owner_id]
    );

    if (company.rows.length === 0) {
      const isAssigned = await pool.query(
        "SELECT * FROM company_users WHERE company_id = $1 AND user_id = $2",
        [company_id, owner_id]
      );

      if (isAssigned.rows.length === 0) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    const users = await pool.query(
      `SELECT cu.id, cu.user_id, cu.role, cu.created_at, u.name, u.email
       FROM company_users cu
       LEFT JOIN users u ON cu.user_id = u.id
       WHERE cu.company_id = $1
       ORDER BY cu.created_at DESC`,
      [company_id]
    );

    res.status(200).json({
      message: "Company users fetched successfully ✅",
      users: users.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeUserFromCompany = async (req, res) => {
  try {
    const { company_id, user_id } = req.params;
    const owner_id = req.user.id;

    const company = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [company_id, owner_id]
    );

    if (company.rows.length === 0) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pool.query(
      "DELETE FROM company_users WHERE company_id = $1 AND user_id = $2",
      [company_id, user_id]
    );

    res.status(200).json({ message: "User removed from company ✅" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addUserToCompany, getCompanyUsers, removeUserFromCompany };