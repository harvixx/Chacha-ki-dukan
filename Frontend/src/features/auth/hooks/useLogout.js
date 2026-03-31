import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutState } from "../../../app/store/slices/authSlice";
import { logoutapi } from "../services/auth.api";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    setIsLoading(true);
    try {
      
      await logoutapi(); 
      // 2. Redux state clear karo
      dispatch(logoutState());

      // 3. Login page pe bhej do
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Failsafe: Agar backend down bhi ho, toh frontend se toh logout kar hi do
      dispatch(logoutState());
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};