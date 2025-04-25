import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
  title: string;
}

interface User {
  username: string;
  name?: string;
  email?: string;
}

const Header = ({ title }: HeaderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.name) {
      const names = user.name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.name[0].toUpperCase();
    }
    
    return user.username[0].toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    return user.name || user.username;
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari..." 
            className="pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48"
          />
        </div>
        
        <NotificationDropdown />
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary text-white">
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{getDisplayName()}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
