
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/identitas-sekolah" element={<IdentitasSekolah />} />
          <Route path="/riwayat-faktur" element={<RiwayatFaktur />} />
          <Route path="/buat-bos" element={<BuatBOS />} />
          <Route path="/bos" element={<Navigate to="/buat-bos" replace />} />
          <Route path="/buat-bop" element={<BuatBOP />} />
          <Route path="/bop" element={<Navigate to="/buat-bop" replace />} />
          <Route path="/spj" element={<SPJ />} />
          <Route path="/pengaturan/general" element={<GeneralSettings />} />
          <Route path="/pengaturan/akun" element={<AccountSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
