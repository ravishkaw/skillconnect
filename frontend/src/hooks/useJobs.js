import { useState, useEffect } from "react";
import { jobAPI } from "../utils/apiCalls";
import toast from "react-hot-toast";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobAPI.getAllJobs();
      setJobs(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch jobs";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobAPI.createJob(jobData);
      toast.success("Job posted successfully!");
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create job";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, jobData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobAPI.updateJob(id, jobData);
      toast.success("Job updated successfully!");
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update job";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await jobAPI.deleteJob(id);
      toast.success("Job deleted successfully!");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete job";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  };
};

export const useJob = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJob = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await jobAPI.getJobById(id);
      setJob(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch job details";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
};
