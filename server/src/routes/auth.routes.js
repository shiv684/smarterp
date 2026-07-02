const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

// Register route - Create new user
router.post("/register", register);

// Login route - Get token
router.post("/login", login);

module.exports = router;