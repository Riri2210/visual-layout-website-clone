
import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  ClipboardList, 
  School, 
  LogOut,
  Globe,
  User,
  FileCheck
} from 'lucide-react';
import { MenuSection } from './SidebarTypes';

export const useSidebarData = (): MenuSection[] => {
  const menuItems: MenuSection[] = [
    { section: 'MENU UTAMA', items: [
      { title: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
      { title: 'Identitas Sekolah', icon: <School size={18} />, path: '/identitas-sekolah' },
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
      { title: 'SPJ', icon: <FileCheck size={18} />, path: '/spj' },
    ]},
    { section: 'PENGATURAN', items: [
      { 
        title: 'Pengaturan', 
        icon: <Settings size={18} />, 
        children: [
          { title: 'General', icon: <Globe size={18} />, path: '/pengaturan/general' },
          { title: 'Akun', icon: <User size={18} />, path: '/pengaturan/akun' },
        ]
      },
      { title: 'Keluar', icon: <LogOut size={18} />, path: '/keluar' },
    ]},
  ];

  return menuItems;
};
