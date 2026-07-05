const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { createSalesVoucher, getSalesVouchers, getSalesVoucherById } = require("../controllers/sales.controller");

router.post("/", protect, createSalesVoucher);
router.get("/", protect, getSalesVouchers);
router.get("/:id", protect, getSalesVoucherById);

module.exports = router;