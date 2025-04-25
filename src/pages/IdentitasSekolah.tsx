import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { getCurrentUser, updateUserProfile } from '@/lib/authService';

interface SchoolFormData {
  schoolName: string;
  npsn: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  district: string;
  principalName: string;
  principalNip: string;
  treasurerName: string;
  goodsUserName: string;
  goodsOperatorName: string;
  seniorTeacherName: string;
  city: string;
  postalCode: string;
}

const defaultFormData: SchoolFormData = {
  schoolName: "",
  npsn: "",
  email: "",
  password: "******",
  phone: "",
  address: "",
  district: "",
  principalName: "",
  principalNip: "",
  treasurerName: "",
  goodsUserName: "",
  goodsOperatorName: "",
  seniorTeacherName: "",
  city: "",
  postalCode: ""
};

const IdentitasSekolah = () => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<SchoolFormData>(defaultFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get current user data
    const currentUser = getCurrentUser();
    
    if (currentUser?.firstLogin) {
      setIsFirstLogin(true);
      
      // Pre-fill what we know about the user
      setFormData(prevData => ({
        ...prevData,
        npsn: currentUser.npsn || "",
        email: currentUser.email || ""
      }));
    } else {
      setIsFirstLogin(false);
    }
    
    // Try to load data from localStorage if available
    const savedData = localStorage.getItem(`school-identity-${currentUser?.email}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setIsEdit(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [mapIdToField(id)]: value
    }));
  };

  const mapIdToField = (id: string): keyof SchoolFormData => {
    const mapping: Record<string, keyof SchoolFormData> = {
      'nama-sekolah': 'schoolName',
      'npsn': 'npsn',
      'email': 'email',
      'password': 'password',
      'nomor-telepon': 'phone',
      'alamat': 'address',
      'kecamatan': 'district',
      'nama-kepala-sekolah': 'principalName',
      'nip-kepala-sekolah': 'principalNip',
      'nama-bendahara': 'treasurerName',
      'nama-pengguna-barang': 'goodsUserName',
      'nama-operator-barang': 'goodsOperatorName',
      'nama-guru-senior': 'seniorTeacherName',
      'kota': 'city',
      'kode-pos': 'postalCode'
    };
    return mapping[id] || ('schoolName' as keyof SchoolFormData);
  };

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  const handleSave = async () => {
    if (!formData.schoolName) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Nama sekolah harus diisi"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.email) {
        throw new Error("Data pengguna tidak ditemukan");
      }
      
      // Save to localStorage with user-specific key
      localStorage.setItem(`school-identity-${currentUser.email}`, JSON.stringify(formData));
      
      // Update user profile if first login
      if (isFirstLogin) {
        await updateUserProfile(currentUser.email, {
          name: formData.schoolName,
          firstLogin: false
        });
      }
      
      // Add notification
      const actionType = isEdit ? 'diubah' : 'tersimpan';
      addNotification(
        `Data Identitas Sekolah Anda telah berhasil ${actionType}.`,
        'identity'
      );
      
      toast({
        title: "Sukses",
        description: `Data sekolah berhasil ${actionType}`,
      });
      
      setIsEdit(true);
      setIsFirstLogin(false);
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Identitas Sekolah">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Profil Sekolah</h2>
        <p className="text-gray-500 text-sm">Kelola informasi identitas sekolah yang akan muncul di faktur</p>
        {isFirstLogin && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              Ini adalah login pertama Anda. Silakan lengkapi data identitas sekolah.
            </p>
          </div>
        )}
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-1">Informasi Sekolah</h3>
        <p className="text-gray-500 text-sm mb-6">Update informasi sekolah untuk ditampilkan pada dokumen faktur</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="nama-sekolah">Nama Sekolah</Label>
              <Input 
                id="nama-sekolah" 
                value={formData.schoolName} 
                onChange={handleInputChange} 
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="npsn">NPSN</Label>
              <Input 
                id="npsn" 
                value={formData.npsn} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="nomor-telepon">Nomor Telepon</Label>
              <Input 
                id="nomor-telepon" 
                value={formData.phone} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="alamat">Alamat</Label>
              <Input 
                id="alamat" 
                value={formData.address} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="kecamatan">Kecamatan</Label>
              <Input 
                id="kecamatan" 
                value={formData.district} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nama-kepala-sekolah">Nama Kepala Sekolah</Label>
              <Input 
                id="nama-kepala-sekolah" 
                value={formData.principalName} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="nip-kepala-sekolah">NIP Kepala Sekolah</Label>
              <Input 
                id="nip-kepala-sekolah" 
                value={formData.principalNip} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="nama-bendahara">Nama Bendahara</Label>
              <Input 
                id="nama-bendahara" 
                value={formData.treasurerName} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="nama-pengguna-barang">Nama Pengguna Barang</Label>
              <Input 
                id="nama-pengguna-barang" 
                value={formData.goodsUserName} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="nama-operator-barang">Nama Operator Barang</Label>
              <Input 
                id="nama-operator-barang" 
                value={formData.goodsOperatorName} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="nama-guru-senior">Nama Guru Senior</Label>
              <Input 
                id="nama-guru-senior" 
                value={formData.seniorTeacherName} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="kota">Kota</Label>
              <Input 
                id="kota" 
                value={formData.city} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="kode-pos">Kode Pos</Label>
              <Input 
                id="kode-pos" 
                value={formData.postalCode} 
                onChange={handleInputChange} 
                className="mt-1" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8 gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>Reset</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default IdentitasSekolah;
