const Job = require("../models/jobModel");
const User = require("../models/userModel");

const getAllJobs = async (req, res) => {
  try {
    const { id, role } = req.user;
    const user = await User.findById(id);

    if (role === "client") {
      const jobs = await Job.find({ clientId: id });
      return res.status(200).json(jobs);
    }

    if (role === "freelancer" && user.skills && user.skills.length > 0) {
      const jobs = await Job.find({
        requiredSkills: { $in: user.skills },
        status: "open",
      });
      return res.status(200).json(jobs);
    }

    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// client only
const postJob = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { title, description, budget, deadline, requiredSkills } = req.body;
    const newJob = new Job({
      title,
      description,
      budget,
      deadline,
      requiredSkills,
      clientId: req.user.id,
    });
    const savedJob = await Job.create(newJob);
    res.status(201).json(savedJob);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error creating job" });
  }
};

const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job" });
  }
};

const updateJob = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const job = await Job.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    if (req.user.role === "freelancer") {
      return res.status(403).json({ message: "Access denied" });
    }
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};

module.exports = {
  getAllJobs,
  postJob,
  getSingleJob,
  updateJob,
  deleteJob,
};
