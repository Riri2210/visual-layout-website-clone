import React from 'react';
import './SuratJalan.css';
import logoHarumi from '@/assets/logo-harumi.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface SuratJalanTemplateProps {
  schoolData: {
    schoolName: string;
    address?: string;
    district?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    principalName: string;
  };
  letterData: {
    letterNumber: string;
    invoiceDate: string;
    suratPesananNumber: string;
    suratPesananDate?: string;
    invoiceNumber: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      unit: string;
      condition?: string;
      notes?: string;
    }>;
    notes?: string;
    operatorName?: string;
  };
}

const SuratJalanTemplate: React.FC<SuratJalanTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the document
  const formattedDate = formatDate(letterData.invoiceDate);

  // Default operator name if not provided
  const operatorName = letterData.operatorName || '[Nama Operator Barang]';

  return (
    <div className="surat-jalan-container">
      {/* Header Section */}
      <div className="surat-jalan-header">
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
        <div className="document-title">
          <h3>SURAT JALAN</h3>
          <p>{letterData.letterNumber}</p>
        </div>
      </div>

      <hr className="divider" />

      {/* Document Info */}
      <div className="document-info">
        <div className="document-details">
          <div className="detail-row">
            <span className="detail-label">Tanggal</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">{formattedDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">No. Pesanan</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">{letterData.suratPesananNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">No. Faktur</span>
            <span className="detail-separator">:</span>
            <span className="detail-value">{letterData.invoiceNumber}</span>
          </div>
        </div>
        <div className="recipient-info">
          <p>Kepada</p>
          <p>Yth. {schoolData.principalName}</p>
          <p>Kepala {schoolData.schoolName}</p>
          <p>di</p>
          <p>Tempat</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="items-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>NAMA BARANG</th>
            <th>QTY</th>
            <th>KONDISI</th>
            <th>KETERANGAN</th>
          </tr>
        </thead>
        <tbody>
          {letterData.items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>{item.condition || 'Baik'}</td>
              <td>{item.notes || '-'}</td>
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

      {/* Notes */}
      <div className="notes-section">
        <p className="notes-title">Catatan :</p>
        <p className="notes-content">{letterData.notes || ''}</p>
        <div className="notes-lines">
          <hr className="notes-line" />
          <hr className="notes-line" />
          <hr className="notes-line" />
          <hr className="notes-line" />
          <hr className="notes-line" />
        </div>
      </div>

      {/* Signature Section */}
      <div className="signature-section">
        <div className="signature-column">
          <p className="signature-title">Penerima</p>
          <div className="signature-space"></div>
          <p className="signature-name">{operatorName}</p>
        </div>
        <div className="signature-column">
          <p className="signature-title">Pengirim</p>
          <div className="signature-space"></div>
          <p className="signature-name">Erick</p>
        </div>
      </div>
    </div>
  );
};

export default SuratJalanTemplate;
