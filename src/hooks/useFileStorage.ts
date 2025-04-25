import { useState, useEffect } from 'react';
import axios from 'axios';
import { Invoice } from '@/lib/dataService';

// Base URL untuk API
const API_URL = 'http://localhost:3001/api';

// Hook untuk mengambil faktur dari server
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengambil semua faktur
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/invoices`);
      setInvoices(response.data);
      
      // Juga simpan ke localStorage sebagai cadangan
      localStorage.setItem('invoiceHistory', JSON.stringify(response.data));
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Gagal mengambil data faktur dari server');
      
      // Fallback ke localStorage jika server error
      const storedInvoices = localStorage.getItem('invoiceHistory');
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      }
    } finally {
      setLoading(false);
    }
  };

  // Menyimpan faktur ke server
  const saveInvoice = async (invoice: Invoice) => {
    try {
      const response = await axios.post(`${API_URL}/invoices`, invoice);
      
      // Perbarui state lokal
      setInvoices(prevInvoices => {
        const existingIndex = prevInvoices.findIndex(
          item => item.no_faktur === invoice.no_faktur
        );
        
        if (existingIndex >= 0) {
          const updatedInvoices = [...prevInvoices];
          updatedInvoices[existingIndex] = invoice;
          return updatedInvoices;
        } else {
          return [...prevInvoices, invoice];
        }
      });
      
      // Juga simpan ke localStorage sebagai cadangan
      const updatedInvoices = [...invoices];
      const existingIndex = updatedInvoices.findIndex(
        item => item.no_faktur === invoice.no_faktur
      );
      
      if (existingIndex >= 0) {
        updatedInvoices[existingIndex] = invoice;
      } else {
        updatedInvoices.push(invoice);
      }
      localStorage.setItem('invoiceHistory', JSON.stringify(updatedInvoices));
      
      return response.data;
    } catch (err) {
      console.error('Error saving invoice:', err);
      
      // Fallback: simpan ke localStorage jika server error
      const storedInvoices = localStorage.getItem('invoiceHistory');
      let invoiceHistory: Invoice[] = [];
      
      if (storedInvoices) {
        invoiceHistory = JSON.parse(storedInvoices);
      }
      
      const existingIndex = invoiceHistory.findIndex(
        item => item.no_faktur === invoice.no_faktur
      );
      
      if (existingIndex >= 0) {
        invoiceHistory[existingIndex] = invoice;
      } else {
        invoiceHistory.push(invoice);
      }
      
      localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
      throw new Error('Gagal menyimpan faktur ke server, tetapi berhasil disimpan lokal');
    }
  };

  // Menghapus faktur dari server
  const deleteInvoice = async (invoiceNumber: string) => {
    try {
      await axios.delete(`${API_URL}/invoices/${invoiceNumber}`);
      
      // Perbarui state lokal
      setInvoices(prevInvoices => 
        prevInvoices.filter(invoice => invoice.no_faktur !== invoiceNumber)
      );
      
      // Perbarui juga di localStorage
      const storedInvoices = localStorage.getItem('invoiceHistory');
      if (storedInvoices) {
        const invoiceHistory: Invoice[] = JSON.parse(storedInvoices);
        const updatedInvoices = invoiceHistory.filter(
          invoice => invoice.no_faktur !== invoiceNumber
        );
        localStorage.setItem('invoiceHistory', JSON.stringify(updatedInvoices));
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting invoice:', err);
      throw new Error('Gagal menghapus faktur');
    }
  };

  // Sinkronisasi localStorage ke server
  const syncLocalStorageToServer = async () => {
    try {
      const storedInvoices = localStorage.getItem('invoiceHistory');
      if (storedInvoices) {
        const invoices = JSON.parse(storedInvoices);
        await axios.post(`${API_URL}/sync/local-to-file`, invoices);
        return { success: true };
      }
      return { success: false, message: 'Tidak ada data lokal untuk disinkronkan' };
    } catch (err) {
      console.error('Error syncing localStorage to server:', err);
      throw new Error('Gagal menyinkronkan data lokal ke server');
    }
  };

  // Mengambil nomor transaksi berikutnya
  const getNextTransactionNumber = async (type: 'bos' | 'bop') => {
    try {
      const response = await axios.get(`${API_URL}/transactions/${type}`);
      return response.data.nextNumber;
    } catch (err) {
      console.error(`Error getting ${type} transaction number:`, err);
      
      // Fallback ke localStorage
      const key = type === 'bos' ? 'lastBOSTransactionNumber' : 'lastBOPTransactionNumber';
      const lastNumber = localStorage.getItem(key);
      if (lastNumber) {
        const nextNumber = (parseInt(lastNumber) + 1).toString().padStart(3, '0');
        localStorage.setItem(key, nextNumber);
        return nextNumber;
      }
      
      return '001';
    }
  };

  // Mengambil faktur saat komponen dimuat
  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    saveInvoice,
    deleteInvoice,
    syncLocalStorageToServer,
    getNextTransactionNumber
  };
}

// Hook untuk pengaturan
export function useSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/settings`);
      setSettings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Gagal mengambil pengaturan dari server');
      
      // Fallback ke localStorage
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await axios.post(`${API_URL}/settings`, newSettings);
      setSettings(newSettings);
      
      // Backup ke localStorage
      localStorage.setItem('settings', JSON.stringify(newSettings));
      
      return { success: true };
    } catch (err) {
      console.error('Error saving settings:', err);
      
      // Fallback: simpan ke localStorage
      localStorage.setItem('settings', JSON.stringify(newSettings));
      
      throw new Error('Gagal menyimpan pengaturan ke server, tetapi berhasil disimpan lokal');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    saveSettings
  };
}
