export interface PixData {
  pixKey: string;
  recipientName: string;
  amount?: number;
  description?: string;
  city?: string;
  txid?: string;
}

export function generatePixCode(data: PixData): string {
  const formatValue = (id: string, value: string): string => {
    const length = value.length.toString().padStart(2, '0');
    return id + length + value;
  };

  const formatAmount = (amount: number): string => {
    return amount.toFixed(2);
  };

  // PIX EMV format according to BACEN specification
  let pixString = '';
  
  // Payload Format Indicator (obrigatório)
  pixString += formatValue('00', '01');
  
  // Point of Initiation Method - 12 para QR dinâmico com valor
  if (data.amount && data.amount > 0) {
    pixString += formatValue('01', '12');
  } else {
    pixString += formatValue('01', '11'); // QR estático
  }
  
  // Merchant Account Information (campo 26 para PIX)
  let merchantInfo = '';
  merchantInfo += formatValue('00', 'BR.GOV.BCB.PIX'); // GUI obrigatório
  merchantInfo += formatValue('01', data.pixKey); // Chave PIX
  
  pixString += formatValue('26', merchantInfo);
  
  // Merchant Category Code (obrigatório)
  pixString += formatValue('52', '0000');
  
  // Transaction Currency - 986 para Real brasileiro (obrigatório)
  pixString += formatValue('53', '986');
  
  // Transaction Amount (se houver valor)
  if (data.amount && data.amount > 0) {
    const amountStr = formatAmount(data.amount);
    pixString += formatValue('54', amountStr);
  }
  
  // Country Code (obrigatório)
  pixString += formatValue('58', 'BR');
  
  // Merchant Name (obrigatório)
  let merchantName = data.recipientName.toUpperCase();
  // Limitar a 25 caracteres conforme especificação
  if (merchantName.length > 25) {
    merchantName = merchantName.substring(0, 25);
  }
  pixString += formatValue('59', merchantName);
  
  // Merchant City (obrigatório)
  let city = (data.city || 'SAO PAULO').toUpperCase();
  // Limitar a 15 caracteres conforme especificação
  if (city.length > 15) {
    city = city.substring(0, 15);
  }
  pixString += formatValue('60', city);
  
  // Additional Data Field Template (opcional)
  if (data.description || data.txid) {
    let additionalData = '';
    if (data.txid) {
      let txid = data.txid;
      if (txid.length > 25) {
        txid = txid.substring(0, 25);
      }
      additionalData += formatValue('05', txid);
    }
    if (data.description) {
      let desc = data.description;
      if (desc.length > 72) {
        desc = desc.substring(0, 72);
      }
      additionalData += formatValue('02', desc);
    }
    pixString += formatValue('62', additionalData);
  }
  
  // CRC16 (obrigatório)
  pixString += '6304';
  const crc = calculateCRC16(pixString);
  pixString += crc;
  
  return pixString;
}

function calculateCRC16(data: string): string {
  const polynomial = 0x1021;
  let crc = 0xFFFF;
  
  const bytes = new TextEncoder().encode(data);
  
  for (let i = 0; i < bytes.length; i++) {
    crc ^= (bytes[i] << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  
  return crc.toString(16).toUpperCase().padStart(4, '0');
}