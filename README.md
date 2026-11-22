# Aurum Alert (Daily Bullion Alert)

Aurum Alert is a real-time bullion rate tracking and alert platform built with Next.js, TypeScript, and Tailwind CSS. It monitors live precious metals benchmarks (24K Gold, 22K Gold, 18K Gold, Silver) and dispatches automated notifications across channels like Telegram, WhatsApp, and SMS.

## Features

- **Live Bullion Benchmark Tracking**: Gold (24K, 22K, 18K) and Silver prices with historical snapshots.
- **Automated Dispatch**: Multi-channel notifications via Telegram Bot, TextBee (SMS/WhatsApp), and custom providers.
- **Modern Dashboard UI**: Interactive charts, metric cards, and responsive design with dark mode styling.
- **Supabase Integration**: Persistent subscriber management and price snapshot storage.
- **Verification Scripts**: Built-in CLI testing scripts to simulate and verify alerts and provider responses.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and populate the required API keys and configuration:

```bash
cp .env.example .env.local
```

Key environment configurations:
- `NEXT_PUBLIC_APP_URL`
- `GOLD_API_KEY`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- `TEXTBEE_API_KEY`, `TEXTBEE_DEVICE_ID`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## License

MIT
