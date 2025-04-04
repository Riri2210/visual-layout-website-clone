
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Eye, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RiwayatFaktur = () => {
  const fakturData = [
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
    },
    {
      no_faktur: 'HMI-F/25040251/AGI',
      tanggal: '-',
      sumber_dana: 'BOS',
      kegiatan: 'Pengadaan Alat Elektronik',
      total: 'Rp 21.513.514',
    }
  ];

  return (
    <Layout title="Riwayat Faktur">
      {/* Filter Section */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Filter dan Pencarian</h2>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci</label>
              <Input placeholder="Cari faktur..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Faktur</label>
              <Select defaultValue="semua">
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="bos">BOS</SelectItem>
                  <SelectItem value="bop">BOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan Berdasarkan</label>
              <Select defaultValue="tanggal">
                <SelectTrigger>
                  <SelectValue placeholder="Tanggal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tanggal">Tanggal</SelectItem>
                  <SelectItem value="no_faktur">No Faktur</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arah Urutan</label>
              <Select defaultValue="terbaru">
                <SelectTrigger>
                  <SelectValue placeholder="Terbaru Dulu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terbaru">Terbaru Dulu</SelectItem>
                  <SelectItem value="terlama">Terlama Dulu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Result Table */}
      <h2 className="text-lg font-medium mb-4">Daftar Faktur</h2>
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
                <th className="table-header">TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {fakturData.map((faktur, index) => (
                <tr key={index}>
                  <td className="table-cell">{faktur.no_faktur}</td>
                  <td className="table-cell">{faktur.tanggal}</td>
                  <td className="table-cell">{faktur.sumber_dana}</td>
                  <td className="table-cell">{faktur.kegiatan}</td>
                  <td className="table-cell font-medium">{faktur.total}</td>
                  <td className="table-cell">
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Edit size={16} className="text-blue-600" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye size={16} className="text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <FileText size={16} className="text-gray-600" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Printer size={16} className="text-gray-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default RiwayatFaktur;
