const Project = require("../models/projectModel");

const getProjectForUser = async (req, res) => {
  try {
    const { id, role } = req.user;
    let projects;

    if (role === "client") {
      projects = await Project.find({ clientId: id })
        .populate("jobId", "title description budget deadline")
        .populate("freelancerId", "name email")
        .populate("clientId", "name email");
    } else {
      projects = await Project.find({ freelancerId: id })
        .populate("jobId", "title description budget deadline")
        .populate("freelancerId", "name email")
        .populate("clientId", "name email");
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// automatically create when proposal accepted
const createProject = async ({ jobId, freelancerId, clientId }) => {
  try {
    const newProject = await Project.create({
      jobId,
      freelancerId,
      clientId,
    });
    console.log("Project created:", newProject);
    return newProject;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
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
