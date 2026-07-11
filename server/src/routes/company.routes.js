const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  createCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
} = require("../controllers/company.controller");

router.post("/", protect, createCompany);
router.get("/", protect, getCompanies);
router.put("/:id", protect, updateCompany);
router.delete("/:id", protect, deleteCompany);

module.exports = router;