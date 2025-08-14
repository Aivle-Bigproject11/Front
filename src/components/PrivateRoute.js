import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedUserTypes }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Optionally render a loading spinner or message while auth state is being determined
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && user && !allowedUserTypes.includes(user.userType)) {
    // Authenticated, but userType is not allowed for this route
    // Redirect to a default page based on userType or a generic unauthorized page
    if (user.userType === 'employee') {
      return <Navigate to="/" replace />; // Employee trying to access user page
    } else if (user.userType === 'user') {
      return <Navigate to="/lobby" replace />; // User trying to access employee page
    }
    // Fallback for unexpected userType or if no specific redirect is defined
    return <Navigate to="/unauthorized" replace />; 
  }

  // Authenticated and userType is allowed, render the child routes
  return <Outlet />;
};

export default PrivateRoute;