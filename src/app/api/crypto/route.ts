import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cache } from "@/utils/cache";

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: API_KEY
    ? {
        "x-cg-demo-api-key": API_KEY,
      }
    : {},
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const cacheKey = `crypto-markets-${limit}`;

    // With API key, we can be less aggressive with caching
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Returning cached data for ${cacheKey}`);
      return NextResponse.json(cachedData);
    }

    console.log(`Fetching fresh data for ${cacheKey} with Demo API key`);
    const response = await api.get("/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: limit,
        page: 1,
        sparkline: true,
        price_change_percentage: "7d",
      },
    });

    // Cache for 1 minute with API key (can be more frequent)
    cache.set(cacheKey, response.data, 1);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching crypto data:", error);

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
          { error: "Invalid API key. Please check your CoinGecko API key." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch cryptocurrency data" },
      { status: 500 }
    );
  }
}
