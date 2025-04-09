
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem as ShadcnSidebarMenuItem } from '@/components/ui/sidebar';
import { MenuItem } from './SidebarTypes';

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarMenuItemComponent = ({ item, isActive, onClick }: SidebarMenuItemProps) => {
  return (
    <ShadcnSidebarMenuItem>
      <SidebarMenuButton
        asChild={!item.children}
        isActive={isActive}
        tooltip={item.title}
        onClick={item.children ? onClick : undefined}
      >
        {item.path ? (
          <Link 
            to={item.path} 
            className={cn(
              "w-full",
              isActive && "font-medium"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {item.icon}
              <span>{item.title}</span>
            </div>
            <ChevronRight size={16} />
          </div>
        )}
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
};

export default SidebarMenuItemComponent;
