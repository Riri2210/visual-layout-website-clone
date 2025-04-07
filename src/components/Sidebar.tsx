import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Folder
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
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const [navigationStack, setNavigationStack] = useState<{ title: string; items: MenuItem[] }[]>([]);
  const [currentItems, setCurrentItems] = useState<MenuItem[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string>("");
  
  const menuItems: MenuSection[] = [
    { section: 'MENU UTAMA', items: [
      { title: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
      { 
        title: 'Pengaturan', 
        icon: <Settings size={18} />, 
        children: [
          { title: 'General', icon: <Settings size={18} />, path: '/pengaturan/general' },
          { title: 'Akun', icon: <Settings size={18} />, path: '/pengaturan/akun' },
        ]
      },
    ]},
    { section: 'FAKTUR', items: [
      { 
        title: 'Buat Faktur', 
        icon: <FileText size={18} />,
        children: [
          { title: 'BOS', icon: <FileText size={18} />, path: '/buat-bos' },
          { title: 'BOP', icon: <FileText size={18} />, path: '/buat-bop' },
        ]
      },
      { title: 'Riwayat Faktur', icon: <ClipboardList size={18} />, path: '/riwayat-faktur' },
    ]},
    { section: 'PENGATURAN', items: [
      { title: 'Identitas Sekolah', icon: <School size={18} />, path: '/identitas-sekolah' },
      { title: 'Keluar', icon: <LogOut size={18} />, path: '/keluar' },
    ]},
  ];

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

  React.useEffect(() => {
    if (currentItems.length === 0 && navigationStack.length === 0) {
      setCurrentItems([]);
      setCurrentTitle("");
    }
  }, [currentItems, navigationStack]);

  const renderItems = () => {
    if (currentItems.length > 0) {
      return (
        <div className="mb-4">
          <div className="px-4 py-2 text-xs tracking-wider text-sidebar-foreground/70 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackClick} 
              className="mr-1 p-1 h-auto"
            >
              <ChevronLeft size={16} />
            </Button>
            {currentTitle}
          </div>
          
          <SidebarMenu>
            {currentItems.map((item, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton
                  asChild={!item.children}
                  isActive={item.path ? location.pathname === item.path : false}
                  tooltip={item.title}
                  onClick={item.children ? () => handleSubmenuClick(item.title, item.children) : undefined}
                >
                  {item.path ? (
                    <Link 
                      to={item.path} 
                      className={cn(
                        "w-full",
                        location.pathname === item.path && "font-medium"
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      );
    }
    
    return menuItems.map((section, index) => (
      <div key={index} className="mb-4">
        <div className="px-4 py-2 text-xs tracking-wider text-sidebar-foreground/70">
          {section.section}
        </div>
        
        <SidebarMenu>
          {section.items.map((item, idx) => (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton
                asChild={!item.children}
                isActive={item.path ? location.pathname === item.path : false}
                tooltip={item.title}
                onClick={item.children ? () => handleSubmenuClick(item.title, item.children) : undefined}
              >
                {item.path ? (
                  <Link 
                    to={item.path} 
                    className={cn(
                      "w-full",
                      location.pathname === item.path && "font-medium"
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    ));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <ShadcnSidebar className="border-r">
        <SidebarHeader className="flex items-center justify-center py-4 relative">
          <Logo />
          <SidebarToggle />
        </SidebarHeader>
        
        <SidebarContent>
          {renderItems()}
        </SidebarContent>
      </ShadcnSidebar>
    </TooltipProvider>
  );
};

export default Sidebar;
