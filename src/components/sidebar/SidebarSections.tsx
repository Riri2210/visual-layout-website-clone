import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarMenu } from '@/components/ui/sidebar';
import SidebarMenuItemComponent from './SidebarMenuItem';
import { MenuSection } from './SidebarTypes';

interface SidebarSectionsProps {
  menuSections: MenuSection[];
  onItemClick: (title: string, items: any[]) => void;
}

const SidebarSections = ({ menuSections, onItemClick }: SidebarSectionsProps) => {
  const location = useLocation();

  return (
    <>
      {menuSections.map((section, index) => (
        <div key={index} className="mb-6">
          <div className="px-4 py-2 text-xs font-medium tracking-wider text-sidebar-foreground/80 uppercase border-b border-border/40 mb-2">
            {section.section}
          </div>
          
          <SidebarMenu>
            {section.items.map((item, idx) => (
              <SidebarMenuItemComponent 
                key={idx} 
                item={item} 
                isActive={item.path ? location.pathname === item.path : false}
                onClick={() => item.children && onItemClick(item.title, item.children)}
              />
            ))}
          </SidebarMenu>
        </div>
      ))}
    </>
  );
};

export default SidebarSections;
