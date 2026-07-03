const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { createItem, getItems, updateItem, deleteItem } = require("../controllers/item.controller");

// All routes are protected - Login required
router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;