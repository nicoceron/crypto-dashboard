"use client";

import React, { useState } from "react";
import { RefreshCw, Search, BarChart3 } from "lucide-react";
import { CryptoTable } from "@/components/CryptoTable";
import { PriceChart } from "@/components/PriceChart";
import { MarketStats } from "@/components/MarketStats";
import { useCryptoData } from "@/hooks/useCryptoData";
import { CryptoCurrency } from "@/types/crypto";

export default function Dashboard() {
  const { cryptos, loading, error, refreshData } = useCryptoData(50, 60000);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 mb-4 lg:mb-0">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Crypto Dashboard
                </h1>
                <p className="text-gray-600">
                  Real-time cryptocurrency market data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
                />
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Stats */}
        <MarketStats />

        {/* Selected Coin Chart */}
        {selectedCoin && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}) Chart
              </h2>
              <button
                onClick={() => setSelectedCoin(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕ Close Chart
              </button>
            </div>
            <PriceChart
              coinId={selectedCoin.id}
              coinName={selectedCoin.name}
              days={7}
            />
          </div>
        )}

        {/* Crypto Table */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Cryptocurrency Prices
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {searchTerm
                    ? `Found ${filteredCryptos.length} results`
                    : `Showing top ${cryptos.length} cryptocurrencies`}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live updates every minute</span>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 font-semibold mb-2">
                Error loading data
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="p-8">
              <div className="animate-pulse">
                <div className="grid grid-cols-8 gap-4 mb-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-8 gap-4 mb-4">
                    {[...Array(8)].map((_, j) => (
                      <div key={j} className="h-8 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <CryptoTable
              cryptos={filteredCryptos}
              onCoinSelect={setSelectedCoin}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Data provided by CoinGecko API • Updates every minute</p>
          <p className="mt-2">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
