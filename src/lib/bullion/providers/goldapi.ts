import { BullionOverview, BullionRate, MetalType } from '@/types/bullion';
import { GoldApiQuote, GoldApiErrorResponse } from '../types';
import { localBullionStorage } from '../storage/local-storage';

const TROY_OUNCE_IN_GRAMS = 31.1034768;
const DEFAULT_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache to strictly protect 150 reqs/month free plan
const MIN_FORCE_REFRESH_INTERVAL_MS = 60 * 1000; // 60 seconds minimum cooldown between manual refreshes

interface CachedBullionData {
  overview: BullionOverview;
  timestamp: number;
}

export class GoldApiProvider {
  private inMemoryCache: CachedBullionData | null = null;
  private lastFetchTime: number = 0;

  private getApiKey(): string | null {
    const key = process.env.GOLDAPI_API_KEY;
    if (!key || key.trim() === '' || key.includes('your-key-here')) {
      return null;
    }
    return key.trim();
  }

  /**
   * Fetches raw quote for a metal symbol (XAU or XAG) in INR
   */
  private async fetchMetalQuote(
    symbol: 'XAU' | 'XAG',
    apiKey: string
  ): Promise<{ success: boolean; data?: GoldApiQuote; error?: string; status?: number }> {
    const url = `https://www.goldapi.io/api/${symbol}/INR`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-access-token': apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'Daily-Bullion-Alert/1.0',
        },
        // We handle caching manually in the provider
        cache: 'no-store',
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errJson = (await response.json()) as GoldApiErrorResponse;
          if (errJson.error || errJson.message) {
            errorMsg = errJson.error || errJson.message || errorMsg;
          }
        } catch {
          // Response body was not JSON
        }

        if (response.status === 401) {
          errorMsg = 'Invalid or unauthorized GOLDAPI_API_KEY. Verify your API key at goldapi.io.';
        } else if (response.status === 429) {
          errorMsg = 'GoldAPI.io request limit / monthly quota reached (150 requests/month limit on Free Plan).';
        }

        return { success: false, error: errorMsg, status: response.status };
      }

      const quote = (await response.json()) as GoldApiQuote;
      return { success: true, data: quote };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown network failure';
      return { success: false, error: `Failed to connect to GoldAPI.io: ${msg}` };
    }
  }

  /**
   * Normalizes raw GoldAPI XAU and XAG quotes into our standard BullionOverview
   */
  public normalizeQuotes(gold: GoldApiQuote, silver: GoldApiQuote): BullionOverview {
    const apiTimestampISO = new Date(gold.timestamp * 1000).toISOString();

    // 1. Gold 24K (per 10 grams)
    // Extract price_gram_24k directly from API
    const gold24kPerGram =
      gold.price_gram_24k ?? (gold.price > 0 ? gold.price / TROY_OUNCE_IN_GRAMS : 0);
    const gold24kPer10g = Math.round(gold24kPerGram * 10);

    // Prev close per 10g for 24K
    const goldPrevClosePerGram = gold.prev_close_price / TROY_OUNCE_IN_GRAMS;
    const gold24kPrevClose10g = Math.round(goldPrevClosePerGram * 10);
    const gold24kChangeAmount = gold24kPer10g - gold24kPrevClose10g;
    const gold24kChangePercentage =
      gold24kPrevClose10g > 0
        ? Math.round(((gold24kChangeAmount / gold24kPrevClose10g) * 100) * 100) / 100
        : 0;

    // 2. Gold 22K (per 10 grams)
    // Requirement 5: Use API's returned price_gram_22k directly if available, do not derive silently
    const gold22kPerGram =
      gold.price_gram_22k ?? (gold24kPerGram * (22 / 24));
    const gold22kPer10g = Math.round(gold22kPerGram * 10);

    const gold22kPrevClosePerGram = goldPrevClosePerGram * (22 / 24);
    const gold22kPrevClose10g = Math.round(gold22kPrevClosePerGram * 10);
    const gold22kChangeAmount = gold22kPer10g - gold22kPrevClose10g;
    const gold22kChangePercentage =
      gold22kPrevClose10g > 0
        ? Math.round(((gold22kChangeAmount / gold22kPrevClose10g) * 100) * 100) / 100
        : 0;

    // 3. Silver 999 (per 1 kilogram = 1,000 grams)
    // Silver price is returned per troy ounce or price_gram_24k (pure silver)
    const silverPerGram =
      silver.price_gram_24k ?? (silver.price > 0 ? silver.price / TROY_OUNCE_IN_GRAMS : 0);
    const silverPerKg = Math.round(silverPerGram * 1000);

    const silverPrevClosePerGram = silver.prev_close_price / TROY_OUNCE_IN_GRAMS;
    const silverPrevClosePerKg = Math.round(silverPrevClosePerGram * 1000);
    const silverChangeAmount = silverPerKg - silverPrevClosePerKg;
    const silverChangePercentage =
      silverPrevClosePerKg > 0
        ? Math.round(((silverChangeAmount / silverPrevClosePerKg) * 100) * 100) / 100
        : 0;

    const sourceNotice =
      'International Spot Prices Converted to INR (FOREX) — Not Official IBJA Domestic Physical Rates';

    const rates: Record<MetalType, BullionRate> = {
      gold_24k: {
        metalType: 'gold_24k',
        metalName: '24 Karat Fine Gold',
        purity: '99.9% Pure (International Spot in INR)',
        price: gold24kPer10g,
        currency: 'INR',
        unit: '10g',
        changeAmount: gold24kChangeAmount,
        changePercentage: gold24kChangePercentage,
        previousClose: gold24kPrevClose10g,
        tradingDate: apiTimestampISO,
        source: sourceNotice,
        isAvailable: true,
        updatedAt: apiTimestampISO,
      },
      gold_22k: {
        metalType: 'gold_22k',
        metalName: '22 Karat Standard Gold',
        purity: '91.6% Pure (916 Hallmark Standard)',
        price: gold22kPer10g,
        currency: 'INR',
        unit: '10g',
        changeAmount: gold22kChangeAmount,
        changePercentage: gold22kChangePercentage,
        previousClose: gold22kPrevClose10g,
        tradingDate: apiTimestampISO,
        source: sourceNotice,
        isAvailable: true,
        updatedAt: apiTimestampISO,
      },
      silver: {
        metalType: 'silver',
        metalName: 'Fine Silver 999',
        purity: '99.9% Pure Silver (1kg Bar Spot)',
        price: silverPerKg,
        currency: 'INR',
        unit: '1kg',
        changeAmount: silverChangeAmount,
        changePercentage: silverChangePercentage,
        previousClose: silverPrevClosePerKg,
        tradingDate: apiTimestampISO,
        source: sourceNotice,
        isAvailable: true,
        updatedAt: apiTimestampISO,
      },
    };

    return {
      rates,
      hasData: true,
      lastSuccessfulSync: new Date().toISOString(),
      nextScheduledSync: '07:00 AM IST',
      marketStatus: 'open',
      providerName: 'GoldAPI.io (Live Spot Feed)',
      sourceNotice,
      isStale: false,
    };
  }

  /**
   * Main entrypoint: Retrieves bullion prices with intelligent caching and error fallbacks
   */
  public async getBullionPrices(forceRefresh: boolean = false): Promise<BullionOverview> {
    const now = Date.now();
    const apiKey = this.getApiKey();

    // 1. If API key is not configured, check if we have local storage fallback or return clean unconfigured state
    if (!apiKey) {
      const persisted = await localBullionStorage.getLatestSnapshot();
      if (persisted) {
        return {
          ...persisted,
          isStale: true,
          staleReason: 'GOLDAPI_API_KEY is not configured in .env.local. Showing cached data.',
          error: 'Missing GOLDAPI_API_KEY in environment variables.',
        };
      }

      return {
        rates: {
          gold_24k: {
            metalType: 'gold_24k',
            metalName: '24 Karat Fine Gold',
            purity: '99.9% Pure',
            price: null,
            currency: 'INR',
            unit: '10g',
            changeAmount: null,
            changePercentage: null,
            previousClose: null,
            tradingDate: null,
            source: 'GoldAPI.io (Awaiting API Key)',
            isAvailable: false,
          },
          gold_22k: {
            metalType: 'gold_22k',
            metalName: '22 Karat Standard Gold',
            purity: '91.6% Pure',
            price: null,
            currency: 'INR',
            unit: '10g',
            changeAmount: null,
            changePercentage: null,
            previousClose: null,
            tradingDate: null,
            source: 'GoldAPI.io (Awaiting API Key)',
            isAvailable: false,
          },
          silver: {
            metalType: 'silver',
            metalName: 'Fine Silver 999',
            purity: '99.9% Pure',
            price: null,
            currency: 'INR',
            unit: '1kg',
            changeAmount: null,
            changePercentage: null,
            previousClose: null,
            tradingDate: null,
            source: 'GoldAPI.io (Awaiting API Key)',
            isAvailable: false,
          },
        },
        hasData: false,
        lastSuccessfulSync: null,
        nextScheduledSync: '07:00 AM IST',
        marketStatus: 'awaiting_sync',
        providerName: 'GoldAPI.io',
        sourceNotice:
          'Awaiting GOLDAPI_API_KEY in .env.local. Real prices will be fetched once key is configured.',
        error: 'GOLDAPI_API_KEY is not configured. Add it to .env.local.',
      };
    }

    // 2. Cache evaluation
    const cacheAge = this.inMemoryCache ? now - this.inMemoryCache.timestamp : Infinity;
    const isCacheValid = cacheAge < DEFAULT_CACHE_TTL_MS;

    // If cache is valid and caller is not forcing refresh, return cached data
    if (this.inMemoryCache && isCacheValid && !forceRefresh) {
      return {
        ...this.inMemoryCache.overview,
        cacheInfo: {
          isCached: true,
          cacheAgeSeconds: Math.floor(cacheAge / 1000),
          ttlSeconds: Math.floor((DEFAULT_CACHE_TTL_MS - cacheAge) / 1000),
        },
      };
    }

    // If forceRefresh is requested, enforce minimum 60s cooldown to protect free quota
    if (forceRefresh && now - this.lastFetchTime < MIN_FORCE_REFRESH_INTERVAL_MS && this.inMemoryCache) {
      return {
        ...this.inMemoryCache.overview,
        staleReason: 'Refresh rate-limit: Please wait 60 seconds before forcing another API update.',
        cacheInfo: {
          isCached: true,
          cacheAgeSeconds: Math.floor(cacheAge / 1000),
          ttlSeconds: Math.floor((MIN_FORCE_REFRESH_INTERVAL_MS - (now - this.lastFetchTime)) / 1000),
        },
      };
    }

    // 3. Perform the 2 optimized external API calls in parallel (XAU and XAG)
    this.lastFetchTime = now;
    const [goldRes, silverRes] = await Promise.all([
      this.fetchMetalQuote('XAU', apiKey),
      this.fetchMetalQuote('XAG', apiKey),
    ]);

    // Handle failure of either call
    if (!goldRes.success || !goldRes.data || !silverRes.success || !silverRes.data) {
      const errorMsg = goldRes.error || silverRes.error || 'Failed to fetch bullion quotes.';
      console.warn('GoldAPI fetch warning:', errorMsg);

      // Check if we have in-memory or persisted storage to serve with stale indicator
      const fallbackOverview =
        this.inMemoryCache?.overview || (await localBullionStorage.getLatestSnapshot());

      if (fallbackOverview) {
        return {
          ...fallbackOverview,
          isStale: true,
          staleReason: `Live refresh failed (${errorMsg}). Serving last verified market data.`,
          error: errorMsg,
        };
      }

      // If no historical data exists, return empty state with the exact error message
      return {
        rates: {
          gold_24k: {
            metalType: 'gold_24k',
            metalName: '24 Karat Fine Gold',
            purity: '99.9% Pure',
            price: null,
            currency: 'INR',
            unit: '10g',
            changeAmount: null,
            changePercentage: null,
            previousClose: null,
            tradingDate: null,
            source: 'GoldAPI.io',
            isAvailable: false,
          },
          gold_22k: {
            metalType: 'gold_22k',
            metalName: '22 Karat Standard Gold',
            purity: '91.6% Pure',
            price: null,
            currency: 'INR',
            unit: '10g',
            changeAmount: null,
            changePercentage: null,
            previousClose: null,
            tradingDate: null,
            source: 'GoldAPI.io',
            isAvailable: false,
          },
          silver: {
            metalType: 'silver',
            metalName: 'Fine Silver 999',
            purity: '99.9% Pure',
            price: null,
            currency: 'INR',
            unit: '1kg',
            changeAmount: null,
            changePercentage: null,
            previousClose: null,
            tradingDate: null,
            source: 'GoldAPI.io',
            isAvailable: false,
          },
        },
        hasData: false,
        lastSuccessfulSync: null,
        nextScheduledSync: '07:00 AM IST',
        marketStatus: 'awaiting_sync',
        providerName: 'GoldAPI.io',
        sourceNotice:
          'Live connection failed. Check your API key or network connection.',
        error: errorMsg,
      };
    }

    // 4. Normalize quotes
    const overview = this.normalizeQuotes(goldRes.data, silverRes.data);

    // 5. Update in-memory cache
    this.inMemoryCache = {
      overview,
      timestamp: now,
    };

    // 6. Asynchronously persist to local file storage for historical records
    localBullionStorage.saveSnapshot(overview).catch((err) => {
      console.error('Failed to persist bullion snapshot:', err);
    });

    return {
      ...overview,
      cacheInfo: {
        isCached: false,
        cacheAgeSeconds: 0,
        ttlSeconds: Math.floor(DEFAULT_CACHE_TTL_MS / 1000),
      },
    };
  }
}

export const goldApiProvider = new GoldApiProvider();
