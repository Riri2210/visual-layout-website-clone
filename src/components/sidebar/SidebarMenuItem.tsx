import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem as ShadcnSidebarMenuItem } from '@/components/ui/sidebar';
import { MenuItem } from './SidebarTypes';
import { useSidebar } from '@/components/ui/sidebar';

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarMenuItemComponent = ({ item, isActive, onClick }: SidebarMenuItemProps) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  // Check if this item or any of its children are active
  const checkIsActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    
    if (item.children) {
      return item.children.some(child => checkIsActive(child));
    }
    
    return false;
  };
  
  // Determine if this item should be highlighted
  const shouldHighlight = isActive || checkIsActive(item);

  return (
    <ShadcnSidebarMenuItem>
      <SidebarMenuButton
        asChild={!item.children}
        isActive={shouldHighlight}
        tooltip={isCollapsed ? item.title : undefined}
        onClick={item.children ? onClick : undefined}
        className={cn(
          "transition-all duration-200 hover:bg-accent",
          shouldHighlight && "bg-accent/50"
        )}
      >
        {item.path ? (
          <Link 
            to={item.path} 
            className={cn(
              "w-full flex items-center gap-3 py-2",
              shouldHighlight && "font-medium text-primary"
            )}
          >
            <span className={cn(
              "flex-shrink-0",
              shouldHighlight && "text-primary"
            )}>
              {item.icon}
            </span>
            <span className={cn(
              isCollapsed && "opacity-0 w-0 overflow-hidden group-data-[collapsible=icon]:!opacity-0",
              "transition-opacity duration-200"
            )}>
              {item.title}
            </span>
          </Link>
        ) : (
          <div className="flex items-center justify-between w-full py-2">
            <div className={cn(
              "flex items-center gap-3",
              shouldHighlight && "font-medium text-primary"
            )}>
              <span className="flex-shrink-0">{item.icon}</span>
              <span className={cn(
                isCollapsed && "opacity-0 w-0 overflow-hidden group-data-[collapsible=icon]:!opacity-0",
                "transition-opacity duration-200"
              )}>
                {item.title}
              </span>
            </div>
            <span className={cn(
              "text-xs",
              isCollapsed && "hidden"
            )}>▶</span>
          </div>
        )}
      </SidebarMenuButton>
    </ShadcnSidebarMenuItem>
  );
};

export default SidebarMenuItemComponent;
