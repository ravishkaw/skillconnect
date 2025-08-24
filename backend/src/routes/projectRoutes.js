const express = require("express");
const router = express.Router();

const {
  getProjectForUser,
  createProject,
  updateProjectStatusToCompleted,
  updatePaymentStatusToPaid,
} = require("../controllers/projectController");

router.get("/user", getProjectForUser);
router.post("/", createProject);
router.put("/:id/status", updateProjectStatusToCompleted);
router.put("/:id/payment", updatePaymentStatusToPaid);

module.exports = router;
