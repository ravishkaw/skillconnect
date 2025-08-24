const Project = require("../models/projectModel");

const getProjectForUser = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role === "client") {
      const projects = await Project.find({ clientId: id });
      return res.status(200).json(projects);
    }
    const projects = await Project.find({ freelancerId: id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const createProject = async (req, res) => {
  try {
    const { jobId, freelancerId, clientId } = req.body;
    const newProject = await Project.create({
      jobId,
      freelancerId,
      clientId,
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
};

const updateProjectStatusToCompleted = async (req, res) => {
  try {
    if (req.user.role === "client") {
      return res
        .status(403)
        .json({ message: "Clients cannot update project status" });
    }
    const { id } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project status" });
  }
};

const updatePaymentStatusToPaid = async (req, res) => {
  try {
    if (req.user.role === "client") {
      return res
        .status(403)
        .json({ message: "Clients cannot update payment status" });
    }
    const { id } = req.params;
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { paymentStatus: "paid" },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status" });
  }
};

module.exports = {
  getProjectForUser,
  createProject,
  updateProjectStatusToCompleted,
  updatePaymentStatusToPaid,
};
