import React from 'react';
import './SPK.css';
import logoJakarta from '@/assets/logo-jakarta.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface SPKTemplateProps {
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
    activityDate: string;
    suratPesananNumber: string;
    suratPesananDate: string;
    activityCode: string;
    activityName: string;
    fundingSource: string;
    vendorData: {
      name: string;
      director: string;
      position: string;
    };
  };
}

const SPKTemplate: React.FC<SPKTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the document
  const formattedActivityDate = formatDate(letterData.activityDate);
  const formattedPesananDate = formatDate(letterData.suratPesananDate || letterData.invoiceDate);

  return (
    <div className="spk-container">
      {/* Header Section */}
      <div className="spk-header">
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
        <h2>SURAT PERINTAH KERJA (SPK)</h2>
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
          Untuk segera memulai pelaksanaan pekerjaan berdasarkan surat pesanan nomor {letterData.suratPesananNumber} tanggal {formattedPesananDate} dengan memperhatikan beberapa ketentuan sebagai berikut:
        </p>

        <div className="details">
          <p>1. <span className="detail-label">Kegiatan</span>    : {letterData.activityCode} berupa {letterData.activityName}</p>
          <p>2. <span className="detail-label">Sumber Dana</span> : {letterData.fundingSource || 'BOS'}</p>
          <p>3. <span className="detail-label">Batas Waktu</span> : {formattedActivityDate}</p>
        </div>

        <p className="closing">
          Demikian Surat Perintah Kerja ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
        </p>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="signature-left">
            <p>CV. HARUMI MULTI INOVASI</p>
            <div className="signature-space"></div>
            <p className="signature-name">{letterData.vendorData.name}</p>
          </div>
          <div className="signature-right">
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

export default SPKTemplate;
