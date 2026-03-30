import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.api";
import { fetchUser } from "../../../app/store/slices/authSlice";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Login attempt
      await login(formData);

      // 2. Fetch user details to sync Redux state
      await dispatch(fetchUser()).unwrap();

      // 3. Success: Go to Home
      navigate("/", { replace: true });

    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403) {
        // Backend logic: User exists but verified: false
        const email = formData.email;
        navigate(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        setError(message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  return { handleLogin, loading, error };
};