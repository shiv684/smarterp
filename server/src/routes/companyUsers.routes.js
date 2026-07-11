const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  addUserToCompany,
  getCompanyUsers,
  removeUserFromCompany,
} = require("../controllers/companyUsers.controller");

router.post("/", protect, addUserToCompany);
router.get("/:company_id", protect, getCompanyUsers);
router.delete("/:company_id/:user_id", protect, removeUserFromCompany);

module.exports = router;