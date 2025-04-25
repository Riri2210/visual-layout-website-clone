import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DocumentViewer from '@/components/DocumentViewer';

interface InvoiceData {
  no_faktur: string;
  transactionNumber: string;
  activityDate: string;
  schoolCode: string;
  kegiatan?: string;
  accountCode?: string;
  items?: any[];
  [key: string]: any; // To allow additional properties
}

interface LetterNumbers {
  suratPesanan: string;
  suratPenawaran1: string;
  suratNegosiasi: string;
  suratPenawaran2: string;
  suratBASTNego: string;
  spk: string;
  suratJalan: string;
  bapb: string;
  bastb: string;
  kwitansi: string;
}

const SPJ = () => {
  const { toast } = useToast();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [letterNumbers, setLetterNumbers] = useState<LetterNumbers | null>(null);
  const [error, setError] = useState('');
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({ name: '', number: '' });
  const [schoolData, setSchoolData] = useState<any>(null);
  
  useEffect(() => {
    // Load school identity data when component mounts
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.email) {
      const savedData = localStorage.getItem(`school-identity-${currentUser.email}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Map school data to the format expected by templates
        setSchoolData({
          schoolName: parsedData.schoolName || '',
          address: parsedData.address || '',
          district: parsedData.district || '',
          city: parsedData.city || '',
          postalCode: parsedData.postalCode || '',
          phone: parsedData.phone || '',
          email: parsedData.email || currentUser.email || '',
          principalName: parsedData.principalName || '',
          principalNip: parsedData.principalNip || ''
        });
      }
    }
  }, []);
  
  const fetchInvoiceData = () => {
    if (!invoiceNumber.trim()) {
      setError('Nomor faktur tidak boleh kosong');
      return;
    }

    // Reset states
    setError('');
    setInvoiceData(null);
    setLetterNumbers(null);

    // Get invoice data from localStorage
    const storedInvoices = localStorage.getItem('invoiceHistory');
    if (!storedInvoices) {
      setError('Data Tidak Ditemukan!');
      return;
    }

    const invoices = JSON.parse(storedInvoices);
    const foundInvoice = invoices.find((inv: any) => inv.no_faktur === invoiceNumber);

    if (!foundInvoice) {
      setError('Data Tidak Ditemukan!');
      return;
    }

    // Extract schoolCode from invoice number
    // Format is HMI.F.YYYYMMDD+TransactionNumber+SchoolCode
    let schoolCode = "B07"; // Default
    const parts = foundInvoice.no_faktur.split('.');
    if (parts.length >= 3) {
      // Extract the school code from the last part
      const lastPart = parts[2];
      // School code is the last part after the transaction date and number
      if (lastPart.length > 12) { // YYYYMMDD + TransactionNumber (at least 3 digits) + SchoolCode
        schoolCode = lastPart.substring(11); // Assuming 8 chars for date, 3 for transaction number
      }
    }
    
    // Set invoice data
    const data: InvoiceData = {
      no_faktur: foundInvoice.no_faktur,
      transactionNumber: foundInvoice.transactionNumber || '001',
      activityDate: foundInvoice.activityDate || foundInvoice.tanggal,
      schoolCode: schoolCode,
      kegiatan: foundInvoice.kegiatan,
      accountCode: foundInvoice.accountCode,
      items: foundInvoice.items || []
    };
    
    // Add all other properties from the found invoice
    Object.keys(foundInvoice).forEach(key => {
      if (!data[key]) data[key] = foundInvoice[key];
    });
    
    setInvoiceData(data);

    // Generate letter numbers
    generateLetterNumbers(data);

    toast({
      title: "Data Ditemukan",
      description: `Berhasil menemukan data faktur ${data.no_faktur}`,
    });
  };

  const generateLetterNumbers = (data: InvoiceData) => {
    // Extract components from the invoice number
    const invoiceParts = data.no_faktur.split('.');
    const currentYear = new Date(data.activityDate).getFullYear();
    const currentMonth = new Date(data.activityDate).getMonth() + 1;
    
    // Surat Pesanan format: 001/PK.01.01/IV/2025 (sequential number/department code/roman month/year)
    const romanMonth = getRomanMonth(currentMonth);
    const baseLetterNumber = `001/PK.01.01/${romanMonth}/${currentYear}`;
    
    // Format HMI.X.YYYYMMDD+TransactionNumber+SchoolCode
    const datePart = format(new Date(data.activityDate), 'yyyyMMdd');
    const transactionNumber = data.transactionNumber;
    const schoolCode = data.schoolCode;
    
    const suratPesanan = baseLetterNumber;
    const suratNegosiasi = incrementLetterSequence(baseLetterNumber);
    const suratBASTNego = incrementLetterSequence(suratNegosiasi);
    const spk = incrementLetterSequence(suratBASTNego);
    const bapb = incrementLetterSequence(spk);
    
    // Generate all letter numbers according to formulas
    const numbers: LetterNumbers = {
      // 1. Surat Pesanan with format from Riwayat Faktur
      suratPesanan,
      
      // 2. Surat Penawaran1: same as invoice but "F" becomes "P1"
      suratPenawaran1: data.no_faktur.replace("F.", "P1."),
      
      // 3. Surat Negosiasi: based on Surat Pesanan but increment number by 1
      suratNegosiasi,
      
      // 4. Surat Penawaran2: same as Surat Penawaran1 but "P1" becomes "P2"
      suratPenawaran2: data.no_faktur.replace("F.", "P2."),
      
      // 5. Surat BAST Nego: based on Surat Negosiasi but increment number by 1
      suratBASTNego,
      
      // 6. SPK: based on Surat BAST Nego but increment number by 1
      spk,
      
      // 7. Surat Jalan: HMI.SJ.YYYYMMDD+TransactionNumber+SchoolCode
      suratJalan: `HMI.SJ.${datePart}${transactionNumber}${schoolCode}`,
      
      // 8. BAPB: based on SPK but increment number by 1
      bapb,
      
      // 9. BASTB: same as Surat Jalan but "SJ" becomes "BAST"
      bastb: `HMI.BAST.${datePart}${transactionNumber}${schoolCode}`,
      
      // 10. Kwitansi: same as BASTB but "BAST" becomes "K"
      kwitansi: `HMI.K.${datePart}${transactionNumber}${schoolCode}`
    };

    setLetterNumbers(numbers);
  };

  // Helper function to get Roman numeral for month
  const getRomanMonth = (monthNumber: number): string => {
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return romanMonths[monthNumber - 1];
  };

  // Helper function to increment the sequence number in a letter number
  const incrementLetterSequence = (letterNumber: string): string => {
    const parts = letterNumber.split('/');
    if (parts.length >= 1) {
      const sequenceStr = parts[0];
      const sequence = parseInt(sequenceStr, 10);
      const nextSequence = (sequence + 1).toString().padStart(sequenceStr.length, '0');
      parts[0] = nextSequence;
      return parts.join('/');
    }
    return letterNumber;
  };

  const handleViewAndPrint = (documentName: string, documentNumber: string) => {
    // Check if we have the necessary data
    if (!invoiceData || !schoolData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Data tidak lengkap untuk menampilkan dokumen",
      });
      return;
    }
    
    // Create a copy of the invoice data to add document-specific properties
    const documentData = { ...invoiceData };
    
    // Add document-specific references based on the document type
    if (letterNumbers) {
      if (documentName === 'Surat Penawaran 1') {
        documentData.suratPesananNumber = letterNumbers.suratPesanan;
      } 
      else if (documentName === 'Surat Negosiasi') {
        documentData.suratPenawaran1Number = letterNumbers.suratPenawaran1;
      }
      else if (documentName === 'Surat Penawaran 2') {
        documentData.suratNegosiasiNumber = letterNumbers.suratNegosiasi;
      }
    }
    
    // Set current document info and show dialog
    setCurrentDocument({
      name: documentName,
      number: documentNumber
    });
    setShowDocumentDialog(true);
  };

  return (
    <Layout title="Surat Pertanggungjawaban">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Buat Surat Pertanggungjawaban (SPJ)</h2>
        <p className="text-gray-500 text-sm">Kelola dokumen surat pertanggungjawaban terkait faktur</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Nomor Surat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-md font-medium">Masukkan Nomor Faktur</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <Input 
                  value={invoiceNumber} 
                  onChange={(e) => setInvoiceNumber(e.target.value)} 
                  placeholder="Masukkan nomor faktur..." 
                  className="md:col-span-3" 
                />
                <Button onClick={fetchInvoiceData}>Buat Nomor Surat</Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            
            {letterNumbers && (
              <div className="space-y-4 mt-6">
                <h3 className="text-md font-medium">Nomor Surat yang Dihasilkan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Surat Pesanan</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.suratPesanan} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Surat Pesanan', letterNumbers.suratPesanan)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Surat Penawaran 1</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.suratPenawaran1} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Surat Penawaran 1', letterNumbers.suratPenawaran1)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Surat Negosiasi</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.suratNegosiasi} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Surat Negosiasi', letterNumbers.suratNegosiasi)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Surat Penawaran 2</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.suratPenawaran2} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Surat Penawaran 2', letterNumbers.suratPenawaran2)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Surat BAST Nego</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.suratBASTNego} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Surat BAST Nego', letterNumbers.suratBASTNego)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">SPK</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.spk} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('SPK', letterNumbers.spk)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Surat Jalan</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.suratJalan} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Surat Jalan', letterNumbers.suratJalan)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">BAPB</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.bapb} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('BAPB', letterNumbers.bapb)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">BASTB</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.bastb} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('BASTB', letterNumbers.bastb)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <label className="text-sm font-medium">Kwitansi</label>
                  <div className="md:col-span-2">
                    <Input value={letterNumbers.kwitansi} readOnly />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleViewAndPrint('Kwitansi', letterNumbers.kwitansi)}
                  >
                    <Eye size={18} /> <Printer size={18} /> LIHAT & CETAK
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Document Preview Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentDocument.name} - {currentDocument.number}
            </DialogTitle>
          </DialogHeader>
          
          {invoiceData && schoolData && letterNumbers && (
            <DocumentViewer
              documentType={currentDocument.name}
              documentNumber={currentDocument.number}
              invoiceData={{
                ...invoiceData,
                suratPesananNumber: currentDocument.name === 'Surat Penawaran 1' ? letterNumbers.suratPesanan : undefined,
                suratPenawaran1Number: currentDocument.name === 'Surat Negosiasi' ? letterNumbers.suratPenawaran1 : undefined,
                suratNegosiasiNumber: currentDocument.name === 'Surat Penawaran 2' ? letterNumbers.suratNegosiasi : undefined
              }}
              schoolData={schoolData}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SPJ;
