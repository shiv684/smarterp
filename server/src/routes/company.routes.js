const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");

// All routes are protected - Login required
router.post("/", protect, createCompany);       // Create company
router.get("/", protect, getCompanies);         // Get all companies
router.put("/:id", protect, updateCompany);     // Update company
router.delete("/:id", protect, deleteCompany);  // Delete company

module.exports = router;