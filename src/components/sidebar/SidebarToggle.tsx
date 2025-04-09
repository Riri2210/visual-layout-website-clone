
import React from 'react';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const SidebarToggle = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className="absolute top-4 -right-10 z-30 hidden md:flex"
    >
      {state === 'collapsed' ? (
        <PanelLeftOpen size={20} />
      ) : (
        <PanelLeftClose size={20} />
      )}
    </Button>
  );
};

export default SidebarToggle;
