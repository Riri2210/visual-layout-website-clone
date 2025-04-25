import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { HMILogoSquare } from '@/components/HMILogo';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Email dan kata sandi harus diisi"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Use the login function from authService
      const user = await login(email, password);
      
      // Simpan info login ke session storage (bukan local storage agar hilang ketika browser ditutup)
      sessionStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        npsn: user.npsn,
        role: user.role,
        isLoggedIn: true,
        firstLogin: user.firstLogin
      }));
      
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di HMI System"
      });
      
      // Check if this is first login to redirect to identity page
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      
      if (currentUser.firstLogin) {
        // Redirect to identity page for first time users
        navigate('/identitas-sekolah');
      } else {
        // Redirect to dashboard
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat login"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <HMILogoSquare />
          <h1 className="mt-6 text-3xl font-bold text-center text-gray-900">
            SELAMAT DATANG DI<br />HMI SYSTEM
          </h1>
        </div>
        
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Masuk</h2>
              <Link to="/register" className="text-blue-600 hover:underline">
                Daftar &gt;
              </Link>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Sekolah
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
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Kata sandi / Kata sandi sementara
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi Anda"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-teal-700 hover:bg-teal-800" 
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
              
              <div className="text-center">
                <Link to="/register" className="text-teal-700 hover:underline text-sm">
                  Butuh akun?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
