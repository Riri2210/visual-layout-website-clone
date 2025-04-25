import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUserRole, getCurrentUser } from '@/lib/authService';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
  requiresFirstLogin?: boolean;
}

/**
 * Component for protecting routes based on user roles
 * @param allowedRoles - Array of roles that can access this route (if empty, any authenticated user can access)
 * @param redirectPath - Path to redirect if user doesn't have permission (defaults to dashboard)
 * @param requiresFirstLogin - If true, the component will redirect to identity page on first login
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectPath = '/',
  requiresFirstLogin = false
}) => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  const userRole = getCurrentUserRole();
  const currentUser = getCurrentUser();
  const isFirstLogin = currentUser?.firstLogin;

  // If user isn't logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If this is first login and not going to identitas-sekolah, redirect there first
  if (isFirstLogin && requiresFirstLogin && location.pathname !== '/identitas-sekolah') {
    return <Navigate to="/identitas-sekolah" replace />;
  }

  // If roles are specified and user's role is not in the allowed roles, redirect
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  // If all checks pass, render the route's content
  return <>{children}</>;
};

export default RoleBasedRoute;
