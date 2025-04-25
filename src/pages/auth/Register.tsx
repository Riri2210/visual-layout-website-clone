import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { HMILogoCircle } from '@/components/HMILogo';
import { Mail } from 'lucide-react';

const Register = () => {
  const [npsn, setNpsn] = useState('');
  const [email, setEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderEmail] = useState('admincv@harumimultiinovasi.com');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update recipient email whenever email changes
  useEffect(() => {
    if (email) {
      setRecipientEmail(email);
    } else {
      setRecipientEmail('');
    }
  }, [email]);

  // Generate a random temporary password
  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempPassword = '';
    for (let i = 0; i < 8; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return tempPassword;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!npsn || !email) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "NPSN dan email harus diisi"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Cek apakah email sudah terdaftar
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((user: any) => user.email === email);
      
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Registrasi Gagal",
          description: "Email sudah terdaftar. Silakan gunakan email lain atau login."
        });
        setLoading(false);
        return;
      }
      
      // Generate temporary password
      const tempPassword = generateTempPassword();
      
      // Simulasi pengiriman email
      // Dalam implementasi nyata, ini akan memanggil API untuk mengirim email
      console.log(`Sending email to ${email} with temporary password: ${tempPassword}`);
      
      // Simpan user baru ke localStorage
      const newUser = {
        npsn,
        email,
        password: tempPassword,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: "Registrasi Berhasil",
        description: "Kata sandi sementara telah dikirim ke email Anda. Silakan periksa kotak masuk email Anda."
      });
      
      // Redirect ke halaman login setelah registrasi berhasil
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registrasi Gagal",
        description: "Terjadi kesalahan saat registrasi"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <HMILogoCircle />
          <h2 className="mt-4 text-xl text-center text-gray-900">
            Silakan registrasi terlebih dahulu jika belum memiliki akun
          </h2>
        </div>
        
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Mendaftar</h2>
              <Link to="/login" className="text-blue-600 hover:underline">
                Masuk &gt;
              </Link>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="npsn" className="block text-sm font-medium text-gray-700">
                  NPSN
                </label>
                <Input
                  id="npsn"
                  type="text"
                  value={npsn}
                  onChange={(e) => setNpsn(e.target.value)}
                  placeholder="Nomor Pokok Sekolah Nasional"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Alamat email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email sekolah Anda"
                  required
                  className="w-full"
                />
              </div>
              
              <div className="mt-8 bg-blue-50 p-4 rounded-md">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-blue-800">kirimkan saya kata sandi sementara</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700">
                      Penerima Surat
                    </label>
                    <Select disabled value={recipientEmail || "placeholder"}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Masukkan email Anda terlebih dahulu" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientEmail && (
                          <SelectItem value={recipientEmail}>{recipientEmail}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700">
                      Pengirim Surat
                    </label>
                    <Select disabled value={senderEmail}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue>{senderEmail}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={senderEmail}>{senderEmail}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    Coba gunakan pengirim email lain jika Anda tidak dapat menerima email kami. 
                    Jangan lupa untuk memeriksa spam/email sampah Anda, dan pastikan kotak surat 
                    Anda masih memiliki ruang untuk menerima email baru.
                  </p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-teal-700 hover:bg-teal-800" 
                disabled={loading}
              >
                {loading ? "Memproses..." : "Buat Akun Saya"}
              </Button>
              
              <div className="text-center">
                <Link to="/login" className="text-teal-700 hover:underline text-sm">
                  Punya akun?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
