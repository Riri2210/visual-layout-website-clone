import React from 'react';
import './BASTNego.css';
import logoJakarta from '@/assets/logo-jakarta.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface BASTNegoTemplateProps {
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
    invoiceDate: string;
    deliveryDate: string;
    vendorData: {
      name: string;
      director: string;
      position: string;
    };
    items: Array<{
      id: string;
      name: string;
      unit: string;
      offeredPrice: number;
      negotiatedPrice: number;
    }>;
  };
}

const BASTNegoTemplate: React.FC<BASTNegoTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the document
  const formattedDate = formatDate(letterData.invoiceDate);
  const formattedDeliveryDate = formatDate(letterData.deliveryDate);

  // Format currency to IDR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="bast-nego-container">
      {/* Header Section */}
      <div className="bast-header">
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

      {/* Letter Title */}
      <div className="letter-title">
        <h2>BERITA ACARA NEGOSIASI HARGA</h2>
        <p>No: {letterData.letterNumber}</p>
      </div>

      {/* Signatories Section */}
      <div className="signatories">
        <p>Yang bertanda tangan di bawah ini:</p>
        <div className="signatory">
          <p>1. <span className="signatory-label">Nama</span>   : {schoolData.principalName}</p>
          <p>   <span className="signatory-label">Jabatan</span> : Kepala SDN {schoolData.schoolName}</p>
          <p>   Selanjutnya disebut Pihak Pertama</p>
        </div>
        
        <div className="signatory">
          <p>2. <span className="signatory-label">Nama</span>   : {letterData.vendorData.name}</p>
          <p>   <span className="signatory-label">Jabatan</span> : {letterData.vendorData.position}</p>
          <p>   Selanjutnya disebut Pihak Kedua</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <p>
          Pada hari ini [DAY NAME] tanggal [TEXT DATE] bulan [MMMM] tahun [TEXT YYYY] kami telah
          melakukan negosiasi harga dengan hasil sebagai berikut:
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
                <td>{formatCurrency(item.offeredPrice)}</td>
                <td>{formatCurrency(item.negotiatedPrice)}</td>
              </tr>
            ))}
            {/* Add empty rows if items are less than 5 */}
            {Array.from({ length: Math.max(0, 5 - letterData.items.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="empty-row">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="delivery-note">
          Barang tersebut di atas akan dikirim pada hari [DAY NAME], [Tanggal Kegiatan +1]. Demikian
          hasil negosiasi harga ini dibuat dan diketahui oleh kedua belah pihak.
        </p>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="signature-col">
            <p>Kepala SDN {schoolData.schoolName}</p>
            <div className="signature-space"></div>
            <p className="signature-name">{schoolData.principalName}</p>
            <p className="signature-nip">NIP. {schoolData.principalNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BASTNegoTemplate;
