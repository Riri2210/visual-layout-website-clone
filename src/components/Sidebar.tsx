
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, ClipboardList, School, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
};

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

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { section: 'MENU UTAMA', items: [
      { title: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
      { title: 'Pengaturan', icon: <Settings size={18} />, path: '/pengaturan' },
    ]},
    { section: 'FAKTUR', items: [
      { title: 'BOS', icon: <FileText size={18} />, path: '/buat-bos' },
      { title: 'BOP', icon: <FileText size={18} />, path: '/buat-bop' },
      { title: 'Riwayat Faktur', icon: <ClipboardList size={18} />, path: '/riwayat-faktur' },
    ]},
    { section: 'PENGATURAN', items: [
      { title: 'Identitas Sekolah', icon: <School size={18} />, path: '/identitas-sekolah' },
      { title: 'Keluar', icon: <LogOut size={18} />, path: '/keluar' },
    ]},
  ];

  return (
    <SidebarWrapper>
      <ShadcnSidebar className="border-r">
        <SidebarHeader className="flex items-center justify-center py-4 relative">
          <Logo />
          <SidebarToggle />
        </SidebarHeader>
        
        <SidebarContent>
          {menuItems.map((section, index) => (
            <div key={index} className="mb-4">
              <div className="px-4 py-2 text-xs tracking-wider text-sidebar-foreground/70">
                {section.section}
              </div>
              
              <SidebarMenu>
                {section.items.map((item, idx) => (
                  <SidebarMenuItem key={idx}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                    >
                      <Link to={item.path} className={cn(
                        "w-full",
                        location.pathname === item.path && "font-medium"
                      )}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          ))}
        </SidebarContent>
      </ShadcnSidebar>
    </SidebarWrapper>
  );
};

export default Sidebar;
