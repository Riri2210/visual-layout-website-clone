export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateInvoiceNumber = (inputNumber: number = 1): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  
  const schoolCode = "B07";
  
  return `HMI.F.${year}${month}${day}${inputNumber}${schoolCode}`;
};

export const calculatePPN = (totalPrice: number): number => {
  return totalPrice - (100 / 111 * totalPrice);
};

export const calculatePPH = (totalPrice: number, ppn: number, pphPercentage: number = 0): number => {
  if (pphPercentage === 0) return 0;
  
  const baseAmount = totalPrice - ppn;
  return baseAmount * (pphPercentage / 100);
};

export const calculateAdministration = (totalPrice: number): number => {
  return totalPrice * 0.05; // 4% + 1% = 5%
};

export const saveInvoiceToHistory = (invoice: any) => {
  const existingInvoices = localStorage.getItem('invoiceHistory');
  const invoiceHistory = existingInvoices ? JSON.parse(existingInvoices) : [];
  
  invoiceHistory.push({
    ...invoice,
    timestamp: new Date().toISOString()
  });
  
  localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory));
};
