import { promises as fs } from 'fs';
import path from 'path';

// Path ke file data
const dataDirectory = path.join(process.cwd(), 'src', 'data');
const invoicesFilePath = path.join(dataDirectory, 'invoices.json');
const settingsFilePath = path.join(dataDirectory, 'settings.json');
const transactionsFilePath = path.join(dataDirectory, 'transactions.json');

// Tipe data
export interface InvoiceItem {
  id: string;
  name: string;
  totalPrice: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  ppn: boolean;
  pph: boolean;
  pphPercentage?: string;
  netto: number;
}

export interface Invoice {
  no_faktur: string;
  tanggal: string;
  sumber_dana: string;
  kegiatan: string;
  total: string;
  items: InvoiceItem[];
  summary: {
    subtotal: number;
    totalPPN: number;
    totalPPH: number;
    administration: number;
    adminFourPercent?: number;
    adminOnePercent?: number;
    total: number;
  };
  accountCode: string;
  recipient: string;
  activityDate: string;
  timestamp: string;
  transactionNumber?: string;
}

export interface Settings {
  schoolName?: string;
  schoolAddress?: string;
  principalName?: string;
  treasurer?: string;
  // Pengaturan tambahan
  lastBOSTransactionNumber?: string;
  lastBOPTransactionNumber?: string;
}

// Fungsi untuk memastikan direktori data ada
export async function ensureDataDirectory() {
  try {
    await fs.access(dataDirectory);
  } catch (error) {
    await fs.mkdir(dataDirectory, { recursive: true });
  }
}

// Fungsi untuk memastikan file data ada
async function ensureDataFiles() {
  await ensureDataDirectory();
  
  try {
    await fs.access(invoicesFilePath);
  } catch (error) {
    await fs.writeFile(invoicesFilePath, '[]');
  }

  try {
    await fs.access(settingsFilePath);
  } catch (error) {
    await fs.writeFile(settingsFilePath, '{}');
  }

  try {
    await fs.access(transactionsFilePath);
  } catch (error) {
    await fs.writeFile(transactionsFilePath, '{}');
  }
}

// -------- INVOICE OPERATIONS --------

// Ambil semua faktur
export async function getAllInvoices(): Promise<Invoice[]> {
  await ensureDataFiles();
  const data = await fs.readFile(invoicesFilePath, 'utf8');
  return JSON.parse(data);
}

// Simpan faktur baru atau perbarui yang sudah ada
export async function saveInvoice(invoice: Invoice): Promise<void> {
  await ensureDataFiles();
  const invoices = await getAllInvoices();
  
  // Cek apakah faktur sudah ada (update) atau baru (create)
  const existingIndex = invoices.findIndex(item => item.no_faktur === invoice.no_faktur);
  
  if (existingIndex >= 0) {
    invoices[existingIndex] = invoice;
  } else {
    invoices.push(invoice);
  }
  
  await fs.writeFile(invoicesFilePath, JSON.stringify(invoices, null, 2));
}

// Hapus faktur berdasarkan nomor
export async function deleteInvoice(invoiceNumber: string): Promise<void> {
  await ensureDataFiles();
  let invoices = await getAllInvoices();
  
  // Filter invoices untuk menghapus yang sesuai nomor
  invoices = invoices.filter(invoice => invoice.no_faktur !== invoiceNumber);
  
  await fs.writeFile(invoicesFilePath, JSON.stringify(invoices, null, 2));
}

// Cari faktur berdasarkan nomor
export async function getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
  const invoices = await getAllInvoices();
  const invoice = invoices.find(item => item.no_faktur === invoiceNumber);
  return invoice || null;
}

// Filter faktur berdasarkan sumber dana
export async function getInvoicesByFundSource(fundSource: string): Promise<Invoice[]> {
  const invoices = await getAllInvoices();
  return invoices.filter(item => item.sumber_dana.toLowerCase() === fundSource.toLowerCase());
}

// -------- SETTINGS OPERATIONS --------

// Ambil pengaturan
export async function getSettings(): Promise<Settings> {
  await ensureDataFiles();
  const data = await fs.readFile(settingsFilePath, 'utf8');
  return JSON.parse(data);
}

// Simpan pengaturan
export async function saveSettings(settings: Settings): Promise<void> {
  await ensureDataFiles();
  await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2));
}

// -------- TRANSACTION NUMBERS --------

// Ambil dan perbarui nomor transaksi
export async function getNextTransactionNumber(type: 'bos' | 'bop'): Promise<string> {
  await ensureDataFiles();
  const data = await fs.readFile(transactionsFilePath, 'utf8');
  const transactions = JSON.parse(data);
  
  const key = type === 'bos' ? 'lastBOSTransactionNumber' : 'lastBOPTransactionNumber';
  let nextNumber = '001';
  
  if (transactions[key]) {
    nextNumber = (parseInt(transactions[key]) + 1).toString().padStart(3, '0');
  }
  
  transactions[key] = nextNumber;
  await fs.writeFile(transactionsFilePath, JSON.stringify(transactions, null, 2));
  
  return nextNumber;
}

// -------- FALLBACK TO LOCALSTORAGE --------
// Fungsi-fungsi untuk fallback ke localStorage jika ada masalah dengan file

// Simpan ke localStorage (fallback jika file tidak bisa diakses)
export function saveInvoiceToLocalStorage(invoice: Invoice) {
  if (typeof window !== 'undefined') {
    const existingInvoices = localStorage.getItem('invoiceHistory');
    let invoiceHistory: Invoice[] = [];
    
    if (existingInvoices) {
      invoiceHistory = JSON.parse(existingInvoices);
    }
    
    const existingIndex = invoiceHistory.findIndex(item => item.no_faktur === invoice.no_faktur);
    if (existingIndex >= 0) {
      invoiceHistory[existingIndex] = invoice;
    } else {
      invoiceHistory.push(invoice);
    }
    
    localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
  }
}

// Fungsi penting untuk sinkronisasi
export async function syncLocalStorageToFile() {
  if (typeof window !== 'undefined') {
    const storedInvoices = localStorage.getItem('invoiceHistory');
    if (storedInvoices) {
      const invoices: Invoice[] = JSON.parse(storedInvoices);
      for (const invoice of invoices) {
        await saveInvoice(invoice);
      }
    }
  }
}

export async function syncFileToLocalStorage() {
  if (typeof window !== 'undefined') {
    const invoices = await getAllInvoices();
    localStorage.setItem('invoiceHistory', JSON.stringify(invoices));
  }
}

// Ekspor fungsi tambahan dari formatUtils
export * from './formatUtils';
