import { Currency } from '../types/enums';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  nameTR: string;
  decimals: number;
  minorUnit: number;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  [Currency.TRY]: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    nameTR: 'Türk Lirası',
    decimals: 2,
    minorUnit: 100,
  },
  [Currency.USD]: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nameTR: 'Amerikan Doları',
    decimals: 2,
    minorUnit: 100,
  },
  [Currency.EUR]: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    nameTR: 'Euro',
    decimals: 2,
    minorUnit: 100,
  },
  [Currency.GBP]: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    nameTR: 'İngiliz Sterlini',
    decimals: 2,
    minorUnit: 100,
  },
  [Currency.JPY]: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    nameTR: 'Japon Yeni',
    decimals: 0,
    minorUnit: 1,
  },
  [Currency.CHF]: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    nameTR: 'İsviçre Frangı',
    decimals: 2,
    minorUnit: 100,
  },
  [Currency.AUD]: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    nameTR: 'Avustralya Doları',
    decimals: 2,
    minorUnit: 100,
  },
  [Currency.CAD]: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    nameTR: 'Kanada Doları',
    decimals: 2,
    minorUnit: 100,
  },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

