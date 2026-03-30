import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuth, loading } = useSelector((state) => state.auth);

  // ✅ Jab tak fetchUser chal raha hai, kuch mat dikhao
  if (loading) {
    return <p>Loading...</p>;
  }

  // ✅ Already logged in hain toh home pe bhejo
  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;