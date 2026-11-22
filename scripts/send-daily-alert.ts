import fs from 'fs';
import path from 'path';
import { goldApiProvider } from '../src/lib/bullion/providers/goldapi';
import { whatsAppService } from '../src/lib/whatsapp/service';

// In local execution, load .env.local if present
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  }
}

async function main() {
  console.log('====================================================');
  console.log('AURUM ALERT — 7:00 AM IST DAILY DISPATCH RUNNER');
  console.log('====================================================');
  console.log(`Execution Time: ${new Date().toISOString()} (UTC)`);

  const args = process.argv.slice(2);
  const isForce = args.includes('--force');
  const isDryRun = args.includes('--dry-run');

  if (isDryRun) {
    console.log('Mode: DRY RUN (Testing message format without API dispatch)');
  }
  if (isForce) {
    console.log('Mode: FORCE DISPATCH (Bypassing same-day deduplication check)');
  }

  // Step 1: Retrieve latest bullion prices via GoldAPI provider
  console.log('\n[1/3] Fetching latest bullion benchmark prices...');
  const overview = await goldApiProvider.getBullionPrices(false);

  if (!overview.hasData) {
    console.error('❌ Failed to retrieve bullion rates:', overview.error);
    process.exit(1);
  }

  console.log('✓ Successfully retrieved bullion prices:');
  console.log(`  • 24K Gold (10g): ₹${overview.rates.gold_24k.price?.toLocaleString('en-IN')}`);
  console.log(`  • 22K Gold (10g): ₹${overview.rates.gold_22k.price?.toLocaleString('en-IN')}`);
  console.log(`  • Silver (1kg): ₹${overview.rates.silver.price?.toLocaleString('en-IN')}`);

  // Step 2: Validate Meta credentials unless in dry-run
  if (!isDryRun) {
    console.log('\n[2/3] Checking Meta WhatsApp Cloud API credentials...');
    const hasToken = Boolean(process.env.WHATSAPP_API_TOKEN);
    const hasPhoneId = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID);
    const hasRecipient = Boolean(process.env.WHATSAPP_RECIPIENT_PHONE);

    if (!hasToken || !hasPhoneId || !hasRecipient) {
      console.error('❌ Meta WhatsApp credentials missing:');
      if (!hasToken) console.error('  - WHATSAPP_API_TOKEN is not set');
      if (!hasPhoneId) console.error('  - WHATSAPP_PHONE_NUMBER_ID is not set');
      if (!hasRecipient) console.error('  - WHATSAPP_RECIPIENT_PHONE is not set');
      process.exit(1);
    }

    const maskedPhone = whatsAppService.maskPhoneNumber(process.env.WHATSAPP_RECIPIENT_PHONE!);
    console.log(`✓ Meta credentials detected. Target recipient: ${maskedPhone}`);
  }

  // Step 3: Dispatch message
  console.log('\n[3/3] Executing WhatsApp notification dispatch...');
  const result = await whatsAppService.sendDailyAlert(overview, {
    force: isForce,
    dryRun: isDryRun,
  });

  if (result.status === 'dry_run') {
    console.log('\n✅ Dry run complete. Formatted WhatsApp Message Preview:');
    console.log('----------------------------------------------------');
    console.log(result.preview);
    console.log('----------------------------------------------------');
    return;
  }

  if (result.status === 'skipped_duplicate') {
    console.log('\n⚠️ Dispatch Skipped: An alert has already been sent for today in IST.');
    console.log(`Detail: ${result.error}`);
    return;
  }

  if (!result.success) {
    console.error('\n❌ WhatsApp dispatch failed:');
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }

  console.log('\n✅ WhatsApp notification successfully dispatched!');
  console.log(`Message SID: ${result.messageId}`);
}

main().catch((err) => {
  console.error('\n❌ Fatal error in dispatch runner:', err);
  process.exit(1);
});
