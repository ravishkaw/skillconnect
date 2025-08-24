const Proposal = require("../models/proposalModel");
const Job = require("../models/jobModel");
const { createProject } = require("../controllers/projectController");

// client only
const getProposals = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      return res
        .status(403)
        .json({ message: "Freelancers cannot view proposals" });
    }
    const proposals = await Proposal.find({ jobId: req.params.jobId });
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching proposals" });
  }
};

// freelancer only
const createProposal = async (req, res) => {
  try {
    if (req.user.role === "client") {
      return res
        .status(403)
        .json({ message: "Clients cannot create proposals" });
    }
    const { jobId } = req.params;
    const { proposalText, estimatedCost, deliveryTime } = req.body;

    const savedProposal = await Proposal.create({
      jobId,
      freelancerId: req.user.id,
      proposalText,
      estimatedCost,
      deliveryTime,
    });
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(500).json({ message: "Error creating proposal" });
  }
};

// client only
const updateProposalStatus = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      return res
        .status(403)
        .json({ message: "Freelancers cannot update proposals" });
    }
    const { proposalId } = req.params;
    const proposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("jobId");

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // create a project if proposal accepted
    if (req.body.status === "accepted") {
      // Update job status to in_progress
      await Job.findByIdAndUpdate(proposal.jobId._id, {
        status: "in_progress",
      });

      // Create project
      await createProject({
        jobId: proposal.jobId._id,
        freelancerId: proposal.freelancerId,
        clientId: proposal.jobId.clientId,
      });
    }

    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({ message: "Error updating proposal status" });
  }
};

module.exports = {
  getProposals,
  createProposal,
  updateProposalStatus,
};
