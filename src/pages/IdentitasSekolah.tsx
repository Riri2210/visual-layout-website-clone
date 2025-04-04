
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const IdentitasSekolah = () => {
  return (
    <Layout title="Identitas Sekolah">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Profil Sekolah</h2>
        <p className="text-gray-500 text-sm">Kelola informasi identitas sekolah yang akan muncul di faktur</p>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-1">Informasi Sekolah</h3>
        <p className="text-gray-500 text-sm mb-6">Update informasi sekolah untuk ditampilkan pada dokumen faktur</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="nama-sekolah">Nama Sekolah</Label>
              <Input id="nama-sekolah" defaultValue="SDN Baru 07 Pagi" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="npsn">NPSN</Label>
              <Input id="npsn" defaultValue="65365" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="baru07@gmail.com" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="******" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nomor-telepon">Nomor Telepon</Label>
              <Input id="nomor-telepon" defaultValue="021-5615360" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="alamat">Alamat</Label>
              <Input id="alamat" defaultValue="Jl. RA. Fadilah Rt 001/001 Kel. Baru" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="kecamatan">Kecamatan</Label>
              <Input id="kecamatan" defaultValue="Pasar Rebo" className="mt-1" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nama-kepala-sekolah">Nama Kepala Sekolah</Label>
              <Input id="nama-kepala-sekolah" defaultValue="Widarto, S.Pd.MM" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nip-kepala-sekolah">NIP Kepala Sekolah</Label>
              <Input id="nip-kepala-sekolah" defaultValue="196511161991022001" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nama-bendahara">Nama Bendahara</Label>
              <Input id="nama-bendahara" defaultValue="Lestari, S.Pd" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nama-pengguna-barang">Nama Pengguna Barang</Label>
              <Input id="nama-pengguna-barang" defaultValue="Ahmad Ubay, S.Pd.I" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nama-operator-barang">Nama Operator Barang</Label>
              <Input id="nama-operator-barang" defaultValue="Eva Adi Putra" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="nama-guru-senior">Nama Guru Senior</Label>
              <Input id="nama-guru-senior" defaultValue="Ambar Rukminingsih, S.Pd" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="kota">Kota</Label>
              <Input id="kota" defaultValue="Jakarta Timur" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="kode-pos">Kode Pos</Label>
              <Input id="kode-pos" defaultValue="13780" className="mt-1" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8 gap-2">
          <Button variant="outline">Reset</Button>
          <Button>Simpan Perubahan</Button>
        </div>
      </Card>
    </Layout>
  );
};

export default IdentitasSekolah;
