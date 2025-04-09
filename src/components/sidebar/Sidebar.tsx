
import React, { useState, useEffect } from 'react';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { TooltipProvider } from "@/components/ui/tooltip";
import Logo from '@/components/Logo';
import SidebarToggle from './SidebarToggle';
import SidebarMenuItems from './SidebarMenuItems';
import SidebarSections from './SidebarSections';
import { useSidebarData } from './SidebarData';
import { MenuItem } from './SidebarTypes';

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const menuItems = useSidebarData();
  
  const [navigationStack, setNavigationStack] = useState<{ title: string; items: MenuItem[] }[]>([]);
  const [currentItems, setCurrentItems] = useState<MenuItem[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  
  const handleSubmenuClick = (title: string, items: MenuItem[]) => {
    setNavigationStack([...navigationStack, { title: currentTitle, items: currentItems }]);
    setCurrentItems(items);
    setCurrentTitle(title);
  };

  const handleBackClick = () => {
    if (navigationStack.length > 0) {
      const prevLevel = navigationStack.pop();
      if (prevLevel) {
        setCurrentItems(prevLevel.items);
        setCurrentTitle(prevLevel.title);
        setNavigationStack([...navigationStack]);
      } else {
        setCurrentItems([]);
        setCurrentTitle("");
      }
    }
  };

  useEffect(() => {
    if (currentItems.length === 0 && navigationStack.length === 0) {
      setCurrentItems([]);
      setCurrentTitle("");
    }
  }, [currentItems, navigationStack]);

  return (
    <TooltipProvider delayDuration={300}>
      <ShadcnSidebar className="border-r">
        <SidebarHeader className="flex items-center justify-center py-4 relative">
          <Logo />
          <SidebarToggle />
        </SidebarHeader>
        
        <SidebarContent>
          {currentItems.length > 0 ? (
            <SidebarMenuItems 
              currentItems={currentItems}
              currentTitle={currentTitle}
              onItemClick={handleSubmenuClick}
              onBackClick={handleBackClick}
              navigationStack={navigationStack}
            />
          ) : (
            <SidebarSections 
              menuSections={menuItems}
              onItemClick={handleSubmenuClick}
            />
          )}
        </SidebarContent>
      </ShadcnSidebar>
    </TooltipProvider>
  );
};

export default Sidebar;
