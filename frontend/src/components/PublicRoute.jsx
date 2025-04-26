import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen'; // Import LoadingScreen

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;