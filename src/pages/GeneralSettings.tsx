
import React, { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Languages, 
  Calendar, 
  Mail, 
  Clock, 
  Users, 
  User, 
  Home 
} from 'lucide-react';

const formSchema = z.object({
  siteTitle: z.string().min(2, {
    message: "Site title must be at least 2 characters.",
  }),
  siteLogo: z.string().optional(),
  siteDescription: z.string().optional(),
  adminEmail: z.string().email({
    message: "Please enter a valid email.",
  }),
  timeZone: z.string(),
  dateFormat: z.string(),
  language: z.string(),
  allowRegistration: z.boolean().default(false),
  dashboardView: z.string().default('default'),
});

const GeneralSettings = () => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteTitle: 'Sistem Faktur Sekolah',
      siteLogo: '',
      siteDescription: 'Platform manajemen faktur untuk sekolah',
      adminEmail: 'admin@sekolah.id',
      timeZone: 'Asia/Jakarta',
      dateFormat: 'DD/MM/YYYY',
      language: 'id',
      allowRegistration: false,
      dashboardView: 'default',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Pengaturan tersimpan",
      description: "Perubahan pengaturan berhasil disimpan.",
    });
    console.log(values);
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout title="Pengaturan General">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Pengaturan General</h2>
        <p className="text-gray-500 text-sm">
          Konfigurasi pengaturan dasar untuk aplikasi
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
          <TabsTrigger value="display">Tampilan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Situs</CardTitle>
              <CardDescription>
                Konfigurasi dasar untuk situs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="siteTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Home size={16} />
                              Judul Situs
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan judul situs" {...field} />
                            </FormControl>
                            <FormDescription>
                              Judul yang akan ditampilkan pada browser dan beberapa tempat lainnya.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="siteLogo"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Logo Situs
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                {logoPreview && (
                                  <div className="w-32 h-32 relative rounded-md border overflow-hidden">
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                                  </div>
                                )}
                                <Input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    onChange(e.target.value);
                                    handleLogoChange(e);
                                  }} 
                                  {...fieldProps} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Unggah gambar untuk logo situs. Disarankan berukuran 512x512px.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="siteDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deskripsi Situs</FormLabel>
                            <FormControl>
                              <Input placeholder="Deskripsi singkat tentang situs" {...field} />
                            </FormControl>
                            <FormDescription>
                              Deskripsi singkat yang menjelaskan tujuan situs.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="adminEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail size={16} />
                              Email Administrasi
                            </FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="admin@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              Email yang akan digunakan untuk komunikasi sistem.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeZone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock size={16} />
                              Zona Waktu
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih zona waktu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
                                <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
                                <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Zona waktu yang digunakan dalam aplikasi.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dateFormat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar size={16} />
                              Format Tanggal
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih format tanggal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                <SelectItem value="D MMMM YYYY">D MMMM YYYY</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Format yang digunakan untuk menampilkan tanggal.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Languages size={16} />
                              Bahasa
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih bahasa" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Bahasa yang digunakan dalam antarmuka aplikasi.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pengguna</CardTitle>
              <CardDescription>
                Kelola pengaturan yang berhubungan dengan pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="allowRegistration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            <Users size={16} />
                            Izinkan Pendaftaran Pengguna
                          </FormLabel>
                          <FormDescription>
                            Mengizinkan siapa saja untuk mendaftar akun pada situs ini.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Manajemen Pengguna</h3>
                    <p className="text-sm text-muted-foreground">
                      Kelola pengguna yang telah terdaftar pada sistem.
                    </p>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User size={16} />
                      Buka Manajemen Pengguna
                    </Button>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">Simpan Pengaturan</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tampilan</CardTitle>
              <CardDescription>
                Konfigurasi tampilan aplikasi untuk pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="dashboardView"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe size={16} />
                          Tampilan Dashboard Default
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tampilan default" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="default">Standard</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="expanded">Expanded</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Tampilan default yang akan dilihat pengguna saat login.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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

export default GeneralSettings;
