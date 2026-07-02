const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists in database
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Encrypt the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user in database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response with user data and token
    res.status(201).json({
      message: "Register successful ✅",
      user: newUser.rows[0],
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email in database
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // If user not found send error
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Compare entered password with encrypted password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    // If password is wrong send error
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response with user data and token
    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };