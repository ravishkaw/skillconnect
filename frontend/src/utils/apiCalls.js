import api from "./api";

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  register: (userData) => api.post("/register", userData),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
  getAllUsers: () => api.get("/users"),
};

// Job API calls
export const jobAPI = {
  getAllJobs: () => api.get("/jobs"),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post("/jobs", jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getJobProposals: (jobId) => api.get(`/jobs/${jobId}/proposals`),
};

// Proposal API calls
export const proposalAPI = {
  createProposal: (jobId, proposalData) =>
    api.post(`/jobs/${jobId}/proposals`, proposalData),
  updateProposalStatus: (proposalId, status) =>
    api.put(`/proposals/${proposalId}`, { status }),
};

// Project API calls
export const projectAPI = {
  getAllProjects: () => api.get("/projects"),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
};
