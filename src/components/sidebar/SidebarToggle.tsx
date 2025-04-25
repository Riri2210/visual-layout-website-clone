import React from 'react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const SidebarToggle = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className="absolute right-0 top-4 z-30 w-6 h-6 -mr-3 bg-primary text-primary-foreground border border-border rounded-full flex items-center justify-center shadow-sm hidden md:flex hover:bg-primary/90"
      title={state === 'collapsed' ? 'Expand Sidebar' : 'Collapse Sidebar'}
    >
      <span className="text-xs font-bold">
        {state === 'collapsed' ? '►' : '◄'}
      </span>
    </Button>
  );
};

export default SidebarToggle;
