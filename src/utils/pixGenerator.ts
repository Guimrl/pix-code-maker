export interface PixData {
  pixKey: string;
  recipientName: string;
  amount?: number;
  description?: string;
  city?: string;
  txid?: string;
}

export function generatePixCode(data: PixData): string {
  const formatValue = (value: string): string => {
    return String(value.length).padStart(2, '0') + value;
  };

  const formatAmount = (amount: number): string => {
    return amount.toFixed(2);
  };

  // PIX format according to BACEN specification
  let pixString = '';
  
  // Payload Format Indicator
  pixString += '000201';
  
  // Point of Initiation Method (static = 11, dynamic = 12)
  pixString += '010211';
  
  // Merchant Account Information
  let merchantInfo = '';
  merchantInfo += '0014BR.GOV.BCB.PIX'; // GUI
  merchantInfo += formatValue(data.pixKey); // PIX Key
  
  pixString += '26' + formatValue(merchantInfo);
  
  // Merchant Category Code
  pixString += '52040000';
  
  // Transaction Currency (BRL = 986)
  pixString += '5303986';
  
  // Transaction Amount
  if (data.amount && data.amount > 0) {
    const amountStr = formatAmount(data.amount);
    pixString += '54' + formatValue(amountStr);
  }
  
  // Country Code
  pixString += '5802BR';
  
  // Merchant Name
  pixString += '59' + formatValue(data.recipientName);
  
  // Merchant City
  const city = data.city || 'SAO PAULO';
  pixString += '60' + formatValue(city);
  
  // Additional Data Field Template
  if (data.description || data.txid) {
    let additionalData = '';
    if (data.txid) {
      additionalData += '05' + formatValue(data.txid);
    }
    if (data.description) {
      additionalData += '02' + formatValue(data.description);
    }
    pixString += '62' + formatValue(additionalData);
  }
  
  // CRC16
  pixString += '6304';
  const crc = calculateCRC16(pixString);
  pixString += crc;
  
  return pixString;
}

function calculateCRC16(data: string): string {
  const polynomial = 0x1021;
  let crc = 0xFFFF;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}