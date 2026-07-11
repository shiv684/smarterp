const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const { generateInvoice, generatePurchaseInvoice } = require("../controllers/invoice.controller");

router.get("/sales/:id", protect, checkCompanyAccess, generateInvoice);
router.get("/purchase/:id", protect, checkCompanyAccess, generatePurchaseInvoice);

module.exports = router;