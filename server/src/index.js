require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");

// Import routes
const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes"); // New

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes); // New

// Test route
app.get("/", (req, res) => {
  res.json({ message: "SmartERP Server Running ✅" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});