
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarInset, SidebarTrigger } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
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

export default Layout;
