
import React from 'react';
import { Graduation } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 p-4 bg-sidebar-hover">
      <Graduation className="h-8 w-8 text-white" />
      <span className="text-white text-xl font-semibold">HMI System</span>
    </Link>
  );
};

export default Logo;
