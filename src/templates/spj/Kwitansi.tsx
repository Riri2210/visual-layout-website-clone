import React from 'react';
import './Kwitansi.css';
import logoHarumi from '@/assets/logo-harumi.svg';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface KwitansiTemplateProps {
  schoolData: {
    schoolName: string;
  };
  letterData: {
    letterNumber: string;
    invoiceDate: string;
    invoiceNumber: string;
    activityCode: string;
    activityName: string;
    amount: number;
    npwp?: string;
    rekDKI?: string;
    rekBNI?: string;
    qrCodeUrl?: string;
  };
}

const KwitansiTemplate: React.FC<KwitansiTemplateProps> = ({ schoolData, letterData }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Format the date to display in the document
  const formattedDate = formatDate(letterData.invoiceDate);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format to words (simplified version)
  const amountInWords = `[${formatCurrency(letterData.amount).replace('Rp', 'ARGUABLY Bruto')}]`;

  return (
    <div className="kwitansi-container">
      <div className="kwitansi-content">
        {/* Left Column - Colored Bar */}
        <div className="colored-bar"></div>

        {/* Right Column - Content */}
        <div className="receipt-details">
          {/* Header */}
          <div className="receipt-header">
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
            <div className="receipt-title">
              <h2>KWITANSI</h2>
            </div>
          </div>

          {/* Receipt Information */}
          <div className="receipt-info">
            <div className="info-row">
              <div className="info-label">No. :</div>
              <div className="info-value">{letterData.invoiceNumber}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Telah terima dari</div>
              <div className="info-value">: {schoolData.schoolName}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Uang Sejumlah</div>
              <div className="info-value">: {amountInWords}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Untuk Pembayaran</div>
              <div className="info-value">: {letterData.activityCode} untuk {letterData.activityName}</div>
            </div>
          </div>

          {/* Amount */}
          <div className="receipt-amount">
            <h3>{formatCurrency(letterData.amount)}</h3>
          </div>

          {/* Signature */}
          <div className="receipt-signature">
            <div className="signature-date">Jakarta [{formattedDate}]</div>
            <div className="signature-name">Ananda Shafa Rianti</div>
          </div>

          {/* Footer Information */}
          <div className="receipt-footer">
            <div className="npwp-info">
              <p>NPWP : {letterData.npwp || '965835333009000'}</p>
              <p>No. Rek</p>
              <p>DKI     : {letterData.rekDKI || '43608001223'}</p>
              <p>BNI     : {letterData.rekBNI || '3097878775'}</p>
            </div>

            {/* QR Code */}
            <div className="qr-code">
              {letterData.qrCodeUrl ? (
                <img src={letterData.qrCodeUrl} alt="QR Code" className="qr-image" />
              ) : (
                <div className="placeholder-qr">QR Code</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KwitansiTemplate;
