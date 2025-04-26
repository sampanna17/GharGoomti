import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function RoleBasedRedirect() {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    const isLogout = location.state?.fromLogout;
    if (isLogout) {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  
  return <Navigate to="/home" replace />;
}

export default RoleBasedRedirect;