import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return null;

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
