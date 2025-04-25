import React from 'react';
import './SuratPenawaran1.css';
import logoHarumi from '@/assets/logo-harumi.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface SuratPenawaran1TemplateProps {
  schoolData: {
    schoolName: string;
    address: string;
    district: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    principalName: string;
    principalNip: string;
  };
  letterData: {
    letterNumber: string;
    suratPesananNumber: string;
    invoiceDate: string;
    activityCode: string;
    activityName: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
      price: number;
    }>;
  };
}

const SuratPenawaran1Template: React.FC<SuratPenawaran1TemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the header (DD Month YYYY)
  const formattedDate = formatDate(letterData.invoiceDate);

  const calculateItemPrice = (item: { price: number }) => {
    return item.price;
  };

  const calculateItemTotal = (item: { price: number; quantity: number }) => {
    return item.price * item.quantity;
  };

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="surat-penawaran1-container">
      {/* Header Section */}
      <div className="surat-header">
        <div className="logo-container">
          <img src={logoHarumi} alt="Logo Harumi" className="logo" />
        </div>
        <div className="header-text">
          <h1 className="company-name">CV. HARUMI MULTI INOVASI</h1>
          <p className="company-address">
            Jl. Matraman Raya No. 67 Kec. Matraman - Jakarta Timur
          </p>
          <p className="company-contact">
            e-mail: cv.harumi.multi.inovasi@gmail.com, Telp. 089503939444
          </p>
        </div>
      </div>

      <hr className="divider" />

      {/* Letter Details Section */}
      <div className="letter-details">
        <div className="letter-left">
          <p>
            <span className="detail-label">Nomor</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">{letterData.letterNumber}</span>
          </p>
          <p>
            <span className="detail-label">Perihal</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">Penawaran Harga Barang</span>
          </p>
          <p>
            <span className="detail-label"></span>
            <span className="detail-separator"></span>
            <span className="detail-value">{letterData.activityCode}</span>
          </p>
        </div>
        <div className="letter-right">
          <p>{formattedDate}</p>
          <p>Kepada</p>
          <p>Yth. Kepala {schoolData.schoolName}</p>
          <p>di</p>
          <p>Jakarta</p>
        </div>
      </div>

      {/* Letter Body */}
      <div className="letter-body">
        <p>Dengan Hormat,</p>
        <p className="letter-content">
          Bersama ini kami mengajukan penawaran harga pengadaan {letterData.activityCode}, sesuai dengan Surat Pesanan No. {letterData.suratPesananNumber} yang kami terima pada tanggal {formattedDate}. Berikut Daftar Harga yang kami tawarkan:
        </p>

        {/* Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>NAMA BARANG</th>
              <th>SATUAN</th>
              <th>HARGA</th>
            </tr>
          </thead>
          <tbody>
            {letterData.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>
                  {formatCurrency(calculateItemPrice(item))}
                  <br />
                  <span className="price-note">[= Harga Satuan + (Harga Satuan * 2%)]</span>
                </td>
              </tr>
            ))}
            {/* Add empty rows if items are less than 10 */}
            {Array.from({ length: Math.max(0, 10 - letterData.items.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className={letterData.items.length <= index ? "hidden-row" : ""}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="closing">
          Demikian penawaran ini kami sampaikan, besar harapan kami Bapak/ Ibu sudi mempertimbangkannya. Atas waktu dan kerjasamanya kami ucapkan terima kasih.
        </p>

        {/* Signature Section */}
        <div className="signature">
          <p>Hormat Kami,</p>
          <div className="signature-space"></div>
          <p className="signatory-name">Ananda Shafa Rianti</p>
        </div>
      </div>
    </div>
  );
};

export default SuratPenawaran1Template;
