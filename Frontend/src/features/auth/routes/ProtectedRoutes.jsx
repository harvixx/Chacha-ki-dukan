import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useSelector((state) => state.auth);

  // 🔥 jab tak user fetch ho raha hai
  if (loading) {
    return <p>Loading...</p>;
  }

  // 🔒 not logged in
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed
  return children;
};

export default ProtectedRoute;