
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, ClipboardList, School, LogOut } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { section: 'MENU UTAMA', items: [
      { title: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
      { title: 'Pengaturan', icon: <Settings size={18} />, path: '/pengaturan' },
    ]},
    { section: 'FAKTUR', items: [
      { title: 'BOS', icon: <FileText size={18} />, path: '/bos' },
      { title: 'BOP', icon: <FileText size={18} />, path: '/bop' },
      { title: 'Riwayat Faktur', icon: <ClipboardList size={18} />, path: '/riwayat-faktur' },
    ]},
    { section: 'PENGATURAN', items: [
      { title: 'Identitas Sekolah', icon: <School size={18} />, path: '/identitas-sekolah' },
      { title: 'Keluar', icon: <LogOut size={18} />, path: '/keluar' },
    ]},
  ];

  return (
    <div className="h-screen w-64 flex flex-col bg-sidebar fixed">
      <Logo />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        {menuItems.map((section, index) => (
          <div key={index} className="py-2">
            <div className="px-4 py-2 text-xs tracking-wider text-sidebar-foreground/70">
              {section.section}
            </div>
            
            {section.items.map((item, idx) => (
              <Link 
                key={idx} 
                to={item.path}
                className={cn(
                  "sidebar-link", 
                  location.pathname === item.path && "active-sidebar-link"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
