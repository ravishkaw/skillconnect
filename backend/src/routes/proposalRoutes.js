const express = require("express");
const router = express.Router();

const { updateProposalStatus } = require("../controllers/proposalController");

router.put("/:proposalId", updateProposalStatus);

module.exports = router;
