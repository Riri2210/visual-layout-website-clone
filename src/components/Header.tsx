
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
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
        
        <button className="relative p-2">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary text-white">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">admin1</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
