const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const { createSalesVoucher, getSalesVouchers, getSalesVoucherById } = require("../controllers/sales.controller");

router.post("/", protect, checkCompanyAccess, createSalesVoucher);
router.get("/", protect, checkCompanyAccess, getSalesVouchers);
router.get("/:id", protect, checkCompanyAccess, getSalesVoucherById);

module.exports = router;