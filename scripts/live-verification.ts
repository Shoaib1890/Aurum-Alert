import fs from 'fs';
import path from 'path';

// Read .env.local manually to ensure environment variables are present in standalone runner
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  }
}

const TROY_OUNCE_IN_GRAMS = 31.1034768;

async function runLiveVerification() {
  console.log('====================================================');
  console.log('LIVE GOLDAPI.IO VERIFICATION (EXACTLY 2 CALLS)');
  console.log('====================================================\n');

  // Step 1: Verify key presence securely
  const apiKey = process.env.GOLDAPI_API_KEY;
  if (!apiKey) {
    throw new Error('GOLDAPI_API_KEY is not defined in process.env or .env.local');
  }

  const maskedKey = apiKey.slice(0, 8) + '...' + apiKey.slice(-4);
  console.log(`Step 1: GOLDAPI_API_KEY loaded successfully!`);
  console.log(`- Format check: Length is ${apiKey.length} characters`);
  console.log(`- Masked token: ${maskedKey}`);
  console.log(`- Key verified without exposing secrets.\n`);

  // Step 2 & 3: Make exactly one live request to XAU/INR and one to XAG/INR
  console.log(`Step 2: Fetching live quote from https://www.goldapi.io/api/XAU/INR...`);
  const goldRes = await fetch('https://www.goldapi.io/api/XAU/INR', {
    method: 'GET',
    headers: {
      'x-access-token': apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'Daily-Bullion-Alert/1.0',
    },
  });

  if (!goldRes.ok) {
    const errText = await goldRes.text();
    throw new Error(`XAU/INR fetch failed with HTTP ${goldRes.status}: ${errText}`);
  }
  const goldData = await goldRes.json();
  console.log('✓ Successfully received live XAU/INR response.\n');

  console.log(`Step 3: Fetching live quote from https://www.goldapi.io/api/XAG/INR...`);
  const silverRes = await fetch('https://www.goldapi.io/api/XAG/INR', {
    method: 'GET',
    headers: {
      'x-access-token': apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'Daily-Bullion-Alert/1.0',
    },
  });

  if (!silverRes.ok) {
    const errText = await silverRes.text();
    throw new Error(`XAG/INR fetch failed with HTTP ${silverRes.status}: ${errText}`);
  }
  const silverData = await silverRes.json();
  console.log('✓ Successfully received live XAG/INR response.\n');

  // Step 4: Show actual API response fields (sanitized)
  console.log('Step 4: Actual API Response Payloads (Live Data):');
  console.log('--- Gold (XAU/INR) ---');
  console.log(JSON.stringify(goldData, null, 2));
  console.log('\n--- Silver (XAG/INR) ---');
  console.log(JSON.stringify(silverData, null, 2));

  // Step 5: Verify exact silver price-per-gram field
  console.log('\nStep 5: Inspecting Silver Price Fields:');
  console.log(`- Raw silver ounce price: ₹${silverData.price}`);
  console.log(`- price_gram_24k field on silver quote: ${silverData.price_gram_24k ?? 'Not provided directly'}`);
  const silverPerGram = silverData.price_gram_24k ?? (silverData.price / TROY_OUNCE_IN_GRAMS);
  console.log(`- Calculated pure silver per gram: ₹${silverPerGram.toFixed(4)}/gram`);

  // Step 6: Verify 24K and 22K gold conversions against actual response
  console.log('\nStep 6: Gold 24K and 22K Conversions:');
  console.log(`- Actual 24K per gram: ₹${goldData.price_gram_24k}`);
  console.log(`- Actual 22K per gram (Dedicated field): ₹${goldData.price_gram_22k}`);
  
  const gold24kPer10g = Math.round(goldData.price_gram_24k * 10);
  const gold22kPer10g = Math.round(goldData.price_gram_22k * 10);
  console.log(`- Converted 24K Gold per 10 grams: ₹${gold24kPer10g.toLocaleString('en-IN')}`);
  console.log(`- Converted 22K Gold per 10 grams: ₹${gold22kPer10g.toLocaleString('en-IN')}`);

  // Step 7: Verify silver per-kilogram conversion
  console.log('\nStep 7: Silver per-kilogram Conversion:');
  const silverPerKg = Math.round(silverPerGram * 1000);
  console.log(`- Converted Silver 999 per 1 kilogram: ₹${silverPerKg.toLocaleString('en-IN')}`);

  // Step 8: Verify previous close and percentage change calculations
  console.log('\nStep 8: Previous Close & Price Change Calculations:');
  const gold24kPrevClose10g = Math.round((goldData.prev_close_price / TROY_OUNCE_IN_GRAMS) * 10);
  const gold24kDelta = gold24kPer10g - gold24kPrevClose10g;
  const gold24kPercent = Math.round(((gold24kDelta / gold24kPrevClose10g) * 100) * 100) / 100;

  const gold22kPrevClose10g = Math.round(((goldData.prev_close_price / TROY_OUNCE_IN_GRAMS) * (22 / 24)) * 10);
  const gold22kDelta = gold22kPer10g - gold22kPrevClose10g;
  const gold22kPercent = Math.round(((gold22kDelta / gold22kPrevClose10g) * 100) * 100) / 100;

  const silverPrevCloseKg = Math.round((silverData.prev_close_price / TROY_OUNCE_IN_GRAMS) * 1000);
  const silverDelta = silverPerKg - silverPrevCloseKg;
  const silverPercent = Math.round(((silverDelta / silverPrevCloseKg) * 100) * 100) / 100;

  console.log(`- 24K Gold: Current ₹${gold24kPer10g} | Prev Close ₹${gold24kPrevClose10g} | Delta ₹${gold24kDelta > 0 ? '+' : ''}${gold24kDelta} (${gold24kPercent}%)`);
  console.log(`- 22K Gold: Current ₹${gold22kPer10g} | Prev Close ₹${gold22kPrevClose10g} | Delta ₹${gold22kDelta > 0 ? '+' : ''}${gold22kDelta} (${gold22kPercent}%)`);
  console.log(`- Silver 1kg: Current ₹${silverPerKg} | Prev Close ₹${silverPrevCloseKg} | Delta ₹${silverDelta > 0 ? '+' : ''}${silverDelta} (${silverPercent}%)`);

  // Step 9: Save this live verification snapshot to local storage so /api/prices immediately has it cached
  const timestampISO = new Date(goldData.timestamp * 1000).toISOString();
  const sourceNotice = 'International Spot Prices Converted to INR (FOREX) — Not Official IBJA Domestic Physical Rates';

  const snapshot = {
    id: `snap_${Date.now()}`,
    recordedAt: new Date().toISOString(),
    rates: {
      gold_24k: {
        metalType: 'gold_24k',
        metalName: '24 Karat Fine Gold',
        purity: '99.9% Pure (International Spot in INR)',
        price: gold24kPer10g,
        currency: 'INR',
        unit: '10g',
        changeAmount: gold24kDelta,
        changePercentage: gold24kPercent,
        previousClose: gold24kPrevClose10g,
        tradingDate: timestampISO,
        source: sourceNotice,
        isAvailable: true,
        updatedAt: timestampISO,
      },
      gold_22k: {
        metalType: 'gold_22k',
        metalName: '22 Karat Standard Gold',
        purity: '91.6% Pure (916 Hallmark Standard)',
        price: gold22kPer10g,
        currency: 'INR',
        unit: '10g',
        changeAmount: gold22kDelta,
        changePercentage: gold22kPercent,
        previousClose: gold22kPrevClose10g,
        tradingDate: timestampISO,
        source: sourceNotice,
        isAvailable: true,
        updatedAt: timestampISO,
      },
      silver: {
        metalType: 'silver',
        metalName: 'Fine Silver 999',
        purity: '99.9% Pure Silver (1kg Bar Spot)',
        price: silverPerKg,
        currency: 'INR',
        unit: '1kg',
        changeAmount: silverDelta,
        changePercentage: silverPercent,
        previousClose: silverPrevCloseKg,
        tradingDate: timestampISO,
        source: sourceNotice,
        isAvailable: true,
        updatedAt: timestampISO,
      },
    },
    provider: 'GoldAPI.io (Live Spot Feed)',
    source: sourceNotice,
  };

  const dataDir = path.join(process.cwd(), '.data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'bullion_snapshots.json'), JSON.stringify([snapshot], null, 2), 'utf-8');

  console.log('\n✓ Saved live snapshot to .data/bullion_snapshots.json for /api/prices and /api/prices/history');
  console.log('\nLIVE API VERIFICATION COMPLETE.');
}

runLiveVerification().catch((err) => {
  console.error('\n❌ Live Verification Failed:', err);
  process.exit(1);
});
