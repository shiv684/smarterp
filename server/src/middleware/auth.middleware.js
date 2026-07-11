require("dotenv").config({ path: require('path').resolve(__dirname, '../../.env') });
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Login karo pehle" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid hai" });
  }
};

// Check if user has access to company
const checkCompanyAccess = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const company_id = req.headers["company-id"];

    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Check if owner
    const isOwner = await pool.query(
      "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
      [company_id, user_id]
    );

    if (isOwner.rows.length > 0) {
      req.userRole = "owner";
      return next();
    }

    // Check if assigned user
    const isAssigned = await pool.query(
      "SELECT * FROM company_users WHERE company_id = $1 AND user_id = $2",
      [company_id, user_id]
    );

    if (isAssigned.rows.length > 0) {
      req.userRole = isAssigned.rows[0].role;
      return next();
    }

    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protect, checkCompanyAccess };