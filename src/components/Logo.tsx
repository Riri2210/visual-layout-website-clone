import React from 'react';
import { Link } from 'react-router-dom';
import HMILogo from './HMILogo';
import { useSidebar } from './ui/sidebar';

const Logo = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  return (
    <Link to="/" className="flex items-center gap-2 p-4 bg-sidebar-hover">
      <HMILogo type="square" />
      {!isCollapsed && <span className="text-white text-xl font-semibold">HMI System</span>}
    </Link>
  );
};

export default Logo;
