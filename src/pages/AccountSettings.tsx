
import React from 'react';
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

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
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
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Admin Sekolah',
      email: 'admin@sekolah.id',
      username: 'adminsek',
      bio: 'Administrator Sistem Faktur Sekolah',
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

  function onSaveProfile(values: z.infer<typeof profileSchema>) {
    toast({
      title: "Profil tersimpan",
      description: "Perubahan profil berhasil disimpan.",
    });
    console.log(values);
  }

  function onChangePassword(values: z.infer<typeof passwordSchema>) {
    toast({
      title: "Password diubah",
      description: "Password anda berhasil diubah.",
    });
    console.log(values);
    passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }

  function onSaveSecurity(values: z.infer<typeof securitySchema>) {
    toast({
      title: "Pengaturan keamanan tersimpan",
      description: "Perubahan pengaturan keamanan berhasil disimpan.",
    });
    console.log(values);
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
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>
                Kelola informasi profil Anda di sini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">Foto Profil</h3>
                      <p className="text-sm text-muted-foreground">
                        Unggah foto untuk profil Anda
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" type="button">
                          Unggah Foto
                        </Button>
                        <Button size="sm" variant="outline" type="button">
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User size={16} />
                            Nama Lengkap
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nama lengkap Anda" {...field} />
                          </FormControl>
                          <FormDescription>
                            Nama ini akan ditampilkan pada profil Anda.
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
                            <Input type="email" placeholder="Email Anda" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email ini akan digunakan untuk komunikasi dan login.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username Anda" {...field} />
                          </FormControl>
                          <FormDescription>
                            Username untuk login ke sistem.
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
                            <Input placeholder="Deskripsi singkat tentang Anda" {...field} />
                          </FormControl>
                          <FormDescription>
                            Deskripsi singkat tentang Anda.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Simpan Profil</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Ubah Password</CardTitle>
              <CardDescription>
                Update password akun Anda
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
                          <FormLabel className="flex items-center gap-2">
                            <Lock size={16} />
                            Password Saat Ini
                          </FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan password Anda saat ini.
                          </FormDescription>
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
                            <Input type="password" placeholder="••••••••" {...field} />
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
                          <FormLabel>Konfirmasi Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            Masukkan password baru sekali lagi.
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
                              Jakarta, Indonesia - 05 Apr 2025, 09:45
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
