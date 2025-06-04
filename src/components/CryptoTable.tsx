"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CryptoCurrency } from "@/types/crypto";
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  getChangeColor,
} from "@/utils/formatters";
import { TrendingUp, TrendingDown, ArrowUpDown, Star } from "lucide-react";

interface CryptoTableProps {
  cryptos: CryptoCurrency[];
  onCoinSelect?: (coin: CryptoCurrency) => void;
}

type SortField =
  | "market_cap_rank"
  | "current_price"
  | "price_change_percentage_24h"
  | "market_cap"
  | "total_volume";
type SortDirection = "asc" | "desc";

export const CryptoTable: React.FC<CryptoTableProps> = ({
  cryptos,
  onCoinSelect,
}) => {
  const [sortField, setSortField] = useState<SortField>("market_cap_rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCryptos = [...cryptos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (aValue === null) aValue = 0;
    if (bValue === null) bValue = 0;

    const multiplier = sortDirection === "asc" ? 1 : -1;
    return (aValue - bValue) * multiplier;
  });

  const SortButton: React.FC<{
    field: SortField;
    children: React.ReactNode;
  }> = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="group flex items-center gap-2 hover:bg-white/60 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-gray-700 hover:text-blue-600"
    >
      {children}
      <ArrowUpDown
        className={`w-3 h-3 transition-colors ${
          sortField === field
            ? "text-blue-600"
            : "text-gray-400 group-hover:text-blue-500"
        }`}
      />
    </button>
  );

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Star className="w-4 h-4 text-yellow-500 fill-current" />;
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-100">
          <tr>
            <th className="text-left p-4">
              <SortButton field="market_cap_rank">Rank</SortButton>
            </th>
            <th className="text-left p-4 font-semibold text-gray-700">Name</th>
            <th className="text-right p-4">
              <SortButton field="current_price">Price</SortButton>
            </th>
            <th className="text-right p-4">
              <SortButton field="price_change_percentage_24h">
                24h Change
              </SortButton>
            </th>
            <th className="text-right p-4 hidden sm:table-cell">7d Change</th>
            <th className="text-right p-4">
              <SortButton field="market_cap">Market Cap</SortButton>
            </th>
            <th className="text-right p-4 hidden lg:table-cell">
              <SortButton field="total_volume">Volume (24h)</SortButton>
            </th>
            <th className="text-center p-4 hidden xl:table-cell">Trend (7d)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedCryptos.map((crypto) => (
            <tr
              key={crypto.id}
              className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 cursor-pointer border-b border-gray-50"
              onClick={() => onCoinSelect?.(crypto)}
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(crypto.market_cap_rank)}
                  <span className="text-gray-600 font-bold text-sm">
                    #{crypto.market_cap_rank}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      width={40}
                      height={40}
                      className="rounded-full shadow-md ring-2 ring-white group-hover:ring-blue-200 transition-all duration-200"
                    />
                    {crypto.market_cap_rank <= 10 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">★</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200 truncate">
                      {crypto.name}
                    </div>
                    <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                      {crypto.symbol}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right">
                <div className="font-bold text-gray-900 text-lg">
                  {formatCurrency(crypto.current_price)}
                </div>
              </td>
              <td className="p-4 text-right">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                    crypto.price_change_percentage_24h >= 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentage(crypto.price_change_percentage_24h)}
                </div>
              </td>
              <td className="p-4 text-right hidden sm:table-cell">
                <span
                  className={`font-semibold ${getChangeColor(
                    crypto.price_change_percentage_7d_in_currency || 0
                  )}`}
                >
                  {formatPercentage(
                    crypto.price_change_percentage_7d_in_currency || 0
                  )}
                </span>
              </td>
              <td className="p-4 text-right">
                <div className="font-bold text-gray-900">
                  {formatNumber(crypto.market_cap)}
                </div>
              </td>
              <td className="p-4 text-right hidden lg:table-cell">
                <div className="font-semibold text-gray-700">
                  {formatNumber(crypto.total_volume)}
                </div>
              </td>
              <td className="p-4 hidden xl:table-cell">
                <div className="flex justify-center">
                  <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <svg width="80" height="32" className="text-blue-500">
                      <defs>
                        <linearGradient
                          id={`gradient-${crypto.id}`}
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="currentColor"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="currentColor"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        fill={`url(#gradient-${crypto.id})`}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={crypto.sparkline_in_7d.price
                          .map((price, index) => {
                            const x =
                              (index /
                                (crypto.sparkline_in_7d.price.length - 1)) *
                              80;
                            const minPrice = Math.min(
                              ...crypto.sparkline_in_7d.price
                            );
                            const maxPrice = Math.max(
                              ...crypto.sparkline_in_7d.price
                            );
                            const y =
                              28 -
                              ((price - minPrice) / (maxPrice - minPrice)) * 24;
                            return `${index === 0 ? "M" : "L"} ${x},${y}`;
                          })
                          .join(" ")}
                      />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
