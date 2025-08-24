import { useState, useEffect } from "react";
import { projectAPI } from "../utils/apiCalls";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.getAllProjects();
      // Backend now filters by user automatically, so we just use the response data
      setProjects(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch projects";
      setError(errorMessage);
      toast.error(errorMessage);
      setProjects([]); // Set empty array on error
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, projectData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.updateProject(projectId, projectData);
      toast.success("Project updated successfully!");
      // Refresh projects list
      await fetchProjects();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update project";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.updateProject(projectId, { status });
      toast.success(`Project marked as ${status}`);
      // Refresh projects list
      await fetchProjects();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update project status";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    updateProject,
    updateProjectStatus,
  };
};

export const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.getProjectById(id);
      setProject(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch project details";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  };
};
