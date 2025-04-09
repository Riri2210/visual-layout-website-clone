
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, Printer } from 'lucide-react';
import { format } from 'date-fns';

interface InvoiceData {
  no_faktur: string;
  transactionNumber: string;
  activityDate: string;
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

    // Set invoice data
    const data: InvoiceData = {
      no_faktur: foundInvoice.no_faktur,
      transactionNumber: foundInvoice.transactionNumber || '001',
      activityDate: foundInvoice.activityDate || foundInvoice.tanggal
    };
    
    setInvoiceData(data);

    // Generate letter numbers
    generateLetterNumbers(data);

    toast({
      title: "Data Ditemukan",
      description: `Berhasil menemukan data faktur ${data.no_faktur}`,
    });
  };

  const generateLetterNumbers = (data: InvoiceData) => {
    const schoolCode = "B07"; // Kode unik nama sekolah
    const datePart = format(new Date(data.activityDate), 'yyyyMMdd');
    const transactionNumber = data.transactionNumber;

    const suratPesanan = `HMI.SP.${datePart}${transactionNumber}${schoolCode}`;
    const suratJalan = `HMI.SJ.${datePart}${transactionNumber}${schoolCode}`;
    
    // Generate all letter numbers according to formulas
    const numbers: LetterNumbers = {
      suratPesanan,
      suratPenawaran1: `HMI.P1.${datePart}${transactionNumber}${schoolCode}`,
      suratNegosiasi: getNextSequence(suratPesanan),
      suratPenawaran2: `HMI.P2.${datePart}${transactionNumber}${schoolCode}`,
      suratBASTNego: getNextSequence(getNextSequence(suratPesanan)), // +1 from Surat Negosiasi
      spk: getNextSequence(getNextSequence(getNextSequence(suratPesanan))), // +1 from Surat BAST Nego
      suratJalan,
      bapb: getNextSequence(getNextSequence(getNextSequence(getNextSequence(suratPesanan)))), // +1 from SPK
      bastb: `HMI.BAST.${datePart}${transactionNumber}${schoolCode}`,
      kwitansi: `HMI.K.${datePart}${transactionNumber}${schoolCode}`
    };

    setLetterNumbers(numbers);
  };

  // Helper function to get next sequence in a letter number
  const getNextSequence = (letterNumber: string) => {
    const parts = letterNumber.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Extract sequence number if it exists, otherwise use 1
    const seqMatch = lastPart.match(/\d+$/);
    const currentSeq = seqMatch ? parseInt(seqMatch[0], 10) : 0;
    const nextSeq = (currentSeq + 1).toString().padStart(seqMatch ? seqMatch[0].length : 3, '0');
    
    // Replace the last part with updated sequence
    if (seqMatch) {
      parts[parts.length - 1] = lastPart.replace(/\d+$/, nextSeq);
    } else {
      parts.push(nextSeq);
    }
    
    return parts.join('.');
  };

  const handleViewAndPrint = (documentName: string, documentNumber: string) => {
    toast({
      title: `Lihat & Cetak ${documentName}`,
      description: `Menyiapkan dokumen ${documentNumber} untuk dilihat dan dicetak`,
    });
  };

  return (
    <Layout title="SPJ (Surat Pertanggung Jawaban)">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SPJ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
            <div className="md:col-span-2">
              <label htmlFor="invoice-number" className="block text-sm font-medium mb-1">
                Input No. Faktur untuk melihat SPJ
              </label>
              <Input 
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Masukkan nomor faktur"
              />
            </div>
            <Button onClick={fetchInvoiceData} className="w-full md:w-auto">
              BUAT NOMOR SURAT
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {letterNumbers && (
            <div className="space-y-4">
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
                <label className="text-sm font-medium">Surat Penawaran1</label>
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
                <label className="text-sm font-medium">Surat Penawaran2</label>
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
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SPJ;
