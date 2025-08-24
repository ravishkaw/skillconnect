import { useState, useEffect } from "react";
import { proposalAPI, jobAPI } from "../utils/apiCalls";
import toast from "react-hot-toast";

export const useProposals = (jobId) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProposals = async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await jobAPI.getJobProposals(jobId);
      setProposals(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch proposals";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (proposalData) => {
    if (!jobId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await proposalAPI.createProposal(jobId, proposalData);
      toast.success("Proposal submitted successfully!");
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to submit proposal";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProposalStatus = async (proposalId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await proposalAPI.updateProposalStatus(
        proposalId,
        status
      );
      toast.success(`Proposal ${status} successfully!`);
      // Refresh proposals list
      await fetchProposals();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || `Failed to ${status} proposal`;
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchProposals();
    }
  }, [jobId]);

  return {
    proposals,
    loading,
    error,
    fetchProposals,
    createProposal,
    updateProposalStatus,
  };
};

// Hook for user's own proposals (for freelancers)
export const useMyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      // This would need a backend endpoint for user's proposals
      // For now, we'll return empty array
      setProposals([]);
      return { success: true, data: [] };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch proposals";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    proposals,
    loading,
    error,
    fetchMyProposals,
  };
};
