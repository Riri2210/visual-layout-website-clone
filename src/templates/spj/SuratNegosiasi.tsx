import React from 'react';
import './SuratNegosiasi.css';
import logoJakarta from '@/assets/logo-jakarta.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface SuratNegosiasiTemplateProps {
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
    suratPenawaran1Number: string;
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

const SuratNegosiasiTemplate: React.FC<SuratNegosiasiTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the header (DD Month YYYY)
  const formattedDate = formatDate(letterData.invoiceDate);

  // Calculate the original price (with 2% markup)
  const calculateOriginalPrice = (item: { price: number }) => {
    return item.price;
  };

  // Calculate the negotiated price (use the provided negotiated price or 90% of the original as default)
  const calculateNegotiatedPrice = (item: { price: number; negotiatedPrice?: number }) => {
    return item.negotiatedPrice !== undefined ? item.negotiatedPrice : (item.price * 0.9);
  };

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="surat-negosiasi-container">
      {/* Header Section */}
      <div className="surat-header">
        <div className="logo-container">
          <img src={logoJakarta} alt="Logo Jakarta" className="logo" />
        </div>
        <div className="header-text">
          <h2 className="header-title">PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA</h2>
          <h2 className="header-subtitle">DINAS PENDIDIKAN</h2>
          <h1 className="school-name">{schoolData.schoolName}</h1>
          <p className="school-address">
            {schoolData.address} Kec. {schoolData.district} – {schoolData.city}
          </p>
          <p className="school-contact">
            Telp: {schoolData.phone} e-mail: {schoolData.email}
          </p>
          <p className="school-city">JAKARTA</p>
          <p className="postal-code">Kode Pos: {schoolData.postalCode}</p>
        </div>
      </div>

      <hr className="divider" />

      {/* Letter Details Section */}
      <div className="letter-details">
        <div className="letter-left">
          <p>
            <span className="detail-label">No</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">{letterData.letterNumber}</span>
          </p>
          <p>
            <span className="detail-label">Perihal</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">Negosiasi harga</span>
          </p>
          <p>
            <span className="detail-label">Kegiatan</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">
              {letterData.activityCode} Untuk
              <br />
              {letterData.activityName}
            </span>
          </p>
        </div>
        <div className="letter-right">
          <p>{formattedDate} - 1</p>
          <p>Kepada</p>
          <p>Yth. CV. HARUMI MULTI INOVASI</p>
          <p>di</p>
          <p>Tempat</p>
        </div>
      </div>

      {/* Letter Body */}
      <div className="letter-body">
        <p>Dengan Hormat,</p>
        <p className="letter-content">
          Berdasarkan surat penawaran dari CV. HARUMI MULTI INOVASI dengan nomor {letterData.suratPenawaran1Number} tentang penawaran harga barang melalui kode rekening {letterData.activityCode}, dengan ini kami mengajukan negosiasi harga sebagai berikut:
        </p>

        {/* Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>NAMA BARANG</th>
              <th>SATUAN</th>
              <th>HARGA PENAWARAN</th>
              <th>HARGA NEGOSIASI</th>
            </tr>
          </thead>
          <tbody>
            {letterData.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>
                  {formatCurrency(calculateOriginalPrice(item))}
                  <br />
                  <span className="price-note">[= Harga Satuan +(Harga Satuan * 2%)]</span>
                </td>
                <td>
                  {formatCurrency(calculateNegotiatedPrice(item))}
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
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="closing">
          Atas perhatian dan kerjasamanya diucapkan terima kasih.
        </p>

        {/* Signature Section */}
        <div className="signature">
          <p>Kepala {schoolData.schoolName}</p>
          <div className="signature-space"></div>
          <p className="principal-name">{schoolData.principalName}</p>
          <p className="principal-nip">NIP. {schoolData.principalNip}</p>
        </div>
      </div>
    </div>
  );
};

export default SuratNegosiasiTemplate;
