import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../app/store/slices/authSlice";

// Auth Pages
import Login from "../../features/auth/pages/Login.jsx";
import Register from "../../features/auth/pages/Register.jsx";
import Verify from "../../features/auth/pages/Verify.jsx";
import VerifyEmail from "../../features/auth/pages/VerifyEmail.jsx";
import ProfilePage from "../../features/auth/pages/ProfilePage.jsx";

// 🆕 New Password Reset Pages (Inhe import kar lena path ke hisab se)
import VerifyOtp from "../../features/auth/pages/VerifyOTP.jsx";
import ResetPassword from "../../features/auth/pages/ResetPassword.jsx";

// Routes Guards
import ProtectedRoute from "../../features/auth/routes/ProtectedRoutes.jsx";
import PublicRoute from "../../features/auth/routes/PublicRoute.jsx";

// Home/Game Pages
import LandingPage from "../../features/home/pages/LandingPage.jsx";
import SellersPage from "../../features/home/pages/SellersPage.jsx";
import ProductSelection from "../../features/home/pages/ProductSelection.jsx";
import GameScreen from "../../features/home/pages/GameScreen.jsx";
import ResultScreen from "../../features/home/pages/ResultScreen.jsx";
import Leaderboard from "../../features/home/pages/Leaderboard.jsx";

// ... (baki imports same rahenge)

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>; // Yahan aap apna Loader2 component bhi dal sakte ho
  }

  return (
    <Routes>
      {/* 🔓 Public only routes - Logged in user yahan nahi aa sakta */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* 🆕 Password Reset Routes (Protected by PublicRoute) */}
      <Route path="/forgot-password" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      {/* 🌍 Open Routes */}
      <Route path="/verify" element={<Verify />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/" element={<LandingPage />} />

      {/* 🔐 Protected Routes - Only for logged in users */}
      <Route path="/sellers" element={<ProtectedRoute><SellersPage/></ProtectedRoute>} />
      <Route path="/products/:sellerId" element={<ProtectedRoute><ProductSelection /></ProtectedRoute>} />
      <Route path="/play" element={<ProtectedRoute><GameScreen /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute><ResultScreen /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* 404 Page (Optional but recommended) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;