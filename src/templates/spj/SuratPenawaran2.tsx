import React from 'react';
import './SuratPenawaran2.css';
import logoHarumi from '@/assets/logo-harumi.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface SuratPenawaran2TemplateProps {
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
    suratNegosiasiNumber: string;
    invoiceDate: string;
    activityCode: string;
    activityName: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
      price: number;
      negotiatedPrice?: number;
    }>;
  };
}

const SuratPenawaran2Template: React.FC<SuratPenawaran2TemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the header (DD Month YYYY)
  const formattedDate = formatDate(letterData.invoiceDate);

  // Use the negotiated price as the new price
  const calculateItemPrice = (item: { negotiatedPrice?: number; price: number }) => {
    return item.negotiatedPrice !== undefined ? item.negotiatedPrice : item.price;
  };

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="surat-penawaran2-container">
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
            <span className="detail-value">Penawaran Harga Barang Baru</span>
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
          Bersama ini kami menerima pengajuan harga negosiasi pengadaan {letterData.activityName}, sesuai dengan Surat Negosiasi {letterData.suratNegosiasiNumber} yang kami terima pada tanggal {formattedDate} sebagai berikut:
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
                  <span className="price-note">[= Harga Satuan]</span>
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
          Demikian penawaran ini kami sampaikan, besar harapan kami Bapak/ Ibu sudi mempertimbangkannya.
          <br />Atas waktu dan kerjasamanya kami ucapkan terima kasih.
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

export default SuratPenawaran2Template;
