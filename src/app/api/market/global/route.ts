import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const cacheKey = "global-market-data";

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached global market data");
      return NextResponse.json(cachedData);
    }

    console.log("Fetching fresh global market data with Demo API key");
    const response = await api.get("/global");

    // Cache for 1 minute with API key
    cache.set(cacheKey, response.data, 1);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching global market data:", error);

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
      { error: "Failed to fetch global market data" },
      { status: 500 }
    );
  }
}
