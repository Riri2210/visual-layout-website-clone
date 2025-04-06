import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Eye, Save, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
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
import { formatCurrency, generateInvoiceNumber, calculatePPN, calculatePPH, saveInvoiceToHistory } from '@/lib/formatUtils';
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
}

const calculateNetto = (item: Omit<Item, 'netto'>): number => {
  const subtotal = item.quantity * item.unitPrice;
  
  // Use new PPN formula if PPN is enabled
  const ppnAmount = item.ppn ? calculatePPN(subtotal) : 0;
  
  // Use new PPH formula if PPH is enabled
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

// Removing the local InvoicePreview component since we're importing it from @/components/InvoicePreview

const BuatBOP = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [invoiceInfo, setInvoiceInfo] = useState({
    fundSource: 'bop',
    activityDate: new Date().toISOString().split('T')[0],
    activityName: '',
    accountCode: '',
    recipient: 'Kepala SDN BARU 07'
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
    discount: 0,
    administration: 0,
    total: 0
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const calculateSummary = (items: Item[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Calculate PPN using the new formula
    const totalPPN = items.reduce((sum, item) => {
      if (!item.ppn) return sum;
      return sum + calculatePPN(item.quantity * item.unitPrice);
    }, 0);
    
    // Calculate PPH using the new formula
    const totalPPH = items.reduce((sum, item) => {
      if (!item.pph) return sum;
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemPPN = item.ppn ? calculatePPN(itemSubtotal) : 0;
      const pphPercentage = item.pphPercentage ? parseFloat(item.pphPercentage.replace('%', '')) : 2;
      return sum + calculatePPH(itemSubtotal, itemPPN, pphPercentage);
    }, 0);
    
    // We're keeping discount and administration at 0 for now
    const total = subtotal + totalPPN - totalPPH;
    
    return {
      subtotal,
      totalPPN,
      totalPPH,
      discount: 0,
      administration: 0,
      total
    };
  };

  const updateItemAndRecalculate = (index: number, updatedItem: Partial<Item>) => {
    const newItems = [...items];
    
    newItems[index] = {
      ...newItems[index],
      ...updatedItem,
    };

    // Calculate netto for this specific item
    const itemWithoutNetto = {
      ...newItems[index],
      ...updatedItem,
    };
    newItems[index].netto = calculateNetto(itemWithoutNetto);
    
    // Auto-calculate total price based on quantity and unit price
    if (updatedItem.quantity !== undefined || updatedItem.unitPrice !== undefined) {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
    
    // Recalculate summary
    const newSummary = calculateSummary(newItems);
    setSummary(newSummary);
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    if (field === 'pph') {
      const pphPercentages = {
        false: 0,
        '0.5%': 0.005,
        '1.5%': 0.015,
        '2%': 0.02
      };
      
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
    
    // Recalculate summary
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
    
    // In a real app, you'd save this to localStorage or a database
    localStorage.setItem('bop-draft', JSON.stringify(draft));
    
    toast({
      title: "Draft Tersimpan",
      description: "Faktur BOP telah disimpan sebagai draft"
    });
  };

  const handleCreateInvoice = () => {
    // Validate form
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
    
    // Create invoice data object
    const invoiceNumber = generateInvoiceNumber();
    const currentDate = new Date();
    
    const invoiceData = {
      no_faktur: invoiceNumber,
      tanggal: `${currentDate.getDate()} ${getMonthName(currentDate.getMonth() + 1)} ${currentDate.getFullYear()}`,
      sumber_dana: invoiceInfo.fundSource.toUpperCase(),
      kegiatan: invoiceInfo.activityName,
      total: formatCurrency(summary.total),
      items,
      summary,
      accountCode: invoiceInfo.accountCode,
      recipient: invoiceInfo.recipient,
      activityDate: invoiceInfo.activityDate
    };
    
    // Save invoice data to history
    saveInvoiceToHistory(invoiceData);
    
    toast({
      title: "Faktur Dibuat",
      description: "Faktur BOP telah berhasil dibuat dan disimpan ke riwayat faktur"
    });

    // Open the preview after creating
    setPreviewOpen(true);
    
    // After a short delay, navigate to the invoice history page
    setTimeout(() => {
      navigate('/riwayat-faktur');
    }, 2500);
  };

  const getInvoicePreviewData = () => {
    return {
      invoiceNumber: generateInvoiceNumber(),
      date: `Tanggal ${invoiceInfo.activityDate.split('-')[2]} ${getMonthName(parseInt(invoiceInfo.activityDate.split('-')[1], 10))} ${invoiceInfo.activityDate.split('-')[0]}`,
      recipient: invoiceInfo.recipient,
      items: items,
      totalBeforeTax: summary.subtotal,
      ppnAmount: summary.totalPPN,
      pphAmount: summary.totalPPH,
      grandTotal: summary.total,
      activityName: invoiceInfo.activityName,
      accountCode: invoiceInfo.accountCode || '15291/PK.01.01'
    };
  };

  return (
    <Layout title="Buat BOP">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Buat BOP Baru</h1>
        <p className="text-sm text-gray-500">Isi detail di bawah untuk membuat faktur Bantuan Operasional Pendidikan (BOP)</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Informasi Faktur</h2>
          
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
                  <SelectItem value="bop">BOP - Bantuan Operasional Pendidikan</SelectItem>
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
              <Label htmlFor="accountCode">Kode Rekening</Label>
              <Input 
                id="accountCode" 
                name="accountCode"
                placeholder="Masukkan kode rekening" 
                value={invoiceInfo.accountCode} 
                onChange={handleInputChange}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="recipient">Penerima</Label>
              <Input 
                id="recipient" 
                name="recipient"
                placeholder="Masukkan nama penerima" 
                value={invoiceInfo.recipient} 
                onChange={handleInputChange}
                className="mt-1" 
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
                <span className="font-medium">Subtotal</span>
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
              <div className="flex justify-between py-2">
                <span className="font-medium">Diskon</span>
                <span>{formatCurrency(summary.discount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Administrasi</span>
                <span>{formatCurrency(summary.administration)}</span>
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

      {/* Invoice Preview Dialog */}
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

export default BuatBOP;
