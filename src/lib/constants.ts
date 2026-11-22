import { MetalType, BullionRate, NotificationScheduleConfig } from '@/types/bullion';

export const METAL_CONFIG: Record<
  MetalType,
  {
    name: string;
    purity: string;
    unit: '10g' | '1kg';
    unitLabel: string;
    description: string;
  }
> = {
  gold_24k: {
    name: '24 Karat Fine Gold',
    purity: '99.9% Pure',
    unit: '10g',
    unitLabel: 'per 10 grams',
    description: 'National standard benchmark pure gold rate (ex-GST, ex-making).',
  },
  gold_22k: {
    name: '22 Karat Standard Gold',
    purity: '91.6% Pure (Jewellery Grade)',
    unit: '10g',
    unitLabel: 'per 10 grams',
    description: 'National hallmark jewellery standard rate (ex-GST, ex-making).',
  },
  silver: {
    name: 'Fine Silver 999',
    purity: '99.9% Pure',
    unit: '1kg',
    unitLabel: 'per 1 kilogram',
    description: 'National benchmark bullion silver bar rate (ex-GST).',
  },
};

export const INITIAL_EMPTY_RATES: Record<MetalType, BullionRate> = {
  gold_24k: {
    metalType: 'gold_24k',
    metalName: 'Gold 24K',
    purity: '99.9% Pure',
    price: null,
    currency: 'INR',
    unit: '10g',
    changeAmount: null,
    changePercentage: null,
    previousClose: null,
    tradingDate: null,
    source: 'National Benchmark (IBJA/MCX)',
    isAvailable: false,
  },
  gold_22k: {
    metalType: 'gold_22k',
    metalName: 'Gold 22K',
    purity: '91.6% Pure (916 Hallmark)',
    price: null,
    currency: 'INR',
    unit: '10g',
    changeAmount: null,
    changePercentage: null,
    previousClose: null,
    tradingDate: null,
    source: 'National Benchmark (IBJA/MCX)',
    isAvailable: false,
  },
  silver: {
    metalType: 'silver',
    metalName: 'Silver 999',
    purity: '99.9% Pure',
    price: null,
    currency: 'INR',
    unit: '1kg',
    changeAmount: null,
    changePercentage: null,
    previousClose: null,
    tradingDate: null,
    source: 'National Benchmark (IBJA/MCX)',
    isAvailable: false,
  },
};

export const DEFAULT_NOTIFICATION_CONFIG: NotificationScheduleConfig = {
  scheduledTimeIST: '07:00 AM IST',
  cronExpression: '30 1 * * *', // 01:30 UTC = 07:00 IST
  recipientPhoneMasked: '+91 98*** ***10',
  provider: 'whatsapp_cloud_api',
  status: 'pending_credentials',
  lastDispatchStatus: 'never',
  lastDispatchedAt: null,
};
