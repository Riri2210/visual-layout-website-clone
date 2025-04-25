import React from 'react';
import './BAPB.css';
import logoJakarta from '@/assets/logo-jakarta.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface BAPBTemplateProps {
  schoolData: {
    schoolName: string;
    address: string;
    district: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    principalName: string;
    principalNip?: string;
  };
  letterData: {
    letterNumber: string;
    invoiceDate: string;
    suratPesananNumber: string;
    suratPesananDate: string;
    vendorData: {
      name: string;
      director: string;
      position: string;
    };
    committee: {
      chairman: string;
      secretary: string;
      treasurer: string;
    };
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
      condition?: 'good' | 'bad';
    }>;
  };
}

const BAPBTemplate: React.FC<BAPBTemplateProps> = ({ schoolData, letterData }) => {
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

  return (
    <div className="bapb-container">
      {/* Header Section */}
      <div className="bapb-header">
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
        <h2>BERITA ACARA PEMERIKSAAN BARANG</h2>
        <p>No: {letterData.letterNumber}</p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <p className="opening-paragraph">
          Pada hari ini [DAY NAME] tanggal [TEXT DATE] bulan [MMMM] tahun [TEXT YEAR] yang bertanda tangan di bawah ini:
        </p>

        {/* Committee Table */}
        <table className="committee-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>NAMA</th>
              <th>JABATAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>{letterData.committee.chairman}</td>
              <td>Ketua Pemeriksaan Barang</td>
            </tr>
            <tr>
              <td>2</td>
              <td>{letterData.committee.secretary}</td>
              <td>Sekretaris Pemeriksaan Barang</td>
            </tr>
            <tr>
              <td>3</td>
              <td>{letterData.committee.treasurer}</td>
              <td>Anggota Pemeriksaan Barang</td>
            </tr>
          </tbody>
        </table>

        <p className="regulation-paragraph">
          Berdasarkan Peraturan Gubernur Provinsi DKI Jakarta Nomor 37 Tahun 2011, selaku Panitia
          Pemeriksa dan Penerima Hasil Pekerjaan Pengadaan Barang dan Jasa telah memeriksa Barang
          dengan tally. Barang sebagaimana daftar terlampir yang diserahkan oleh CV. Harumi Multi Inovasi.
          Berdasarkan Surat Pesanan (SP) Nomor: {letterData.suratPesananNumber} tanggal {formattedPesananDate}
          dengan kesimpulan sebagai berikut:
        </p>

        <div className="conclusion">
          <p>a. Baik, sesuai Surat Pesanan (SP)</p>
          <p>b. Kurang / Tidak Baik</p>
          <p>
            Barang yang terdapat baik, kami beri tanda √ yang selanjutnya akan di serahkan oleh CV. Harumi
            Multi Inovasi kepada Panitia Pemeriksa Hasil Pekerjaan Pengadaan Barang dan Jasa, sedangkan
            yang tidak baik kami beri tanda X.
          </p>
        </div>

        <p className="closing-paragraph">
          Demikian Berita Acara ini dibuat untuk dipergunakan sebagaimana mestinya.
        </p>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="committee-signature">
            <p className="signature-header">PANITIA PEMERIKSA BARANG</p>
            <p className="signature-date">Jakarta, [Tanggal Kegiatan]</p>
            
            <div className="signature-row">
              <span>1. Ketua</span>
              <span>: {letterData.committee.chairman}</span>
              <span className="signature-line"></span>
            </div>
            
            <div className="vendor-signature">
              <p>CV. HARUMI MULTI INOVASI</p>
              <div className="vendor-signature-space"></div>
              <p>{letterData.vendorData.name}</p>
            </div>
            
            <div className="signature-row">
              <span>2. Sekretaris</span>
              <span>: {letterData.committee.secretary}</span>
              <span className="signature-line"></span>
            </div>
            
            <div className="signature-row">
              <span>3. Anggota</span>
              <span>: {letterData.committee.treasurer}</span>
              <span className="signature-line"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BAPBTemplate;
