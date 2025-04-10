import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Eye, Save, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  formatCurrency, 
  generateInvoiceNumber, 
  calculatePPN, 
  calculatePPH, 
  saveInvoiceToHistory,
  calculateAdministration 
} from '@/lib/formatUtils';
import InvoicePreview from '@/components/InvoicePreview';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  ppn: boolean;
  pph: boolean;
  pphPercentage?: string;
  netto: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  recipient: string;
  items: Item[];
  totalBeforeTax: number;
  ppnAmount: number;
  pphAmount: number;
  grandTotal: number;
  activityName: string;
  accountCode: string;
  administrationAmount: number;
}

const calculateNetto = (item: Omit<Item, 'netto'>): number => {
  const subtotal = item.quantity * item.unitPrice;
  
  const ppnAmount = item.ppn ? calculatePPN(subtotal) : 0;
  
  let pphPercentageValue = 0;
  if (item.pph && item.pphPercentage) {
    pphPercentageValue = parseFloat(item.pphPercentage.replace('%', ''));
  }
  
  const pphAmount = item.pph ? calculatePPH(subtotal, ppnAmount, pphPercentageValue) : 0;
  
  return subtotal + ppnAmount - pphAmount;
};

const getMonthName = (monthNumber: number): string => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthNumber - 1];
};

const getDayName = (date: Date): string => {
  const days = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  return days[date.getDay()];
};

const getRomanMonth = (monthNumber: number): string => {
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romanMonths[monthNumber - 1];
};

