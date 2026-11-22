import { NextRequest, NextResponse } from 'next/server';
import { goldApiProvider } from '@/lib/bullion/providers/goldapi';

/**
 * GET /api/prices
 * Query parameters:
 *   - refresh: boolean (e.g. ?refresh=true) to trigger a manual refresh (subject to 60s cooldown)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';

    const overview = await goldApiProvider.getBullionPrices(forceRefresh);

    return NextResponse.json({
      success: overview.hasData,
      data: overview.rates,
      overview,
      error: overview.error,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        error: `Failed to retrieve bullion prices: ${message}`,
      },
      { status: 500 }
    );
  }
}
