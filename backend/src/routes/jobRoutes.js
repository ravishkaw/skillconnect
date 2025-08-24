const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  postJob,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {
  createProposal,
  getProposals,
} = require("../controllers/proposalController");

router.get("/", getAllJobs);
router.post("/", postJob);
router.get("/:id", getSingleJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

router.get("/:jobId/proposals", getProposals);
router.post("/:jobId/proposals", createProposal);

module.exports = router;
