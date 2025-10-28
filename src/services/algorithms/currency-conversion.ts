import { Currency } from '../../types/enums';
import { CURRENCIES } from '../../constants/currencies';

export interface ConversionResult {
  convertedAmount: number;
  rate: number;
  rateDate: Date;
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number, // In kuruş/minor units
  currency: Currency,
  locale: string = 'tr-TR'
): string {
  const info = CURRENCIES[currency];
  const majorAmount = amount / info.minorUnit;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals,
  }).format(majorAmount);
}

/**
 * Convert major units to minor units (TL -> kuruş)
 */
export function toMinorUnits(
  amount: number,
  currency: Currency
): number {
  const info = CURRENCIES[currency];
  return Math.round(amount * info.minorUnit);
}

/**
 * Convert minor units to major units (kuruş -> TL)
 */
export function toMajorUnits(amount: number, currency: Currency): number {
  const info = CURRENCIES[currency];
  return amount / info.minorUnit;
}

/**
 * Split amount equally among count participants
 * Handles rounding errors using largest remainder method
 */
export function splitEqually(
  totalAmount: number, // In kuruş
  count: number
): number[] {
  const quotient = Math.floor(totalAmount / count);
  const remainder = totalAmount - quotient * count;

  const shares = Array(count).fill(quotient);

  // Distribute remainder to first N people
  for (let i = 0; i < remainder; i++) {
    shares[i] += 1;
  }

  // Validation
  const sum = shares.reduce((a, b) => a + b, 0);
  if (sum !== totalAmount) {
    throw new Error('Yuvarlama hatası: Toplam eşleşmiyor');
  }

  return shares;
}

/**
 * Convert currency (mock implementation - replace with real API)
 */
export async function convertCurrency(
  amount: number, // In kuruş
  from: Currency,
  to: Currency,
  manualRate?: number
): Promise<ConversionResult> {
  // Same currency
  if (from === to) {
    return {
      convertedAmount: amount,
      rate: 1.0,
      rateDate: new Date(),
    };
  }

  // Manual rate
  if (manualRate) {
    const fromInfo = CURRENCIES[from];
    const toInfo = CURRENCIES[to];

    const majorAmount = amount / fromInfo.minorUnit;
    const convertedMajor = majorAmount * manualRate;
    const convertedAmount = Math.round(convertedMajor * toInfo.minorUnit);

    return {
      convertedAmount,
      rate: manualRate,
      rateDate: new Date(),
    };
  }

  // TODO: Fetch from API or cache
  // Mock exchange rates for development
  const rates: Record<string, number> = {
    'USD-TRY': 32.5,
    'EUR-TRY': 35.0,
    'GBP-TRY': 41.0,
    'TRY-USD': 1 / 32.5,
    'TRY-EUR': 1 / 35.0,
    'TRY-GBP': 1 / 41.0,
  };

  const rateKey = `${from}-${to}`;
  const rate = rates[rateKey] || 1.0;

  const fromInfo = CURRENCIES[from];
  const toInfo = CURRENCIES[to];

  const majorAmount = amount / fromInfo.minorUnit;
  const convertedMajor = majorAmount * rate;
  const convertedAmount = Math.round(convertedMajor * toInfo.minorUnit);

  return {
    convertedAmount,
    rate,
    rateDate: new Date(),
  };
}

/**
 * Parse currency string to minor units
 */
export function parseCurrency(value: string, currency: Currency): number {
  const cleaned = value.replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(',', '.');
  const parsed = parseFloat(normalized);

  if (isNaN(parsed)) {
    throw new Error('Geçersiz tutar');
  }

  return toMinorUnits(parsed, currency);
}

