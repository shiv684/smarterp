const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require("../controllers/supplier.controller");

// All routes are protected - Login required
router.post("/", protect, createSupplier);
router.get("/", protect, getSuppliers);
router.put("/:id", protect, updateSupplier);
router.delete("/:id", protect, deleteSupplier);

module.exports = router;