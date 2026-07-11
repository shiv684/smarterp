const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require("../controllers/supplier.controller");

router.post("/", protect, checkCompanyAccess, createSupplier);
router.get("/", protect, checkCompanyAccess, getSuppliers);
router.put("/:id", protect, checkCompanyAccess, updateSupplier);
router.delete("/:id", protect, checkCompanyAccess, deleteSupplier);

module.exports = router;