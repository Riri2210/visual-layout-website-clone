
import React from 'react';
import { formatCurrency } from '@/lib/formatUtils';

interface Item {
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  ppn: boolean;
  pph: boolean;
  netto: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  recipient: string;
  items: Item[];
  totalBeforeTax: number;
  ppnAmount: number;
  pphAmount: number;
  grandTotal: number;
  activityName: string;
  accountCode: string;
  administrationAmount: number;
}

interface InvoicePreviewProps {
  data: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  // Calculate 4% and 1% separately from the totalBeforeTax
  const adminFourPercent = data.totalBeforeTax * 0.04;
  const adminOnePercent = data.totalBeforeTax * 0.01;
  
  // Calculate values according to the specified formulas
  const totalBeforePPN = data.totalBeforeTax - data.ppnAmount - data.pphAmount;
  const grandTotal = totalBeforePPN + data.ppnAmount + data.pphAmount;
  
  return (
    <div className="bg-white w-full p-8 shadow-lg border rounded-md print:shadow-none print:border-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b border-black pb-2">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 flex items-center justify-center relative overflow-hidden">
            <img 
              src="/lovable-uploads/7e386096-8ee7-48fd-a559-5a534f904fd0.png" 
              alt="Harumi Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CV. HARUMI MULTI INOVASI</h1>
            <p className="text-sm">Toko Komputer dan Olahraga, Pemeliharaan Gedung, dan Event Organizer</p>
            <p className="text-sm">Jl. Matraman Raya No. 67 Kec. Matraman - Jakarta Timur</p>
            <p className="text-sm">e-mail: cv.harumi.multi.inovasi@gmail.com, Telp. 089503939444</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold">FAKTUR</h2>
          <p className="text-sm">{data.invoiceNumber}</p>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 mb-6">
        <div>
          <div className="flex">
            <span className="w-28">Tanggal</span>
            <span className="mr-2">:</span>
            <span>{data.date}</span>
          </div>
          <div className="flex">
            <span className="w-28">No. Pesanan</span>
            <span className="mr-2">:</span>
            <span>{data.accountCode}</span>
          </div>
          <div className="flex">
            <span className="w-28">No. Surat Jalan</span>
            <span className="mr-2">:</span>
            <span>{`HMISI.${data.invoiceNumber}`}</span>
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <div>
              <span>Kepada</span>
            </div>
            <div>
              <span className="font-bold">Yth. Kepala SDN {data.recipient}</span>
            </div>
            <div>
              <span>di</span>
            </div>
            <div>
              <span>Tempat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-2 text-center">NO</th>
            <th className="border border-black p-2 text-center">NAMA BARANG</th>
            <th className="border border-black p-2 text-center">QTY</th>
            <th className="border border-black p-2 text-center">HARGA</th>
            <th className="border border-black p-2 text-center">JUMLAH</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-black p-2 text-center">{index + 1}</td>
              <td className="border border-black p-2">{item.name}</td>
              <td className="border border-black p-2 text-center">{`${item.quantity} ${item.unit}`}</td>
              <td className="border border-black p-2 text-right">{formatCurrency(item.unitPrice).replace('Rp\u00A0', 'Rp ')}</td>
              <td className="border border-black p-2 text-right">{formatCurrency(item.totalPrice).replace('Rp\u00A0', 'Rp ')}</td>
            </tr>
          ))}
          {/* Empty rows to fill space */}
          {Array.from({ length: Math.max(5 - data.items.length, 0) }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td className="border border-black p-2">&nbsp;</td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
              <td className="border border-black p-2"></td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="border border-black p-2 text-right font-bold">TOTAL</td>
            <td className="border border-black p-2 text-right">{formatCurrency(data.totalBeforeTax).replace('Rp\u00A0', 'Rp ')}</td>
          </tr>
        </tbody>
      </table>

      {/* Notes and Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-black p-2">
          <p className="font-bold">Perhatian!</p>
          <p className="text-sm">Barang yang sudah dibeli tidak dapat dikembalikan</p>
          <p className="text-sm">kecuali sudah perjanjian terlebih dahulu</p>
          <p className="text-sm mt-2">NPWP: 96585333009000</p>
          <p className="text-sm">No. Rek</p>
          <p className="text-sm">DKI : 43608001223</p>
          <p className="text-sm">BNI : 3097878775</p>
        </div>
        <div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="p-2 text-right">Total Sebelum PPN</td>
                <td className="border border-black p-2 text-right">
                  {formatCurrency(totalBeforePPN).replace('Rp\u00A0', 'Rp ')}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-right">Total PPN</td>
                <td className="border border-black p-2 text-right">
                  {formatCurrency(data.ppnAmount).replace('Rp\u00A0', 'Rp ')}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-right">Total PPH</td>
                <td className="border border-black p-2 text-right">
                  {formatCurrency(data.pphAmount).replace('Rp\u00A0', 'Rp ')}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-right">Grand Total</td>
                <td className="border border-black p-2 text-right">
                  {formatCurrency(grandTotal).replace('Rp\u00A0', 'Rp ')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 grid grid-cols-2">
        <div></div>
        <div className="text-center">
          <p className="font-bold mb-20">CV. HARUMI MULTI INOVASI</p>
          <p className="font-bold">Ananda Shafa Rianti</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
