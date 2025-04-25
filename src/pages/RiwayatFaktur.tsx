import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Eye, FileText, Printer, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import InvoicePreview from '@/components/InvoicePreview';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { generateLetterNumber } from '@/lib/formatUtils';

interface InvoiceHistoryItem {
  no_faktur: string;
  tanggal: string;
  sumber_dana: string;
  kegiatan: string;
  total: string;
  items: any[];
  summary: {
    subtotal: number;
    totalPPN: number;
    totalPPH: number;
    administration: number;
    adminFourPercent?: number;
    adminOnePercent?: number;
    total: number;
  };
  accountCode: string;
  recipient: string;
  activityDate: string;
  timestamp: string;
  transactionNumber?: string;
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceHistoryItem | null>(null);

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
    localStorage.setItem('editingInvoice', JSON.stringify(invoice));
    
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
      description: "Faktur sedang disiapkan untuk diunduh. Silakan gunakan opsi 'Simpan sebagai PDF' pada dialog cetak.",
    });
    
    // Set a temporary print mode
    const originalTitle = document.title;
    document.title = `Invoice-${invoice.no_faktur}`;
    
    // Create a print-only view
    setPreviewOpen(true);
    
    // Wait for the dialog to open, then trigger print
    setTimeout(() => {
      window.print();
      
      // Reset after printing
      setTimeout(() => {
        document.title = originalTitle;
        setIsDownloading(false);
        
        toast({
          title: "Faktur Siap Diunduh",
          description: `Gunakan opsi "Simpan sebagai PDF" pada dialog cetak untuk menyimpan faktur ${invoice.no_faktur}`,
        });
      }, 1000);
    }, 500);
  };

  const handleDeleteInvoice = (invoice: InvoiceHistoryItem) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteInvoice = () => {
    if (invoiceToDelete) {
      // Filter out the invoice to delete
      const updatedInvoices = fakturData.filter(inv => inv.no_faktur !== invoiceToDelete.no_faktur);
      
      // Update state
      setFakturData(updatedInvoices);
      
      // Update localStorage
      localStorage.setItem('invoiceHistory', JSON.stringify(updatedInvoices));
      
      // Close dialog and show confirmation
      setDeleteDialogOpen(false);
      
      toast({
        title: "Faktur Dihapus",
        description: `Faktur ${invoiceToDelete.no_faktur} telah berhasil dihapus`,
      });
    }
  };

  const getInvoicePreviewData = (invoice: InvoiceHistoryItem) => {
    return {
      invoiceNumber: generateNomorFaktur(invoice),
      date: formatDateWithDay(invoice.activityDate || invoice.tanggal),
      recipient: invoice.recipient,
      items: invoice.items,
      totalBeforeTax: invoice.summary.subtotal,
      ppnAmount: invoice.summary.totalPPN,
      pphAmount: invoice.summary.totalPPH,
      administrationAmount: invoice.summary.administration,
      grandTotal: invoice.summary.total,
      activityName: invoice.kegiatan,
      accountCode: invoice.accountCode || '15291/PK.01.01',
      suratJalan: generateNomorSuratJalan(invoice)
    };
  };

  const generateNomorSuratJalan = (invoice: InvoiceHistoryItem): string => {
    const activityDate = invoice.activityDate || invoice.tanggal;
    // Convert date string to YYYYMMDD format
    let datePart = '';
    if (activityDate.includes('-')) {
      // Handle ISO date format
      const parts = activityDate.split(/[- ]/);
      if (parts.length >= 3) {
        datePart = parts[0] + parts[1].padStart(2, '0') + parts[2].padStart(2, '0');
      }
    } else {
      // Extract date from format like "Senin, 25 April 2024"
      const dateMatch = activityDate.match(/(\d+)\s+(\w+)\s+(\d{4})/);
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, '0');
        const year = dateMatch[3];
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const month = (monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase()) + 1).toString().padStart(2, '0');
        datePart = year + month + day;
      }
    }
    
    const transactionNumber = invoice.transactionNumber || '001';
    // Extract school code: first letter of school name + school number
    const schoolCode = "B07"; // Hardcoded as "B" from "Baru" and "07" from school number
    
    return `HMI.SJ.${datePart}${transactionNumber}${schoolCode}`;
  };

  const generateNomorFaktur = (invoice: InvoiceHistoryItem): string => {
    const activityDate = invoice.activityDate || invoice.tanggal;
    // Convert date string to YYYYMMDD format
    let datePart = '';
    if (activityDate.includes('-')) {
      // Handle ISO date format
      const parts = activityDate.split(/[- ]/);
      if (parts.length >= 3) {
        datePart = parts[0] + parts[1].padStart(2, '0') + parts[2].padStart(2, '0');
      }
    } else {
      // Extract date from format like "Senin, 25 April 2024"
      const dateMatch = activityDate.match(/(\d+)\s+(\w+)\s+(\d{4})/);
      if (dateMatch) {
        const day = dateMatch[1].padStart(2, '0');
        const year = dateMatch[3];
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const month = (monthNames.findIndex(m => m.toLowerCase() === dateMatch[2].toLowerCase()) + 1).toString().padStart(2, '0');
        datePart = year + month + day;
      }
    }
    
    const transactionNumber = invoice.transactionNumber || '001';
    // Extract school code: first letter of school name + school number
    const schoolCode = "B07"; // Hardcoded as "B" from "Baru" and "07" from school number
    
    return `HMI.F.${datePart}${transactionNumber}${schoolCode}`;
  };

  const generateNomorSuratPesanan = (invoice: InvoiceHistoryItem): string => {
    const activityDate = invoice.activityDate || invoice.tanggal;
    const date = new Date(activityDate);
    const transactionNumber = invoice.transactionNumber || '001';
    const month = getRomanMonth(date.getMonth() + 1);
    const year = date.getFullYear();
    
    return `${transactionNumber}/PK.01.01/${month}/${year}`;
  };

  const getRomanMonth = (monthNumber: number): string => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romanMonths[monthNumber - 1];
  };

  const formatDateWithDay = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE, dd MMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  const calculateAdminTotal = (invoice: InvoiceHistoryItem): number => {
    const fourPercent = invoice.summary.adminFourPercent || 0;
    const onePercent = invoice.summary.adminOnePercent || 0;
    return fourPercent + onePercent;
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO. TRANSAKSI</TableHead>
                <TableHead>NO. FAKTUR</TableHead>
                <TableHead>NOMOR SURAT JALAN</TableHead>
                <TableHead>NOMOR SURAT PESANAN</TableHead>
                <TableHead>TANGGAL KEGIATAN</TableHead>
                <TableHead>SUMBER DANA</TableHead>
                <TableHead>KODE REKENING</TableHead>
                <TableHead>KEGIATAN</TableHead>
                <TableHead>BRUTO</TableHead>
                <TableHead>TOTAL PPN</TableHead>
                <TableHead>TOTAL PPH</TableHead>
                <TableHead>TOTAL NETTO</TableHead>
                <TableHead>4%</TableHead>
                <TableHead>1%</TableHead>
                <TableHead>ADMIN</TableHead>
                <TableHead>SEKOLAH</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>TINDAKAN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakturData && fakturData.length > 0 ? (
                <>
                  {filteredInvoices.map((faktur, index) => {
                    const netto = faktur.summary.subtotal - faktur.summary.totalPPN - faktur.summary.totalPPH;
                    const fourPercent = faktur.summary.adminFourPercent || netto * 0.04;
                    const onePercent = faktur.summary.adminOnePercent || netto * 0.01;
                    const adminTotal = fourPercent + onePercent;
                    const school = netto - adminTotal;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{faktur.transactionNumber || '001'}</TableCell>
                        <TableCell>{generateNomorFaktur(faktur)}</TableCell>
                        <TableCell>{generateNomorSuratJalan(faktur)}</TableCell>
                        <TableCell>{generateNomorSuratPesanan(faktur)}</TableCell>
                        <TableCell>{formatDateWithDay(faktur.activityDate || faktur.tanggal)}</TableCell>
                        <TableCell>{faktur.sumber_dana}</TableCell>
                        <TableCell>{faktur.accountCode || '-'}</TableCell>
                        <TableCell>{faktur.kegiatan}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(faktur.summary.subtotal)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(faktur.summary.totalPPN)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(faktur.summary.totalPPH)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(netto)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(fourPercent)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(onePercent)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(adminTotal)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(school)}</TableCell>
                        <TableCell className="font-medium">{faktur.total}</TableCell>
                        <TableCell>
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
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteInvoice(faktur)}>
                              <Trash2 size={16} className="text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Total Row */}
                  <TableRow className="font-bold bg-gray-100">
                    <TableCell colSpan={8} className="text-right">TOTAL:</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => sum + faktur.summary.subtotal, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => sum + faktur.summary.totalPPN, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => sum + faktur.summary.totalPPH, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => {
                          const netto = faktur.summary.subtotal - faktur.summary.totalPPN - faktur.summary.totalPPH;
                          return sum + netto;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => {
                          const netto = faktur.summary.subtotal - faktur.summary.totalPPN - faktur.summary.totalPPH;
                          const fourPercent = faktur.summary.adminFourPercent || netto * 0.04;
                          return sum + fourPercent;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => {
                          const netto = faktur.summary.subtotal - faktur.summary.totalPPN - faktur.summary.totalPPH;
                          const onePercent = faktur.summary.adminOnePercent || netto * 0.01;
                          return sum + onePercent;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => {
                          const netto = faktur.summary.subtotal - faktur.summary.totalPPN - faktur.summary.totalPPH;
                          const fourPercent = faktur.summary.adminFourPercent || netto * 0.04;
                          const onePercent = faktur.summary.adminOnePercent || netto * 0.01;
                          return sum + fourPercent + onePercent;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => {
                          const netto = faktur.summary.subtotal - faktur.summary.totalPPN - faktur.summary.totalPPH;
                          const fourPercent = faktur.summary.adminFourPercent || netto * 0.04;
                          const onePercent = faktur.summary.adminOnePercent || netto * 0.01;
                          const adminTotal = fourPercent + onePercent;
                          const school = netto - adminTotal;
                          return sum + school;
                        }, 0)
                      )}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
                        filteredInvoices.reduce((sum, faktur) => sum + parseFloat(faktur.total.replace(/[^\d]/g, '')), 0)
                      )}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-8 text-gray-500">
                    Belum ada data faktur tersimpan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedInvoice && (
        <Dialog open={previewOpen || isPrinting} onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setIsPrinting(false);
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="print:hidden">
              <DialogTitle>Detail Faktur</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <InvoicePreview data={getInvoicePreviewData(selectedInvoice)} />
            </div>
            <div className="mt-4 flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Tutup</Button>
              <Button onClick={() => window.print()}>Cetak</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {invoiceToDelete && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Konfirmasi Hapus Faktur
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus faktur <span className="font-medium">{invoiceToDelete.no_faktur}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmDeleteInvoice}>
                Hapus Faktur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default RiwayatFaktur;
