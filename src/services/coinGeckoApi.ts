import axios from "axios";
import { CryptoCurrency, HistoricalPrice, CoinDetails } from "@/types/crypto";

// Use internal Next.js API routes to avoid CORS issues
const api = axios.create({
  timeout: 15000,
});

export const coinGeckoApi = {
  // Get top cryptocurrencies with market data
  async getTopCryptos(limit: number = 100): Promise<CryptoCurrency[]> {
    try {
      const response = await api.get(`/api/crypto?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching top cryptos:", error);
      throw error;
    }
  },

  // Get specific coin details (keeping direct call for now, can be moved to API route if needed)
  async getCoinDetails(coinId: string): Promise<CoinDetails> {
    try {
      const response = await api.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching coin details for ${coinId}:`, error);
      throw error;
    }
  },

  // Get historical price data
  async getHistoricalPrices(
    coinId: string,
    days: number = 7
  ): Promise<HistoricalPrice> {
    try {
      const response = await api.get(
        `/api/crypto/${coinId}/chart?days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical prices for ${coinId}:`, error);
      throw error;
    }
  },

  // Get trending coins (keeping direct call for now)
  async getTrendingCoins() {
    try {
      const response = await api.get(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      throw error;
    }
  },

  // Get global market data
  async getGlobalMarketData() {
    try {
      const response = await api.get("/api/market/global");
      return response.data;
    } catch (error) {
      console.error("Error fetching global market data:", error);
      throw error;
    }
  },
};
