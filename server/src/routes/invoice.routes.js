const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { generateInvoice } = require("../controllers/invoice.controller");

// Generate invoice PDF
router.get("/:id", protect, generateInvoice);

module.exports = router;