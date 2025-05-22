import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) return null; // or a loading spinner

  // If authenticated, redirect to /Dashboard
  if (isAuthenticated) {
    return <Navigate to="/Dashboard" replace />;
  }

  // Otherwise, render the public route (login/register)
  return <Outlet />;
};

export default PublicRoute;