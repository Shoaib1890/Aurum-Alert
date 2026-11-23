import fs from 'fs';
import path from 'path';
import { goldApiProvider } from '../src/lib/bullion/providers/goldapi';
import { telegramService } from '../src/lib/telegram/service';

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
  console.log('AURUM ALERT — 7:00 AM IST TELEGRAM DISPATCH RUNNER');
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

  // Step 2: Validate Telegram credentials unless in dry-run
  if (!isDryRun) {
    console.log('\n[2/3] Checking Telegram Bot API credentials...');
    const hasToken = Boolean(process.env.TELEGRAM_BOT_TOKEN);
    const hasChatId = Boolean(process.env.TELEGRAM_CHAT_ID);

    if (!hasToken || !hasChatId) {
      console.error('❌ Telegram credentials missing:');
      if (!hasToken) console.error('  - TELEGRAM_BOT_TOKEN is not set');
      if (!hasChatId) console.error('  - TELEGRAM_CHAT_ID is not set');
      process.exit(1);
    }

    const maskedChat = telegramService.maskChatId(process.env.TELEGRAM_CHAT_ID!);
    console.log(`✓ Telegram credentials detected. Target Chat ID: ${maskedChat}`);
  }

  // Step 3: Dispatch message
  console.log('\n[3/3] Executing Telegram notification dispatch...');
  const result = await telegramService.sendDailyAlert(overview, {
    force: isForce,
    dryRun: isDryRun,
  });

  if (result.status === 'dry_run') {
    console.log('\n✅ Dry run complete. Formatted Telegram Message Preview:');
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
    console.error('\n❌ Telegram dispatch failed:');
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }

  console.log('\n✅ Telegram notification successfully dispatched!');
  console.log(`Message ID: ${result.messageId}`);
}

main().catch((err) => {
  console.error('\n❌ Fatal error in dispatch runner:', err);
  process.exit(1);
});
