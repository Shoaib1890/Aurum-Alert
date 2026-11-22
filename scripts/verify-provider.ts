import { GoldApiProvider } from '../src/lib/bullion/providers/goldapi';
import { GoldApiQuote } from '../src/lib/bullion/types';

// Realistic sample response from GoldAPI.io for XAU/INR
const mockGoldResponse: GoldApiQuote = {
  timestamp: 1740000000,
  metal: 'XAU',
  currency: 'INR',
  exchange: 'FOREX',
  symbol: 'FOREX:XAUINR',
  prev_close_price: 236400.0,
  open_price: 236500.0,
  low_price: 235900.0,
  high_price: 237800.0,
  price: 237200.0,
  ch: 800.0,
  chp: 0.34,
  price_gram_24k: 7626.16,
  price_gram_22k: 6990.64, // Dedicated 22K value from API
  price_gram_21k: 6672.89,
  price_gram_20k: 6355.13,
  price_gram_18k: 5719.62,
  price_gram_14k: 4448.59,
  price_gram_10k: 3177.56,
};

// Realistic sample response from GoldAPI.io for XAG/INR
const mockSilverResponse: GoldApiQuote = {
  timestamp: 1740000000,
  metal: 'XAG',
  currency: 'INR',
  exchange: 'FOREX',
  symbol: 'FOREX:XAGINR',
  prev_close_price: 2790.0,
  open_price: 2795.0,
  low_price: 2780.0,
  high_price: 2825.0,
  price: 2815.0,
  ch: 25.0,
  chp: 0.9,
  price_gram_24k: 90.5, // Pure silver per gram
};

async function runTests() {
  console.log('====================================================');
  console.log('DAILY BULLION ALERT — PHASE 2A VERIFICATION SUITE');
  console.log('====================================================\n');

  const provider = new GoldApiProvider();

  // Test 1: Normalization & Unit Conversions
  console.log('Test 1: Normalizing GoldAPI Quotes & Unit Conversions...');
  const overview = provider.normalizeQuotes(mockGoldResponse, mockSilverResponse);

  console.log('Normalized Rates Output:');
  console.log(JSON.stringify(overview.rates, null, 2));

  // Verify 24K Gold per 10g
  // 7626.16 * 10 = 76261.6 -> Math.round = 76262
  const expectedGold24k = Math.round(mockGoldResponse.price_gram_24k! * 10);
  console.log(`\n- 24K Gold (10g): Expected ₹${expectedGold24k}, Got ₹${overview.rates.gold_24k.price}`);
  if (overview.rates.gold_24k.price !== expectedGold24k) {
    throw new Error('24K Gold conversion mismatch!');
  }

  // Verify 22K Gold per 10g uses dedicated price_gram_22k
  // 6990.64 * 10 = 69906.4 -> Math.round = 69906
  const expectedGold22k = Math.round(mockGoldResponse.price_gram_22k! * 10);
  console.log(`- 22K Gold (10g): Expected ₹${expectedGold22k}, Got ₹${overview.rates.gold_22k.price}`);
  if (overview.rates.gold_22k.price !== expectedGold22k) {
    throw new Error('22K Gold conversion mismatch!');
  }

  // Verify Silver per 1kg
  // 90.50 * 1000 = 90500
  const expectedSilverKg = Math.round(mockSilverResponse.price_gram_24k! * 1000);
  console.log(`- Silver (1kg): Expected ₹${expectedSilverKg}, Got ₹${overview.rates.silver.price}`);
  if (overview.rates.silver.price !== expectedSilverKg) {
    throw new Error('Silver 1kg conversion mismatch!');
  }

  // Verify Day Change Calculations
  console.log('\nTest 2: Verifying Session Price Change Calculations...');
  console.log(
    `- 24K Change: ₹${overview.rates.gold_24k.changeAmount} (${overview.rates.gold_24k.changePercentage}%)`
  );
  console.log(
    `- 22K Change: ₹${overview.rates.gold_22k.changeAmount} (${overview.rates.gold_22k.changePercentage}%)`
  );
  console.log(
    `- Silver Change: ₹${overview.rates.silver.changeAmount} (${overview.rates.silver.changePercentage}%)`
  );

  if (overview.rates.gold_24k.changeAmount === null || overview.rates.gold_24k.changePercentage === null) {
    throw new Error('Price change calculation is missing!');
  }

  // Test 3: Unconfigured / Missing API Key Behavior
  console.log('\nTest 3: Testing Unconfigured / Missing API Key Safety...');
  delete process.env.GOLDAPI_API_KEY;
  const unconfiguredResult = await provider.getBullionPrices();
  console.log(`- Has data when key is missing: ${unconfiguredResult.hasData}`);
  console.log(`- Market status: ${unconfiguredResult.marketStatus}`);
  console.log(`- Error notice: ${unconfiguredResult.error}`);

  if (unconfiguredResult.hasData === true) {
    throw new Error('Safety failure: Provider must not return live data when key is missing!');
  }

  console.log('\nAll verification tests PASSED successfully!');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
