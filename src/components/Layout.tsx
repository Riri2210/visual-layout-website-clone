
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 pl-64">
        <main className="p-6">
          <Header title={title} />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
