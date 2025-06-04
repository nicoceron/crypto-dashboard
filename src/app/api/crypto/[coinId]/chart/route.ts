import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cache } from "@/utils/cache";

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: API_KEY
    ? {
        "x-cg-demo-api-key": API_KEY,
      }
    : {},
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coinId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get("days") || "7";
    const { coinId } = await params;
    const cacheKey = `chart-${coinId}-${days}`;

    // Check cache first (shorter cache time with API key)
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Returning cached chart data for ${coinId}`);
      return NextResponse.json(cachedData);
    }

    console.log(
      `Fetching fresh chart data for ${coinId} with ${days} days using Demo API key`
    );

    // Build request parameters
    const requestParams: {
      vs_currency: string;
      days: string;
      interval?: string;
    } = {
      vs_currency: "usd",
      days: days,
    };

    // Only add interval for longer periods where it's allowed
    // For Demo API: hourly interval is only available for Enterprise plans
    // But hourly data is automatically returned for 2-90 days
    if (parseInt(days) >= 2 && parseInt(days) <= 90) {
      // Let CoinGecko automatically determine the interval for 2-90 days
      // This will give us hourly data without explicitly requesting it
    } else if (parseInt(days) > 90) {
      // For longer periods, use daily interval
      requestParams.interval = "daily";
    }
    // For 1 day, don't specify interval at all - use default

    const response = await api.get(`/coins/${coinId}/market_chart`, {
      params: requestParams,
    });

    // Cache for 2 minutes with API key
    cache.set(cacheKey, response.data, 2);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching chart data:`, error);

    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error: ${error.response?.status} - ${error.response?.statusText}`
      );
      console.error(`Response data:`, error.response?.data);

      if (error.response?.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }

      if (error.response?.status === 401) {
        return NextResponse.json(
          {
            error:
              "Invalid API key or insufficient permissions for this endpoint.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
