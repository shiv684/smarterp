const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require("../controllers/customer.controller");

// All routes are protected - Login required
router.post("/", protect, createCustomer);
router.get("/", protect, getCustomers);
router.put("/:id", protect, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

module.exports = router;