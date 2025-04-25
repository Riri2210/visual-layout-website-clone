import React from 'react';
import './BASTB.css';
import logoHarumi from '@/assets/logo-harumi.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface BASTBTemplateProps {
  schoolData: {
    schoolName: string;
    address?: string;
    district?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    principalName: string;
    principalNip?: string;
  };
  letterData: {
    letterNumber: string;
    invoiceDate: string;
    suratPesananNumber: string;
    suratPesananDate: string;
    activityCode: string;
    activityName: string;
    vendorData: {
      name: string;
      director: string;
      position: string;
    };
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
      price: number;
      totalPrice?: number;
    }>;
  };
}

const BASTBTemplate: React.FC<BASTBTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the document
  const formattedDate = formatDate(letterData.invoiceDate);
  const formattedPesananDate = formatDate(letterData.suratPesananDate);

  // Calculate total price for each item and grand total
  const itemsWithTotals = letterData.items.map(item => ({
    ...item,
    totalPrice: item.totalPrice || (item.price * item.quantity)
  }));

  const grandTotal = itemsWithTotals.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bastb-container">
      {/* Header Section */}
      <div className="bastb-header">
        <div className="company-info">
          <div className="logo-container">
            <img src={logoHarumi} alt="Logo Harumi" className="logo" />
          </div>
          <div className="company-details">
            <h2 className="company-name">CV. HARUMI MULTI INOVASI</h2>
            <p className="company-description">Toko Komputer dan Olahraga, Pemeliharaan Gedung, dan Event Organizer</p>
            <p className="company-address">Jl. Matraman Raya No. 67 Kec. Matraman - Jakarta Timur</p>
            <p className="company-contact">e-mail: cv.harumi.multi.inovasi@gmail.com, Telp: 089503939444</p>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Letter Title */}
      <div className="letter-title">
        <h2>BERITA ACARA SERAH TERIMA BARANG</h2>
        <p>No: {letterData.letterNumber}</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <p className="opening-paragraph">
          Pada hari ini [DAY NAME] tanggal [TEXT DATE] bulan [TEXT MONTH] tahun [TEXT YEAR], sesuai dengan Surat
          Pesanan nomor: {letterData.suratPesananNumber} tanggal {formattedPesananDate} kegiatan {letterData.activityCode} berupa {letterData.activityName} yang bertanda tangan di bawah ini:
        </p>

        {/* Signatories Section */}
        <div className="signatories">
          <div className="signatory">
            <p>1. <span className="signatory-label">Nama</span>   : {letterData.vendorData.name}</p>
            <p>   <span className="signatory-label">Jabatan</span> : {letterData.vendorData.position}</p>
            <p>   Selanjutnya disebut Pihak Pertama</p>
          </div>
          
          <div className="signatory">
            <p>2. <span className="signatory-label">Nama</span>   : {schoolData.principalName}</p>
            <p>   <span className="signatory-label">Jabatan</span> : Kepala {schoolData.schoolName}</p>
            <p>   Selanjutnya disebut Pihak Kedua</p>
          </div>
        </div>

        <p className="transaction-paragraph">
          Pihak pertama menyerahkan hasil pekerjaan pengiriman barang kepada pihak kedua, dan pihak kedua menerima hasil
          pekerjaan dengan rincian sebagai berikut:
        </p>

        {/* Items Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>NAMA BARANG</th>
              <th>QTY</th>
              <th>HARGA TOTAL</th>
              <th>KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {itemsWithTotals.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>{formatCurrency(item.totalPrice || 0)}</td>
                <td></td>
              </tr>
            ))}
            {/* Add empty rows if items are less than 5 */}
            {Array.from({ length: Math.max(0, 5 - itemsWithTotals.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="empty-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={3} className="total-label">TOTAL</td>
              <td>{formatCurrency(grandTotal)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* Tax Calculation Section */}
        <div className="tax-calculation">
          <div className="tax-row">
            <span className="tax-label">Total Sebelum PPN</span>
            <span className="tax-value">{formatCurrency(grandTotal)}</span>
          </div>
          <div className="tax-row">
            <span className="tax-label">PPN</span>
            <span className="tax-value">{formatCurrency(grandTotal * 0.11)}</span>
          </div>
          <div className="tax-row">
            <span className="tax-label">PPH</span>
            <span className="tax-value">{formatCurrency(grandTotal * 0.015)}</span>
          </div>
          <div className="tax-row total">
            <span className="tax-label">Grand Total</span>
            <span className="tax-value">{formatCurrency(grandTotal + (grandTotal * 0.11) - (grandTotal * 0.015))}</span>
          </div>
        </div>

        <p className="closing-paragraph">
          Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana seharusnya.
        </p>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="signature-right">
            <p>Jakarta, [Tanggal Kegiatan]</p>
            <p>CV. HARUMI MULTI INOVASI</p>
            <div className="signature-space"></div>
            <p className="signature-name">{letterData.vendorData.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BASTBTemplate;
