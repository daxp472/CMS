import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ 
  allowedRoles, 
  children, 
  fallback = <div className="text-center py-12 text-gray-400">Access Denied</div> 
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback;
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
};

export default RoleBasedAccess;