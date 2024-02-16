import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    console.log('NON USER');

    // user is not authenticated
    return <Navigate to="/login" />;
  }

  console.log('USER');

  return <Outlet />;
};
