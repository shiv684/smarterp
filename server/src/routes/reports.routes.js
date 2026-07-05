const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  getStockSummary,
  getSalesReport,
  getPurchaseReport,
  getDashboardSummary,
  getProfitLoss,
} = require("../controllers/reports.controller");

// Stock summary report
router.get("/stock", protect, getStockSummary);

// Sales report
router.get("/sales", protect, getSalesReport);

// Purchase report
router.get("/purchases", protect, getPurchaseReport);

// Dashboard summary
router.get("/dashboard", protect, getDashboardSummary);

// Profit & Loss report
router.get("/profit-loss", protect, getProfitLoss);

module.exports = router;