import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import useFetch from '../hooks/useFetch';
import { USER_SESSION } from '../api/routes';
import { API_STATES } from '../constants/ApiEnum';

export const ProtectedRoute = () => {
  const { token, user } = useAuth();

  if (!token) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
