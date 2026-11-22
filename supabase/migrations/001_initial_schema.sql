-- ==============================================================================
-- DAILY BULLION ALERT: Supabase PostgreSQL Schema
-- Migration 001: Initial Tables for Bullion Spot Rates, Logs & Notifications
-- ==============================================================================

-- 1. Daily Bullion Benchmark Spot Rates (National India Benchmarks)
CREATE TABLE IF NOT EXISTS bullion_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal_type VARCHAR(20) NOT NULL CHECK (metal_type IN ('gold_24k', 'gold_22k', 'silver')),
    price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    unit VARCHAR(10) NOT NULL CHECK (unit IN ('10g', '1kg')),
    change_amount NUMERIC(12, 2) DEFAULT 0.00,
    change_percentage NUMERIC(6, 2) DEFAULT 0.00,
    previous_close NUMERIC(12, 2),
    trading_date DATE NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT 'IBJA Benchmark (Ex-GST/Making)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(metal_type, trading_date)
);

CREATE INDEX IF NOT EXISTS idx_bullion_prices_lookup 
ON bullion_prices(metal_type, trading_date DESC);

-- 2. API Sync Ingestion Audit Logs
CREATE TABLE IF NOT EXISTS api_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'running')),
    provider VARCHAR(50) NOT NULL,
    records_synced INT DEFAULT 0,
    error_message TEXT,
    response_latency_ms INT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

-- 3. WhatsApp Notification Dispatch Logs (Cloud-triggered 7:00 AM IST)
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
    recipient_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'disabled')),
    message_sid VARCHAR(100),
    prices_summary JSONB,
    scheduled_time TIMESTAMPTZ NOT NULL,
    dispatched_at TIMESTAMPTZ,
    error_message TEXT
);

-- Comments for documentation
COMMENT ON TABLE bullion_prices IS 'Daily India-wide benchmark spot prices for 24K Gold (10g), 22K Gold (10g), and Silver (1kg). Excludes local GST and retail making charges.';
COMMENT ON TABLE api_sync_logs IS 'Tracks automated price sync runs from configured financial bullion providers.';
COMMENT ON TABLE notification_logs IS 'Audit log of automated 7:00 AM IST WhatsApp notifications.';
