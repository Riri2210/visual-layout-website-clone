
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SidebarMenu } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import SidebarMenuItemComponent from './SidebarMenuItem';
import { MenuItem } from './SidebarTypes';

interface SidebarMenuItemsProps {
  currentItems: MenuItem[];
  currentTitle: string;
  onItemClick: (title: string, items: MenuItem[]) => void;
  onBackClick: () => void;
  navigationStack: { title: string; items: MenuItem[] }[];
}

const SidebarMenuItems = ({ 
  currentItems, 
  currentTitle, 
  onItemClick, 
  onBackClick, 
  navigationStack 
}: SidebarMenuItemsProps) => {
  const location = useLocation();

  if (currentItems.length > 0) {
    return (
      <div className="mb-4">
        <div className="px-4 py-2 text-xs tracking-wider text-sidebar-foreground/70 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBackClick} 
            className="mr-1 p-1 h-auto"
          >
            <ChevronLeft size={16} />
          </Button>
          {currentTitle}
        </div>
        
        <SidebarMenu>
          {currentItems.map((item, idx) => (
            <SidebarMenuItemComponent 
              key={idx} 
              item={item} 
              isActive={item.path ? location.pathname === item.path : false}
              onClick={() => item.children && onItemClick(item.title, item.children)}
            />
          ))}
        </SidebarMenu>
      </div>
    );
  }
  
  return null;
};

export default SidebarMenuItems;
