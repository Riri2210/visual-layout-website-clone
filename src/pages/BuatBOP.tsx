
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const BuatBOP = () => {
  return (
    <Layout title="Buat BOP">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Buat BOP Baru</h1>
        <p className="text-sm text-gray-500">Isi detail di bawah untuk membuat faktur Bantuan Operasional Pendidikan (BOP)</p>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Informasi Faktur</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="sumber-dana">Sumber Dana</Label>
              <Select defaultValue="bop">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih Sumber Dana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bop">BOP - Bantuan Operasional Pendidikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tanggal-kegiatan">Tanggal Kegiatan</Label>
              <Input id="tanggal-kegiatan" type="date" defaultValue="2025-04-04" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nama-kegiatan">Nama Kegiatan</Label>
              <Input id="nama-kegiatan" placeholder="Masukkan nama kegiatan" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="kode-rekening">Kode Rekening</Label>
              <Input id="kode-rekening" placeholder="Masukkan kode rekening" className="mt-1" />
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Detail Barang</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full mb-4">
              <thead>
                <tr>
                  <th className="table-header">Nama Barang</th>
                  <th className="table-header">Harga Total</th>
                  <th className="table-header">Qty</th>
                  <th className="table-header">Satuan</th>
                  <th className="table-header">Harga Satuan</th>
                  <th className="table-header">PPN</th>
                  <th className="table-header">PPh</th>
                  <th className="table-header">Netto</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="table-cell">
                    <Input placeholder="Nama barang" />
                  </td>
                  <td className="table-cell">
                    <Input type="number" defaultValue={0} />
                  </td>
                  <td className="table-cell">
                    <Input type="number" defaultValue={1} />
                  </td>
                  <td className="table-cell">
                    <Select defaultValue="unit">
                      <SelectTrigger>
                        <SelectValue placeholder="Satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="buah">Buah</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="table-cell">
                    <Input type="number" defaultValue={0} />
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center">
                      <Checkbox id="ppn" />
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center">
                      <Checkbox id="pph" />
                    </div>
                  </td>
                  <td className="table-cell">
                    <span>Rp 0</span>
                  </td>
                  <td className="table-cell">
                    <Button variant="ghost" size="sm">
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <Button variant="outline" className="w-full">
            + Tambah Item
          </Button>
        </div>
      </Card>
      
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Ringkasan</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pratinjau-faktur">Pratinjau Faktur</Label>
              <Textarea 
                id="pratinjau-faktur"
                className="w-full mt-1 p-2 border rounded-md resize-none h-32"
                placeholder="Isi formulir untuk melihat pratinjau faktur"
                readOnly
              ></Textarea>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Subtotal</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Total PPN</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Total PPh</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Diskon</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Administrasi</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between py-2 border-t border-dashed">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">Rp 0</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 gap-2">
            <Button variant="outline">Pratinjau</Button>
            <Button variant="outline">Simpan Draft</Button>
            <Button>Buat Faktur</Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default BuatBOP;
