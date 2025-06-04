"use client";

import React, { useState } from "react";
import { RefreshCw, Search, BarChart3, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-6 lg:mb-0">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  CryptoDash Pro
                </h1>
                <p className="text-gray-600 font-medium">
                  Real-time cryptocurrency market intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/90 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 w-full lg:w-80 text-gray-900 placeholder-gray-500 font-medium shadow-lg backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="relative flex items-center gap-2">
                  <RefreshCw
                    className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </div>
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
                  Chart
                </h2>
              </div>
              <button
                onClick={() => setSelectedCoin(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
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
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Live Cryptocurrency Prices
                  </h2>
                </div>
                <p className="text-gray-600 font-medium">
                  {searchTerm
                    ? `Found ${filteredCryptos.length} results for "${searchTerm}"`
                    : `Showing top ${cryptos.length} cryptocurrencies by market cap`}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">
                    Live updates every minute
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-red-100 rounded-xl mb-4">
                  <div className="text-red-600 font-bold text-lg mb-2">
                    Unable to load data
                  </div>
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="p-12">
              <div className="animate-pulse">
                <div className="grid grid-cols-8 gap-4 mb-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"
                    ></div>
                  ))}
                </div>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-8 gap-4 mb-4">
                    {[...Array(8)].map((_, j) => (
                      <div
                        key={j}
                        className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"
                      ></div>
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
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-lg rounded-full shadow-lg border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-gray-700">
              Data powered by CoinGecko API • Updates every minute
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium">
            Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
