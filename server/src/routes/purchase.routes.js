const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { createPurchaseVoucher, getPurchaseVouchers } = require("../controllers/purchase.controller");

router.post("/", protect, createPurchaseVoucher);
router.get("/", protect, getPurchaseVouchers);

module.exports = router;