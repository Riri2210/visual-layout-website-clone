import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Key
} from 'lucide-react';
import { getCurrentUser, changePassword } from '@/lib/authService';

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  npsn: z.string().min(1, {
    message: "NPSN is required."
  }),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const securitySchema = z.object({
  twoFactorAuth: z.boolean().default(false),
});

const AccountSettings = () => {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  
  // Load the school identity data
  const schoolIdentityKey = `school-identity-${currentUser?.email}`;
  const schoolData = JSON.parse(localStorage.getItem(schoolIdentityKey) || '{}');
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || schoolData?.schoolName || '',
      email: currentUser?.email || '',
      npsn: currentUser?.npsn || '',
      bio: schoolData?.bio || 'Administrator Sistem Faktur Sekolah',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      twoFactorAuth: false,
    },
  });

  // Update the form when user data changes
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name || schoolData?.schoolName || '',
        email: currentUser.email || '',
        npsn: currentUser.npsn || '',
        bio: schoolData?.bio || 'Administrator Sistem Faktur Sekolah',
      });
    }
  }, [currentUser, schoolData]);

  function onSaveProfile(values: z.infer<typeof profileSchema>) {
    // In a real app, we would update the user profile in the database
    // For now, we just show a success message
    
    // Also update the school identity data to keep them in sync
    if (schoolData) {
      const updatedSchoolData = { ...schoolData, schoolName: values.name };
      localStorage.setItem(schoolIdentityKey, JSON.stringify(updatedSchoolData));
    }
    
    toast({
      title: "Profil tersimpan",
      description: "Perubahan profil berhasil disimpan.",
    });
  }

  async function onChangePassword(values: z.infer<typeof passwordSchema>) {
    try {
      if (!currentUser?.email) {
        throw new Error("User email not found");
      }
      
      await changePassword(
        currentUser.email,
        values.currentPassword,
        values.newPassword
      );
      
      toast({
        title: "Password diubah",
        description: "Password anda berhasil diubah.",
      });
      
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal mengubah password",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    }
  }

  function onSaveSecurity(values: z.infer<typeof securitySchema>) {
    toast({
      title: "Pengaturan keamanan tersimpan",
      description: "Perubahan pengaturan keamanan berhasil disimpan.",
    });
  }

  return (
    <Layout title="Pengaturan Akun">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Pengaturan Akun</h2>
        <p className="text-gray-500 text-sm">
          Kelola informasi dan pengaturan akun Anda
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Kelola informasi profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{currentUser?.name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{currentUser?.email || 'user@example.com'}</p>
                </div>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Sekolah</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nama lengkap sekolah" />
                          </FormControl>
                          <FormDescription>
                            Nama ini akan ditampilkan dalam sistem dan invoice.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Email sekolah Anda" disabled />
                          </FormControl>
                          <FormDescription>
                            Email ini digunakan untuk login ke sistem.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="npsn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NPSN</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nomor Pokok Sekolah Nasional" disabled />
                          </FormControl>
                          <FormDescription>
                            Nomor Pokok Sekolah Nasional yang terdaftar.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Deskripsi singkat tentang Anda" />
                          </FormControl>
                          <FormDescription>
                            Informasi tambahan tentang sekolah.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Simpan Perubahan</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Ubah password akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Saat Ini</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Masukkan password saat ini" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Baru</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Masukkan password baru" />
                          </FormControl>
                          <FormDescription>
                            Password minimal 8 karakter.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konfirmasi Password Baru</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Konfirmasi password baru" />
                          </FormControl>
                          <FormDescription>
                            Ulangi password baru untuk konfirmasi.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Ubah Password</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>
                Kelola pengaturan keamanan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSaveSecurity)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Shield size={20} className="text-green-500" />
                      <div>
                        <p className="font-medium">Status Keamanan Akun</p>
                        <p className="text-sm text-muted-foreground">Akun Anda dalam keadaan aman</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Key size={18} />
                        Akses Login
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Kelola bagaimana Anda login ke akun
                      </p>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">Login Terakhir</h4>
                            <p className="text-sm text-muted-foreground">
                              Jakarta, Indonesia - {new Date().toLocaleDateString('id-ID', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Detail</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Bell size={18} />
                        Notifikasi Keamanan
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Kelola notifikasi terkait keamanan akun
                      </p>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Peringatan</h4>
                            <p className="text-sm text-muted-foreground">
                              Terima email jika ada aktivitas mencurigakan
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Aktifkan</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Simpan Pengaturan</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default AccountSettings;
