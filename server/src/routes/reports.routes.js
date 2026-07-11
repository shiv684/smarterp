const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const {
  getStockSummary,
  getSalesReport,
  getPurchaseReport,
  getDashboardSummary,
  getProfitLoss,
} = require("../controllers/reports.controller");

router.get("/stock", protect, checkCompanyAccess, getStockSummary);
router.get("/sales", protect, checkCompanyAccess, getSalesReport);
router.get("/purchases", protect, checkCompanyAccess, getPurchaseReport);
router.get("/dashboard", protect, checkCompanyAccess, getDashboardSummary);
router.get("/profit-loss", protect, checkCompanyAccess, getProfitLoss);

module.exports = router;