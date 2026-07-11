const express = require("express");
const router = express.Router();
const { protect, checkCompanyAccess } = require("../middleware/auth.middleware");
const { createItem, getItems, updateItem, deleteItem } = require("../controllers/item.controller");

router.post("/", protect, checkCompanyAccess, createItem);
router.get("/", protect, checkCompanyAccess, getItems);
router.put("/:id", protect, checkCompanyAccess, updateItem);
router.delete("/:id", protect, checkCompanyAccess, deleteItem);

module.exports = router;