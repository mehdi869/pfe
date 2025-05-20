import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.user_type !== "admin" && user?.user_type !== "Admin") {
    return <Navigate to="/NotFound" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;