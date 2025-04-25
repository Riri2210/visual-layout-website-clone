import React from 'react';
import './SuratPesanan.css';
import logoJakarta from '@/assets/logo-jakarta.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface SuratPesananTemplateProps {
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
    activityCode: string;
    activityName: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
    }>;
  };
}

const SuratPesananTemplate: React.FC<SuratPesananTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the header (DD Month YYYY)
  const formattedDate = formatDate(letterData.invoiceDate);

  return (
    <div className="surat-pesanan-container">
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
            <span className="detail-value">Surat Pesanan</span>
          </p>
          <p>
            <span className="detail-label">Kegiatan</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">
              {letterData.activityCode}
              <br />
              Untuk {letterData.activityName}
            </span>
          </p>
        </div>
        <div className="letter-right">
          <p>{formattedDate}</p>
          <p>Yth. CV. HARUMI MULTI INOVASI</p>
          <p>di</p>
          <p>Tempat</p>
        </div>
      </div>

      {/* Letter Body */}
      <div className="letter-body">
        <p>Dengan Hormat,</p>
        <p className="letter-content">
          Sehubungan dengan Kegiatan {letterData.activityCode} untuk {letterData.activityName} di {schoolData.schoolName} sesuai e-RKAS tahun {new Date().getFullYear()} dengan ini saya mengajukan usulan kebutuhan barang berupa {letterData.activityCode} untuk bulan {format(parseISO(letterData.invoiceDate), 'MMMM', { locale: id })} Tahun {format(parseISO(letterData.invoiceDate), 'yyyy')}, sebagai berikut:
        </p>

        {/* Table */}
        <table className="items-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>NAMA BARANG</th>
              <th>QTY</th>
              <th>SATUAN</th>
            </tr>
          </thead>
          <tbody>
            {letterData.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
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
          Diharapkan kepada Bapak/Ibu segera dapat mengirimkan daftar harga dan sudah termasuk pajak. Atas perhatian dan kerjasamanya diucapkan terima kasih.
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

export default SuratPesananTemplate;
