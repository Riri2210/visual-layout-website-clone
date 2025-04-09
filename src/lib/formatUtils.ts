
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

export const generateLetterNumber = (
  prefix: string,
  date: Date,
  transactionNumber: string = '001',
  schoolCode: string = 'B07'
): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${prefix}.${year}${month}${day}${transactionNumber}${schoolCode}`;
};

export const getNextSequenceNumber = (letterNumber: string): string => {
  const parts = letterNumber.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Extract sequence number if it exists, otherwise use 1
  const seqMatch = lastPart.match(/\d+$/);
  const currentSeq = seqMatch ? parseInt(seqMatch[0], 10) : 0;
  const nextSeq = (currentSeq + 1).toString().padStart(seqMatch ? seqMatch[0].length : 3, '0');
  
  // Replace the last part with updated sequence
  if (seqMatch) {
    parts[parts.length - 1] = lastPart.replace(/\d+$/, nextSeq);
  } else {
    parts.push(nextSeq);
  }
  
  return parts.join('.');
};
