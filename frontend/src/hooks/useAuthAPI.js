import { useState } from "react";
import { authAPI } from "../utils/apiCalls";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const useAuthAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: contextLogin, register: contextRegister } = useAuth();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contextLogin(credentials);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contextRegister(userData);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error,
  };
};
