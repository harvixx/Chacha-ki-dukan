import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../app/store/slices/authSlice";

import Login from "../../features/auth/pages/Login.jsx";
import Register from "../../features/auth/pages/Register.jsx";
import Verify from "../../features/auth/pages/Verify.jsx";
import VerifyEmail from "../../features/auth/pages/VerifyEmail.jsx";
import ProfilePage from "../../features/auth/pages/ProfilePage.jsx";
import ProtectedRoute from "../../features/auth/routes/ProtectedRoutes.jsx";
import PublicRoute from "../../features/auth/routes/PublicRoute.jsx";

import LandingPage from "../../features/home/pages/LandingPage.jsx";
import SellersPage from "../../features/home/pages/SellersPage.jsx";
import ProductSelection from "../../features/home/pages/ProductSelection.jsx";
import GameScreen from "../../features/home/pages/GameScreen.jsx";
import ResultScreen from "../../features/home/pages/ResultScreen.jsx";
import Leaderboard from "../../features/home/pages/Leaderboard.jsx";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // ✅ App start pe cookie se user fetch karo
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // ✅ Jab tak user check ho raha hai, kuch mat dikhao
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      {/* Public only routes - logged in hain toh "/" pe bhejo */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Ye routes sab ke liye open hain */}
      <Route path="/verify" element={<Verify />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/" element={<LandingPage/>} />
      <Route path="/sellers" element={<ProtectedRoute><SellersPage /></ProtectedRoute>} />
      <Route path="/products/:sellerId" element={<ProtectedRoute><ProductSelection /></ProtectedRoute>} />
      <Route path="/play" element={<ProtectedRoute><GameScreen /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute><ResultScreen /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;