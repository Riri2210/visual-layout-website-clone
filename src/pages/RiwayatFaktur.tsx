
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Eye, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InvoicePreview from '@/components/InvoicePreview';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface InvoiceHistoryItem {
  no_faktur: string;
  tanggal: string;
  sumber_dana: string;
  kegiatan: string;
  total: string;
  items: any[];
  summary: any;
  accountCode: string;
  recipient: string;
  activityDate: string;
  timestamp: string;
}

const RiwayatFaktur = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [invoiceType, setInvoiceType] = useState('semua');
  const [sortBy, setSortBy] = useState('tanggal');
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [fakturData, setFakturData] = useState<InvoiceHistoryItem[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceHistoryItem | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoiceHistory');
    if (storedInvoices) {
      const parsedInvoices = JSON.parse(storedInvoices);
      setFakturData(parsedInvoices);
    }
  }, []);

  const filteredInvoices = fakturData
    .filter(invoice => {
      if (searchKeyword && !invoice.kegiatan.toLowerCase().includes(searchKeyword.toLowerCase()) && 
          !invoice.no_faktur.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      
      if (invoiceType !== 'semua' && invoice.sumber_dana.toLowerCase() !== invoiceType) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'tanggal') {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return sortOrder === 'terbaru' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      } else if (sortBy === 'no_faktur') {
        return sortOrder === 'terbaru' ? b.no_faktur.localeCompare(a.no_faktur) : a.no_faktur.localeCompare(b.no_faktur);
      } else if (sortBy === 'total') {
        const totalA = parseFloat(a.total.replace(/[^\d]/g, ''));
        const totalB = parseFloat(b.total.replace(/[^\d]/g, ''));
        return sortOrder === 'terbaru' ? totalB - totalA : totalA - totalB;
      }
      return 0;
    });

  const handleViewInvoice = (invoice: InvoiceHistoryItem) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleEditInvoice = (invoice: InvoiceHistoryItem) => {
    // Save the selected invoice to localStorage for editing
    localStorage.setItem('editingInvoice', JSON.stringify(invoice));
    
    // Navigate to the appropriate form based on the invoice type
    if (invoice.sumber_dana.toLowerCase() === 'bos') {
      navigate('/buat-bos');
    } else if (invoice.sumber_dana.toLowerCase() === 'bop') {
      navigate('/buat-bop');
    }
    
    toast({
      title: "Edit Faktur",
      description: `Membuka faktur ${invoice.no_faktur} untuk diedit`,
    });
  };

  const handlePrintInvoice = (invoice: InvoiceHistoryItem) => {
    setSelectedInvoice(invoice);
    setIsPrinting(true);
    
    // Set a small delay to ensure the dialog is open before printing
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
    
    toast({
      title: "Cetak Faktur",
      description: "Menyiapkan faktur untuk dicetak",
    });
  };

  const handleDownloadInvoice = (invoice: InvoiceHistoryItem) => {
    setIsDownloading(true);
    setSelectedInvoice(invoice);
    
    toast({
      title: "Unduh Faktur",
      description: "Faktur sedang disiapkan untuk diunduh",
    });
    
    // Simulate download process
    setTimeout(() => {
      toast({
        title: "Faktur Diunduh",
        description: `Faktur ${invoice.no_faktur} berhasil diunduh`,
      });
      setIsDownloading(false);
    }, 1500);
  };

  const getInvoicePreviewData = (invoice: InvoiceHistoryItem) => {
    return {
      invoiceNumber: invoice.no_faktur,
      date: invoice.tanggal,
      recipient: invoice.recipient,
      items: invoice.items,
      totalBeforeTax: invoice.summary.subtotal,
      ppnAmount: invoice.summary.totalPPN,
      pphAmount: invoice.summary.totalPPH,
      administrationAmount: invoice.summary.administration,
      grandTotal: invoice.summary.total,
      activityName: invoice.kegiatan,
      accountCode: invoice.accountCode
    };
  };

  return (
    <Layout title="Riwayat Faktur">
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Filter dan Pencarian</h2>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Kunci</label>
              <Input 
                placeholder="Cari faktur..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Faktur</label>
              <Select 
                defaultValue={invoiceType}
                onValueChange={(value) => setInvoiceType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="bos">BOS</SelectItem>
                  <SelectItem value="bop">BOP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutkan Berdasarkan</label>
              <Select 
                defaultValue={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanggal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tanggal">Tanggal</SelectItem>
                  <SelectItem value="no_faktur">No Faktur</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arah Urutan</label>
              <Select 
                defaultValue={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Terbaru Dulu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terbaru">Terbaru Dulu</SelectItem>
                  <SelectItem value="terlama">Terlama Dulu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      <h2 className="text-lg font-medium mb-4">Daftar Faktur</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">NO. FAKTUR</th>
                <th className="table-header">TANGGAL</th>
                <th className="table-header">SUMBER DANA</th>
                <th className="table-header">KODE REKENING</th>
                <th className="table-header">KEGIATAN</th>
                <th className="table-header">TOTAL</th>
                <th className="table-header">TINDAKAN</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((faktur, index) => (
                  <tr key={index}>
                    <td className="table-cell">{faktur.no_faktur}</td>
                    <td className="table-cell">{faktur.tanggal}</td>
                    <td className="table-cell">{faktur.sumber_dana}</td>
                    <td className="table-cell">{faktur.accountCode || '-'}</td>
                    <td className="table-cell">{faktur.kegiatan}</td>
                    <td className="table-cell font-medium">{faktur.total}</td>
                    <td className="table-cell">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEditInvoice(faktur)}>
                          <Edit size={16} className="text-blue-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleViewInvoice(faktur)}>
                          <Eye size={16} className="text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadInvoice(faktur)}>
                          <FileText size={16} className="text-gray-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePrintInvoice(faktur)}>
                          <Printer size={16} className="text-gray-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-8 text-gray-500">
                    Belum ada data faktur tersimpan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedInvoice && (
        <Dialog open={previewOpen || isPrinting} onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setIsPrinting(false);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Faktur</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <InvoicePreview data={getInvoicePreviewData(selectedInvoice)} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Tutup</Button>
              <Button onClick={() => window.print()}>Cetak</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default RiwayatFaktur;
