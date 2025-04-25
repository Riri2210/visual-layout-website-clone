import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  ClipboardList, 
  School, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronRight, 
  ChevronLeft, 
  Folder,
  Globe,
  User,
} from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout, getCurrentUserRole, getCurrentUser } from '@/lib/authService';
import { useToast } from '@/hooks/use-toast';

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

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  onClick?: () => void;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = getCurrentUserRole();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari HMI System",
    });
    navigate('/login');
  };

  // Only show these menu items to regular users
  const userMenuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/',
      active: location.pathname === '/',
    },
    {
      label: 'Identitas Sekolah',
      icon: <School size={20} />,
      path: '/identitas-sekolah',
      active: location.pathname === '/identitas-sekolah',
    },
    {
      label: 'Buat Faktur',
      icon: <FileText size={20} />,
      active: location.pathname === '/buat-bos' || location.pathname === '/buat-bop',
      submenu: [
        {
          label: 'BOS',
          path: '/buat-bos',
          active: location.pathname === '/buat-bos',
        },
        {
          label: 'BOP',
          path: '/buat-bop',
          active: location.pathname === '/buat-bop',
        },
      ],
    },
    {
      label: 'Riwayat Faktur',
      icon: <ClipboardList size={20} />,
      path: '/riwayat-faktur',
      active: location.pathname === '/riwayat-faktur',
    },
    {
      label: 'Pengaturan',
      icon: <Settings size={20} />,
      active: location.pathname.includes('/pengaturan'),
      submenu: [
        {
          label: 'Akun',
          path: '/pengaturan/akun',
          active: location.pathname === '/pengaturan/akun',
        },
      ],
    },
  ];

  // Admin has access to additional menu items
  const adminMenuItems = [
    ...userMenuItems,
    {
      label: 'SPJ',
      icon: <Folder size={20} />,
      path: '/spj',
      active: location.pathname === '/spj',
    },
    {
      label: 'Pengaturan',
      icon: <Settings size={20} />,
      active: location.pathname.includes('/pengaturan'),
      submenu: [
        {
          label: 'Akun',
          path: '/pengaturan/akun',
          active: location.pathname === '/pengaturan/akun',
        },
        {
          label: 'General',
          path: '/pengaturan/general',
          active: location.pathname === '/pengaturan/general',
        },
      ],
    },
  ];

  // Choose which menu items to display based on role
  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <ShadcnSidebar 
      className={cn(
        "border-r bg-white shadow-sm h-screen fixed top-0 left-0",
        state === 'expanded' ? 'min-w-[260px] max-w-[260px]' : 'min-w-[80px] max-w-[80px]',
        isMobile && 'hidden'
      )}
    >
      <SidebarHeader className="p-4">
        <div className={cn(
          "flex", 
          state === 'expanded' ? "justify-between items-center" : "justify-center"
        )}>
          <div className="w-auto h-10">
            {state === 'expanded' ? (
              <div>
                <Logo className="h-10 w-auto" />
              </div>
            ) : (
              <div>
                <Logo className="h-10 w-auto" />
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="h-[calc(100vh-80px)] flex flex-col justify-between pb-4">
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.submenu ? (
                <SidebarMenuButton 
                  expanded={state === 'expanded'} 
                  active={item.active}
                  className="mb-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {state === 'expanded' && <span>{item.label}</span>}
                    </div>
                    {state === 'expanded' && (
                      item.active ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
                    )}
                  </div>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuItem 
                  asChild 
                  active={item.active}
                  className="mb-1"
                >
                  <Link to={item.path} className="w-full">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {state === 'expanded' && <span>{item.label}</span>}
                    </div>
                  </Link>
                </SidebarMenuItem>
              )}
              
              {item.submenu && item.active && state === 'expanded' && (
                <div className="ml-10 mb-2 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <SidebarMenuItem 
                      key={subIndex} 
                      asChild 
                      active={subItem.active}
                      className="pl-0"
                    >
                      <Link to={subItem.path} className="w-full">
                        <div className="flex items-center gap-3">
                          <span>{subItem.label}</span>
                        </div>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </SidebarMenu>
        
        <div className="mt-auto">
          <SidebarMenuItem asChild>
            <Link to="/pengaturan/akun" className="w-full">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6" />
                {state === 'expanded' && <span>{currentUser?.name || 'User'}</span>}
              </div>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem onClick={handleLogout} asChild>
            <button className="w-full">
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-red-500" />
                {state === 'expanded' && <span className="text-red-500">Logout</span>}
              </div>
            </button>
          </SidebarMenuItem>
        </div>
      </SidebarContent>
      
      <SidebarToggle />
    </ShadcnSidebar>
  );
};

export default Sidebar;
