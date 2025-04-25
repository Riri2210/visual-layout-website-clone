import React from 'react';
import SuratPesananTemplate from '@/templates/spj/SuratPesanan';
import SuratPenawaran1Template from '@/templates/spj/SuratPenawaran1';
import SuratNegosiasiTemplate from '@/templates/spj/SuratNegosiasi';
import SuratPenawaran2Template from '@/templates/spj/SuratPenawaran2';
import BASTNegoTemplate from '@/templates/spj/BASTNego';
import SPKTemplate from '@/templates/spj/SPK';
import SuratJalanTemplate from '@/templates/spj/SuratJalan';
import BAPBTemplate from '@/templates/spj/BAPB';
import BASTBTemplate from '@/templates/spj/BASTB';
import KwitansiTemplate from '@/templates/spj/Kwitansi';

interface DocumentViewerProps {
  documentType: string;
  documentNumber: string;
  invoiceData: any;
  schoolData: any;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  documentType,
  documentNumber,
  invoiceData,
  schoolData
}) => {
  // Map the invoice data to the format expected by the template
  const mapInvoiceDataToLetterData = () => {
    // Extract items from invoice data
    const items = invoiceData.items.map((item: any) => ({
      id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price || (item.total ? item.total / item.quantity : 0),
      negotiatedPrice: item.negotiatedPrice || (item.price ? item.price * 0.9 : 0),
      offeredPrice: item.price || (item.total ? item.total / item.quantity : 0),
      condition: 'Baik',
      notes: '',
      totalPrice: item.price * item.quantity
    }));

    // Calculate delivery date (invoice date + 1 day)
    const invoiceDate = new Date(invoiceData.activityDate || invoiceData.tanggal || new Date());
    const deliveryDate = new Date(invoiceDate);
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const grandTotal = totalAmount + (totalAmount * 0.11) - (totalAmount * 0.015);

    return {
      letterNumber: documentNumber,
      suratPesananNumber: invoiceData.suratPesananNumber || '',
      suratPesananDate: invoiceData.suratPesananDate || invoiceData.activityDate || new Date().toISOString(),
      suratPenawaran1Number: invoiceData.suratPenawaran1Number || '',
      suratNegosiasiNumber: invoiceData.suratNegosiasiNumber || '',
      invoiceDate: invoiceData.activityDate || invoiceData.tanggal || new Date().toISOString(),
      invoiceNumber: invoiceData.no_faktur || '',
      activityDate: invoiceData.activityDate || invoiceData.tanggal || new Date().toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      activityCode: invoiceData.accountCode || 'BOS',
      activityName: invoiceData.kegiatan || 'Pembelian ATK',
      fundingSource: 'BOS', // Default funding source
      operatorName: '[Nama Operator Barang]',
      amount: grandTotal,
      committee: {
        chairman: '[Nama Guru Senior]',
        secretary: '[Nama Pengurus Barang]',
        treasurer: '[Nama Bendahara]'
      },
      npwp: '965835333009000',
      rekDKI: '43608001223',
      rekBNI: '3097878775',
      vendorData: {
        name: 'Ananda Shafa Rianti',
        director: 'Ananda Shafa Rianti',
        position: 'Direktur CV. HARUMI MULTI INOVASI'
      },
      items
    };
  };

  // Render the appropriate template based on documentType
  const renderDocument = () => {
    const letterData = mapInvoiceDataToLetterData();

    switch (documentType) {
      case 'Surat Pesanan':
        return <SuratPesananTemplate schoolData={schoolData} letterData={letterData} />;
      case 'Surat Penawaran 1':
        return <SuratPenawaran1Template schoolData={schoolData} letterData={letterData} />;
      case 'Surat Negosiasi':
        return <SuratNegosiasiTemplate schoolData={schoolData} letterData={letterData} />;
      case 'Surat Penawaran 2':
        return <SuratPenawaran2Template schoolData={schoolData} letterData={letterData} />;
      case 'Surat BAST Nego':
        return <BASTNegoTemplate schoolData={schoolData} letterData={letterData} />;
      case 'SPK':
        return <SPKTemplate schoolData={schoolData} letterData={letterData} />;
      case 'Surat Jalan':
        return <SuratJalanTemplate schoolData={schoolData} letterData={letterData} />;
      case 'BAPB':
        return <BAPBTemplate schoolData={schoolData} letterData={letterData} />;
      case 'BASTB':
        return <BASTBTemplate schoolData={schoolData} letterData={letterData} />;
      case 'Kwitansi':
        return <KwitansiTemplate schoolData={schoolData} letterData={letterData} />;
      // Add more templates for other document types
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Template Belum Tersedia</h2>
            <p>
              Template untuk dokumen <strong>{documentType}</strong> dengan nomor <strong>{documentNumber}</strong> belum
              tersedia.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="document-viewer">
      {renderDocument()}
      <div className="document-actions print:hidden mt-4 flex justify-end gap-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Cetak Dokumen
        </button>
      </div>
    </div>
  );
};

export default DocumentViewer;
