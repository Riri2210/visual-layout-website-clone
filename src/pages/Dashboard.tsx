
import React from 'react';
import Layout from '@/components/Layout';
import { FileText, Search, PlusCircle, Calendar, School } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const fakturTerbaru = [
    {
      no_faktur: 'HMI-F/25040170/AGI',
      tanggal: '-',
      sumber_dana: 'BOS',
      kegiatan: 'Pengadaan Alat Elektronik',
      total: 'Rp 5.304.000',
    },
    {
      no_faktur: 'HMI-F/25040130/AGI',
      tanggal: '-',
      sumber_dana: 'BOS',
      kegiatan: 'Pengadaan Alat Elektronik',
      total: 'Rp 5.967.000',
    }
  ];

  return (
    <Layout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Faktur</p>
              <h3 className="text-3xl font-bold mt-2">7</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-md">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Dana BOS</p>
              <h3 className="text-3xl font-bold mt-2">Rp 32.784.514</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-md">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Dana BOP</p>
              <h3 className="text-3xl font-bold mt-2">Rp 5.349.694</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-md">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Faktur Bulan Ini</p>
              <h3 className="text-3xl font-bold mt-2">0</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-md">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <h2 className="section-title mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Link to="/buat-bos">
          <Card className="h-32 p-4 flex flex-col items-center justify-center hover:bg-gray-50 border border-dashed cursor-pointer">
            <PlusCircle className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-center">Buat Faktur BOS</h3>
            <p className="text-xs text-gray-500">Bantuan Operasional Sekolah</p>
          </Card>
        </Link>
        
        <Link to="/buat-bop">
          <Card className="h-32 p-4 flex flex-col items-center justify-center hover:bg-gray-50 border border-dashed cursor-pointer">
            <PlusCircle className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-center">Buat Faktur BOP</h3>
            <p className="text-xs text-gray-500">Bantuan Operasional Pendidikan</p>
          </Card>
        </Link>
        
        <Link to="/riwayat-faktur">
          <Card className="h-32 p-4 flex flex-col items-center justify-center hover:bg-gray-50 border border-dashed cursor-pointer">
            <Search className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-center">Cari Faktur</h3>
            <p className="text-xs text-gray-500">Lihat riwayat faktur</p>
          </Card>
        </Link>
      </div>
      
      {/* Recent Faktur */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Faktur Terbaru</h2>
        <Link to="/riwayat-faktur">
          <Button variant="link" className="text-primary">Lihat Semua</Button>
        </Link>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">NO. FAKTUR</th>
                <th className="table-header">TANGGAL</th>
                <th className="table-header">SUMBER DANA</th>
                <th className="table-header">KEGIATAN</th>
                <th className="table-header">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {fakturTerbaru.map((faktur, index) => (
                <tr key={index}>
                  <td className="table-cell">{faktur.no_faktur}</td>
                  <td className="table-cell">{faktur.tanggal}</td>
                  <td className="table-cell">{faktur.sumber_dana}</td>
                  <td className="table-cell">{faktur.kegiatan}</td>
                  <td className="table-cell font-medium">{faktur.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* School Info */}
      <div className="mt-8">
        <h2 className="section-title">Informasi Sekolah</h2>
        <Card className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <School className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">SDN Baru 07 Pagi</h3>
              <p className="text-gray-500">Jakarta Timur</p>
              <p className="text-sm text-gray-500 mt-1">NPSN: 65365</p>
            </div>
          </div>
          <Link to="/identitas-sekolah">
            <Button variant="outline">Lihat Detail</Button>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
