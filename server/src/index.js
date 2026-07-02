const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Connect to PostgreSQL database
require("./config/db");

// Import auth routes
const authRoutes = require("./routes/auth.routes");

const app = express();

// Allow frontend to connect to backend
app.use(cors());

// Allow JSON data in requests
app.use(express.json());

// Auth routes - Register and Login
app.use("/api/auth", authRoutes);

// Test route - Check if server is running
app.get("/", (req, res) => {
  res.json({ message: "SmartERP Server Running ✅" });
});

// Start server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});