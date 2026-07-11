const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require("../controllers/customer.controller");

router.post("/", protect, checkCompanyAccess, createCustomer);
router.get("/", protect, checkCompanyAccess, getCustomers);
router.put("/:id", protect, checkCompanyAccess, updateCustomer);
router.delete("/:id", protect, checkCompanyAccess, deleteCustomer);

module.exports = router;