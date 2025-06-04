import { useState, useEffect } from "react";
import { CryptoCurrency } from "@/types/crypto";
import { coinGeckoApi } from "@/services/coinGeckoApi";

interface UseCryptoDataReturn {
  cryptos: CryptoCurrency[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useCryptoData = (
  limit: number = 50,
  refreshInterval: number = 30000
): UseCryptoDataReturn => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await coinGeckoApi.getTopCryptos(limit);
      setCryptos(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch cryptocurrency data"
      );
      console.error("Error fetching crypto data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();

    // Set up interval for real-time updates
    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [limit, refreshInterval]);

  return {
    cryptos,
    loading,
    error,
    refreshData,
  };
};
