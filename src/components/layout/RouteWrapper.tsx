
import React from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from './AppLayout';

interface RouteWrapperProps {
  children: React.ReactNode;
}

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children }) => {
  const location = useLocation();
  
  // Skip layout for authentication pages
  if (location.pathname.startsWith('/auth/')) {
    return <>{children}</>;
  }
  
  return (
    <AppLayout currentPath={location.pathname}>
      {children}
    </AppLayout>
  );
};

export default RouteWrapper;
