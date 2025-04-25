import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationProvider } from "./contexts/NotificationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IdentitasSekolah from "./pages/IdentitasSekolah";
import RiwayatFaktur from "./pages/RiwayatFaktur";
import BuatBOS from "./pages/BuatBOS";
import BuatBOP from "./pages/BuatBOP";
import NotFound from "./pages/NotFound";
import GeneralSettings from "./pages/GeneralSettings";
import AccountSettings from "./pages/AccountSettings";
import SPJ from "./pages/SPJ";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Favicon from "./components/Favicon"; 
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Inisialisasi localStorage untuk users jika belum ada
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    
    // Add a default admin user if none exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const adminUser = {
        npsn: "12345",
        name: "Admin HMI",
        email: "admin@hmi.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
        firstLogin: false
      };
      
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Favicon />
            <Routes>
              {/* Rute Autentikasi */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Basic Protected Routes */}
              <Route path="/" element={
                <RoleBasedRoute>
                  <Dashboard />
                </RoleBasedRoute>
              } />
              
              {/* Routes requiring first login check */}
              <Route path="/identitas-sekolah" element={
                <RoleBasedRoute requiresFirstLogin={true}>
                  <IdentitasSekolah />
                </RoleBasedRoute>
              } />
              
              {/* User accessible routes */}
              <Route path="/riwayat-faktur" element={
                <RoleBasedRoute>
                  <RiwayatFaktur />
                </RoleBasedRoute>
              } />
              <Route path="/buat-bos" element={
                <RoleBasedRoute>
                  <BuatBOS />
                </RoleBasedRoute>
              } />
              <Route path="/bos" element={
                <RoleBasedRoute>
                  <Navigate to="/buat-bos" replace />
                </RoleBasedRoute>
              } />
              <Route path="/buat-bop" element={
                <RoleBasedRoute>
                  <BuatBOP />
                </RoleBasedRoute>
              } />
              <Route path="/bop" element={
                <RoleBasedRoute>
                  <Navigate to="/buat-bop" replace />
                </RoleBasedRoute>
              } />
              
              {/* Admin-only routes */}
              <Route path="/spj" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <SPJ />
                </RoleBasedRoute>
              } />
              <Route path="/pengaturan/general" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <GeneralSettings />
                </RoleBasedRoute>
              } />
              
              {/* User settings */}
              <Route path="/pengaturan/akun" element={
                <RoleBasedRoute>
                  <AccountSettings />
                </RoleBasedRoute>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
