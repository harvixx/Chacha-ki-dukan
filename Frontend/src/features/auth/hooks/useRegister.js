import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.api";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Backend calls User.create and sends email
      await register(formData);

      // Registration success: Redirect to verify page with email in URL
      const email = formData.email;
      navigate(`/verify?email=${encodeURIComponent(email)}`, { replace: true });

    } catch (err) {
      const apiError = err.response?.data;
      // Handle express-validator or custom errors
      setError(apiError?.errors ? apiError.errors[0].msg : apiError?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { handleRegister, loading, error };
};