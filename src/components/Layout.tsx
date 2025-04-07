
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarInset, SidebarTrigger, SidebarProvider, useSidebar } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const LayoutContent = ({ children, title }: LayoutProps) => {
  const { setOpen } = useSidebar();

  // Add a click handler for the document to collapse sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside of sidebar
      if (
        !target.closest('[data-sidebar="sidebar"]') && 
        !target.closest('[data-sidebar="trigger"]') &&
        !target.closest('[data-sidebar="rail"]')
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      
      <SidebarInset className="relative flex-1">
        <div className="p-4 md:p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger className="mr-2 md:hidden" />
            <Header title={title} />
          </div>
          {children}
        </div>
      </SidebarInset>
    </div>
  );
};

const Layout = (props: LayoutProps) => {
  // Set defaultOpen to false to start with a collapsed sidebar
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent {...props} />
    </SidebarProvider>
  );
};

export default Layout;
