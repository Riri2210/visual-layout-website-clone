
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateInvoiceNumber = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  return `F.${year}Bulan${month}Tanggal${day}`;
};

// New function to calculate PPN based on the new formula
export const calculatePPN = (totalPrice: number): number => {
  return totalPrice - (100 / 111 * totalPrice);
};

// New function to calculate PPH based on the new formula
export const calculatePPH = (totalPrice: number, ppn: number, pphPercentage: number = 0): number => {
  if (pphPercentage === 0) return 0;
  
  // Calculate PPH based on Total Price - PPN
  const baseAmount = totalPrice - ppn;
  return baseAmount * (pphPercentage / 100);
};

// Function to calculate administration fee (4% + 1%)
export const calculateAdministration = (totalPrice: number): number => {
  return totalPrice * 0.05; // 4% + 1% = 5%
};

// Function to save invoice data to local storage for Riwayat Faktur
export const saveInvoiceToHistory = (invoice: any) => {
  // Get existing invoice history
  const existingInvoices = localStorage.getItem('invoiceHistory');
  const invoiceHistory = existingInvoices ? JSON.parse(existingInvoices) : [];
  
  // Add new invoice to history
  invoiceHistory.push({
    ...invoice,
    timestamp: new Date().toISOString()
  });
  
  // Save updated history
  localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
};
