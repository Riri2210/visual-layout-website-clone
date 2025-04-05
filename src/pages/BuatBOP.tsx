import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface Item {
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  ppn: boolean;
  pph: boolean;
  netto: number;
}

const calculateNetto = (item: Omit<Item, 'netto'>): number => {
  const subtotal = item.quantity * item.unitPrice;
  const ppnAmount = item.ppn ? subtotal * 0.11 : 0;
  const pphAmount = item.pph ? subtotal * 0.02 : 0;
  return subtotal + ppnAmount - pphAmount;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

const BuatBOP = () => {
  const { toast } = useToast();
  const [invoiceInfo, setInvoiceInfo] = useState({
    fundSource: 'bop',
    activityDate: new Date().toISOString().split('T')[0],
    activityName: '',
    accountCode: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setInvoiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const calculateSummary = (items: Item[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalPPN = items.reduce((sum, item) => sum + (item.ppn ? item.quantity * item.unitPrice * 0.11 : 0), 0);
    const totalPPH = items.reduce((sum, item) => sum + (item.pph ? item.quantity * item.unitPrice * 0.02 : 0), 0);
    
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
    updateItemAndRecalculate(index, { [field]: value });
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

  const generateInvoicePreview = () => {
    let preview = `FAKTUR BOP\n\n`;
    preview += `Tanggal Kegiatan: ${invoiceInfo.activityDate}\n`;
    preview += `Nama Kegiatan: ${invoiceInfo.activityName}\n`;
    preview += `Kode Rekening: ${invoiceInfo.accountCode}\n\n`;
    
    preview += `ITEM:\n`;
    items.forEach((item, index) => {
      preview += `${index + 1}. ${item.name} - ${item.quantity} ${item.unit} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.netto)}\n`;
    });
    
    preview += `\nTotal: ${formatCurrency(summary.total)}`;
    
    return preview;
  };

  const handlePreview = () => {
    const preview = generateInvoicePreview();
    toast({
      title: "Pratinjau Faktur",
      description: "Faktur telah dibuat dalam bentuk pratinjau"
    });
    
    // For now, we'll just update the preview text area
    const previewElement = document.getElementById('pratinjau-faktur') as HTMLTextAreaElement;
    if (previewElement) previewElement.value = preview;
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
    
    // In a real app, you'd send this data to your backend
    toast({
      title: "Faktur Dibuat",
      description: "Faktur BOP telah berhasil dibuat dan disimpan"
    });
  };

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
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="table-cell">
                      <Input 
                        placeholder="Nama barang" 
                        value={item.name} 
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      />
                    </td>
                    <td className="table-cell">
                      <Input 
                        type="number" 
                        value={item.totalPrice} 
                        readOnly 
                      />
                    </td>
                    <td className="table-cell">
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        min={1}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="table-cell">
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
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="table-cell">
                      <Input 
                        type="number" 
                        value={item.unitPrice} 
                        min={0}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center">
                        <Checkbox 
                          id={`ppn-${item.id}`} 
                          checked={item.ppn} 
                          onCheckedChange={(checked) => handleItemChange(index, 'ppn', checked === true)}
                        />
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center">
                        <Checkbox 
                          id={`pph-${item.id}`} 
                          checked={item.pph} 
                          onCheckedChange={(checked) => handleItemChange(index, 'pph', checked === true)}
                        />
                      </div>
                    </td>
                    <td className="table-cell">
                      <span>{formatCurrency(item.netto)}</span>
                    </td>
                    <td className="table-cell">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleAddItem}>
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
            <Button variant="outline" onClick={handlePreview}>Pratinjau</Button>
            <Button variant="outline" onClick={handleSaveDraft}>Simpan Draft</Button>
            <Button onClick={handleCreateInvoice}>Buat Faktur</Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default BuatBOP;