const BuatBOS = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [invoiceInfo, setInvoiceInfo] = useState({
    fundSource: 'bos',
    activityDate: new Date().toISOString().split('T')[0],
    activityName: '',
    accountCode: '',
    recipient: '',
    transactionNumber: '001'
  });

  const [items, setItems] = useState<Item[]>([
    {
      id: '1',
      name: '',
      totalPrice: 0,
      quantity: 1,
      unit: 'unit',
      unitPrice: 0,
      ppn: false,
      pph: false,
      pphPercentage: undefined,
      netto: 0
    }
  ]);

  const [summary, setSummary] = useState({
    subtotal: 0,
    totalPPN: 0,
    totalPPH: 0,
    totalNetto: 0,
    adminFourPercent: 0,
    adminOnePercent: 0,
    administration: 0,
    sekolahAmount: 0,
    total: 0
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const lastTransactionNumber = localStorage.getItem('lastBOSTransactionNumber');
    if (lastTransactionNumber) {
      const nextNumber = (parseInt(lastTransactionNumber) + 1).toString().padStart(3, '0');
      setInvoiceInfo(prev => ({ ...prev, transactionNumber: nextNumber }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const calculateSummary = (items: Item[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    const totalPPN = items.reduce((sum, item) => {
      if (!item.ppn) return sum;
      return sum + calculatePPN(item.quantity * item.unitPrice);
    }, 0);
    
    const totalPPH = items.reduce((sum, item) => {
      if (!item.pph) return sum;
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemPPN = item.ppn ? calculatePPN(itemSubtotal) : 0;
      const pphPercentage = item.pphPercentage ? parseFloat(item.pphPercentage.replace('%', '')) : 2;
      return sum + calculatePPH(itemSubtotal, itemPPN, pphPercentage);
    }, 0);
    
    const totalNetto = subtotal + totalPPN - totalPPH;
    
    const adminFourPercent = totalNetto * 0.04;
    const adminOnePercent = totalNetto * 0.01;
    const administration = adminFourPercent + adminOnePercent;
    
    const sekolahAmount = totalNetto - administration;
    
    const total = sekolahAmount;
    
    return {
      subtotal,
      totalPPN,
      totalPPH,
      totalNetto,
      adminFourPercent,
      adminOnePercent,
      administration,
      sekolahAmount,
      total
    };
  };

  const updateItemAndRecalculate = (index: number, updatedItem: Partial<Item>) => {
    const newItems = [...items];
    
    newItems[index] = {
      ...newItems[index],
      ...updatedItem,
    };

    if (updatedItem.quantity !== undefined || updatedItem.unitPrice !== undefined) {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }

    if (newItems[index].ppn || newItems[index].pph) {
      const itemSubtotal = newItems[index].quantity * newItems[index].unitPrice;
      const itemPPN = newItems[index].ppn ? calculatePPN(itemSubtotal) : 0;
      
      let pphPercentageValue = 0;
      if (newItems[index].pph && newItems[index].pphPercentage) {
        pphPercentageValue = parseFloat(newItems[index].pphPercentage.replace('%', ''));
      }
      
      const pphAmount = newItems[index].pph ? calculatePPH(itemSubtotal, itemPPN, pphPercentageValue) : 0;
      
      newItems[index].netto = itemSubtotal - itemPPN - pphAmount;
    } else {
      newItems[index].netto = newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
    
    const newSummary = calculateSummary(newItems);
    setSummary(newSummary);
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    if (field === 'pph') {
      updateItemAndRecalculate(index, { 
        pph: value !== false, 
        pphPercentage: value !== false ? value : undefined 
      });
    } else {
      updateItemAndRecalculate(index, { [field]: value });
    }
  };

  const handleAddItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: '',
      totalPrice: 0,
      quantity: 1,
      unit: 'unit',
      unitPrice: 0,
      ppn: false,
      pph: false,
      pphPercentage: undefined,
      netto: 0
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length === 1) {
      toast({
        title: "Tidak dapat menghapus",
        description: "Harus ada setidaknya satu item",
        variant: "destructive"
      });
      return;
    }

    const newItems = items.filter((_, idx) => idx !== index);
    setItems(newItems);
    
    const newSummary = calculateSummary(newItems);
    setSummary(newSummary);
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleSaveDraft = () => {
    const draft = {
      invoiceInfo,
      items,
      summary
    };
    
    localStorage.setItem('bos-draft', JSON.stringify(draft));
    
    toast({
      title: "Draft Tersimpan",
      description: "Faktur BOS telah disimpan sebagai draft"
    });
  };

  const handleCreateInvoice = () => {
    if (!invoiceInfo.activityName) {
      toast({
        title: "Validasi Gagal",
        description: "Harap isi nama kegiatan",
        variant: "destructive"
      });
      return;
    }
    
    if (items.some(item => !item.name || item.unitPrice <= 0)) {
      toast({
        title: "Validasi Gagal",
        description: "Harap lengkapi semua detail item dan pastikan harga valid",
        variant: "destructive"
      });
      return;
    }
    
    const invoiceNumber = generateInvoiceNumber();
    const currentDate = new Date();
    const dayName = getDayName(currentDate);
    
    const invoiceData = {
      no_faktur: invoiceNumber,
      tanggal: `${dayName}, ${currentDate.getDate()} ${getMonthName(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`,
      sumber_dana: invoiceInfo.fundSource.toUpperCase(),
      kegiatan: invoiceInfo.activityName,
      total: formatCurrency(summary.total),
      items,
      summary,
      accountCode: invoiceInfo.accountCode,
      recipient: invoiceInfo.recipient,
      activityDate: invoiceInfo.activityDate,
      transactionNumber: invoiceInfo.transactionNumber
    };
    
    localStorage.setItem('lastBOSTransactionNumber', invoiceInfo.transactionNumber);
    
    saveInvoiceToHistory(invoiceData);
    
    toast({
      title: "Faktur Dibuat",
      description: "Faktur BOS telah berhasil dibuat dan disimpan ke riwayat faktur"
    });

    setPreviewOpen(true);
    
    setTimeout(() => {
      navigate('/riwayat-faktur');
    }, 2500);
  };

  const getInvoicePreviewData = () => {
    const activityDateParts = invoiceInfo.activityDate.split('-');
    const activityDate = new Date(
      parseInt(activityDateParts[0]), 
      parseInt(activityDateParts[1]) - 1, 
      parseInt(activityDateParts[2])
    );
    const dayName = getDayName(activityDate);
    
    return {
      invoiceNumber: generateInvoiceNumber(),
      date: `${dayName}, ${activityDateParts[2]} ${getMonthName(parseInt(activityDateParts[1]))} ${activityDateParts[0]}`,
      recipient: invoiceInfo.recipient || 'Sekolah',
      items: items,
      totalBeforeTax: summary.subtotal,
      ppnAmount: summary.totalPPN,
      pphAmount: summary.totalPPH,
      administrationAmount: summary.administration,
      grandTotal: summary.total,
      activityName: invoiceInfo.activityName,
      accountCode: invoiceInfo.accountCode || 'BOS-2025'
    };
  };

  const getSuratPesananPlaceholder = () => {
    const currentDate = new Date();
    const month = getRomanMonth(currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();
    return `ex: 001/PK.01.01/${month}/${year}`;
  };

  return (
    <Layout title="Buat BOS">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Buat BOS Baru</h1>
        <p className="text-sm text-gray-500">Isi detail di bawah untuk membuat faktur Bantuan Operasional Sekolah (BOS)</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Jenis Transaksi</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fundSource">Sumber Dana</Label>
              <Select 
                defaultValue={invoiceInfo.fundSource} 
                onValueChange={(value) => handleSelectChange('fundSource', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih Sumber Dana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bos">BOS - Bantuan Operasional Sekolah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="activityDate">Tanggal Kegiatan</Label>
              <Input 
                id="activityDate" 
                name="activityDate"
                type="date" 
                value={invoiceInfo.activityDate} 
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="activityName">Nama Kegiatan</Label>
              <Input 
                id="activityName" 
                name="activityName"
                placeholder="Masukkan nama kegiatan" 
                value={invoiceInfo.activityName} 
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="accountCode">Nama Kode Rekening</Label>
              <Input 
                id="accountCode" 
                name="accountCode"
                placeholder="Masukkan nama kode rekening" 
                value={invoiceInfo.accountCode} 
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="recipient">Nomor Surat Pesanan</Label>
              <Input 
                id="recipient" 
                name="recipient"
                placeholder={getSuratPesananPlaceholder()}
                value={invoiceInfo.recipient} 
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="transactionNumber">Nomor Transaksi</Label>
              <Input 
                id="transactionNumber" 
                name="transactionNumber"
                value={invoiceInfo.transactionNumber} 
                readOnly
                className="mt-1 bg-gray-100" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Detail Barang</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Nama Barang</TableHead>
                  <TableHead className="text-right">Harga Total</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead className="text-right">Harga Satuan</TableHead>
                  <TableHead className="text-center">PPN</TableHead>
                  <TableHead className="text-center">PPh</TableHead>
                  <TableHead className="text-right">Netto</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input 
                        placeholder="Nama barang" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input 
                        type="number" 
                        value={item.totalPrice} 
                        readOnly 
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        min={1}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={item.unit} 
                        onValueChange={(value) => handleItemChange(index, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Satuan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit">Unit</SelectItem>
                          <SelectItem value="pcs">Pcs</SelectItem>
                          <SelectItem value="buah">Buah</SelectItem>
                          <SelectItem value="paket">Paket</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.unitPrice} 
                        min={0}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseInt(e.target.value) || 0)}
                        className="text-right"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox 
                          id={`ppn-${item.id}`} 
                          checked={item.ppn} 
                          onCheckedChange={(checked) => handleItemChange(index, 'ppn', checked === true)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Select 
                          value={item.pph ? (item.pphPercentage || '2%') : 'false'} 
                          onValueChange={(value) => handleItemChange(index, 'pph', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="PPh" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Tidak ada PPh</SelectItem>
                            <SelectItem value="0.5%">0.5%</SelectItem>
                            <SelectItem value="1.5%">1.5%</SelectItem>
                            <SelectItem value="2%">2%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span>{formatCurrency(item.netto)}</span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Button variant="outline" className="w-full mt-4" onClick={handleAddItem}>
            + Tambah Item
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Ringkasan</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Bruto</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Total PPN</span>
                <span>{formatCurrency(summary.totalPPN)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Total PPh</span>
                <span>{formatCurrency(summary.totalPPH)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-dashed">
                <span className="font-medium">Total Netto</span>
                <span>{formatCurrency(summary.totalNetto)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">4%</span>
                <span>{formatCurrency(summary.adminFourPercent)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">1%</span>
                <span>{formatCurrency(summary.adminOnePercent)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Admin</span>
                <span>{formatCurrency(summary.administration)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Sekolah</span>
                <span>{formatCurrency(summary.sekolahAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-dashed">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatCurrency(summary.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-8 gap-2">
            <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
              <Eye size={16} />
              Pratinjau
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
              <Save size={16} />
              Simpan Draft
            </Button>
            <Button onClick={handleCreateInvoice} className="flex items-center gap-2">
              <FileText size={16} />
              Buat Faktur
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pratinjau Faktur</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <InvoicePreview data={getInvoicePreviewData()} />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Tutup</Button>
            <Button onClick={() => window.print()}>Cetak</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BuatBOS;
