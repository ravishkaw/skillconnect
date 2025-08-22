const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);

module.exports = router;
