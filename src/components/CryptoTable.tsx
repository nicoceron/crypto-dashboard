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
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";

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
      className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
    >
      {children}
      <ArrowUpDown className="w-3 h-3 opacity-50" />
    </button>
  );

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-600">
              <SortButton field="market_cap_rank">#</SortButton>
            </th>
            <th className="text-left p-4 font-semibold text-gray-600">Name</th>
            <th className="text-right p-4 font-semibold text-gray-600">
              <SortButton field="current_price">Price</SortButton>
            </th>
            <th className="text-right p-4 font-semibold text-gray-600">
              <SortButton field="price_change_percentage_24h">24h %</SortButton>
            </th>
            <th className="text-right p-4 font-semibold text-gray-600">7d %</th>
            <th className="text-right p-4 font-semibold text-gray-600">
              <SortButton field="market_cap">Market Cap</SortButton>
            </th>
            <th className="text-right p-4 font-semibold text-gray-600">
              <SortButton field="total_volume">Volume (24h)</SortButton>
            </th>
            <th className="text-center p-4 font-semibold text-gray-600">
              Last 7 Days
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCryptos.map((crypto) => (
            <tr
              key={crypto.id}
              className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onCoinSelect?.(crypto)}
            >
              <td className="p-4 text-gray-600 font-medium">
                {crypto.market_cap_rank}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={crypto.image}
                    alt={crypto.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {crypto.name}
                    </div>
                    <div className="text-sm text-gray-500 uppercase">
                      {crypto.symbol}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-right font-semibold text-gray-900">
                {formatCurrency(crypto.current_price)}
              </td>
              <td
                className={`p-4 text-right font-semibold ${getChangeColor(
                  crypto.price_change_percentage_24h
                )}`}
              >
                <div className="flex items-center justify-end gap-1">
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatPercentage(crypto.price_change_percentage_24h)}
                </div>
              </td>
              <td
                className={`p-4 text-right font-semibold ${getChangeColor(
                  crypto.price_change_percentage_7d_in_currency || 0
                )}`}
              >
                {formatPercentage(
                  crypto.price_change_percentage_7d_in_currency || 0
                )}
              </td>
              <td className="p-4 text-right font-semibold text-gray-900">
                {formatNumber(crypto.market_cap)}
              </td>
              <td className="p-4 text-right font-semibold text-gray-900">
                {formatNumber(crypto.total_volume)}
              </td>
              <td className="p-4">
                <div className="flex justify-center">
                  <svg width="100" height="50" className="text-blue-500">
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={crypto.sparkline_in_7d.price
                        .map((price, index) => {
                          const x =
                            (index /
                              (crypto.sparkline_in_7d.price.length - 1)) *
                            100;
                          const minPrice = Math.min(
                            ...crypto.sparkline_in_7d.price
                          );
                          const maxPrice = Math.max(
                            ...crypto.sparkline_in_7d.price
                          );
                          const y =
                            40 -
                            ((price - minPrice) / (maxPrice - minPrice)) * 30;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  </svg>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
