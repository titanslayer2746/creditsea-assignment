import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: ("user" | "verifier" | "admin")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // ✅ Redirect if not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ Redirect if role is not authorized
  if (!allowedRoles.includes(user.role as "user" | "verifier" | "admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
