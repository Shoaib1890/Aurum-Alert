import { NextRequest, NextResponse } from 'next/server';
import { localBullionStorage } from '@/lib/bullion/storage/local-storage';
import { MetalType } from '@/types/bullion';

/**
 * GET /api/prices/history?metal=gold_24k&limit=30
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const metal = (searchParams.get('metal') as MetalType) || 'gold_24k';
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const history = await localBullionStorage.getHistoricalData(metal, limit);

    return NextResponse.json({
      success: true,
      metal,
      data: history,
      count: history.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        error: `Failed to retrieve historical bullion data: ${message}`,
      },
      { status: 500 }
    );
  }
}
