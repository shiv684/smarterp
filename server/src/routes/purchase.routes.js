const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const { createPurchaseVoucher, getPurchaseVouchers } = require("../controllers/purchase.controller");

router.post("/", protect, checkCompanyAccess, createPurchaseVoucher);
router.get("/", protect, checkCompanyAccess, getPurchaseVouchers);

module.exports = router;