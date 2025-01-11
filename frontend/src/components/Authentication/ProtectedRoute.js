import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token || !allowedRoles.includes(role)) {
    alert('You are not authorized to access this page!');
    return <Navigate to="/login" replace />;
  }

  return children;
}


export default ProtectedRoute;
