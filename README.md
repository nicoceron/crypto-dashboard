# 🚀 Crypto Dashboard - Real-time Cryptocurrency Visualization

A modern, responsive cryptocurrency dashboard built with Next.js, TypeScript, and Tailwind CSS. Features real-time price updates, interactive charts, and comprehensive market data visualization.

![Crypto Dashboard Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Crypto+Dashboard)

## ✨ Features

### 📊 **Real-time Data**

- Live cryptocurrency prices with 30-second auto-refresh
- Real-time market capitalization and trading volumes
- Global market statistics and Bitcoin dominance tracking

### 📈 **Interactive Charts**

- Historical price charts with multiple timeframes (24H, 7D, 30D, 90D, 1Y)
- Switch between area and line chart types
- Detailed tooltips with price, volume, and market cap data
- Responsive design for all screen sizes

### 🔍 **Advanced Features**

- Search functionality across all cryptocurrencies
- Sortable columns (price, market cap, volume, 24h change)
- Click-to-view detailed charts for any cryptocurrency
- Sparkline mini-charts in the main table
- Market statistics cards with trend indicators

### 🎨 **Modern UI/UX**

- Clean, professional design with Tailwind CSS
- Responsive layout that works on mobile, tablet, and desktop
- Loading states and error handling
- Color-coded price changes (green/red)
- Smooth animations and transitions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **API**: CoinGecko API for cryptocurrency data
- **HTTP Client**: Axios for API requests
- **Data Fetching**: SWR for efficient data management

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crypto-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 API Integration

This dashboard uses the free tier of the CoinGecko API:

- **Endpoint**: `https://api.coingecko.com/api/v3`
- **Rate Limits**: 30 calls/minute (demo tier)
- **Data Updates**: Every 30 seconds for real-time experience

### API Features Used:

- `/coins/markets` - Top cryptocurrencies with market data
- `/coins/{id}/market_chart` - Historical price data
- `/global` - Global market statistics
- `/search/trending` - Trending cryptocurrencies

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- **Desktop**: Full-featured layout with side-by-side components
- **Tablet**: Stacked layout with optimized spacing
- **Mobile**: Single-column layout with touch-friendly interactions

## 🔧 Project Structure

```
crypto-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── CryptoTable.tsx   # Main data table
│   │   ├── PriceChart.tsx    # Interactive charts
│   │   ├── MarketStats.tsx   # Global market stats
│   │   └── LoadingSpinner.tsx# Loading component
│   ├── hooks/
│   │   └── useCryptoData.ts  # Custom data fetching hook
│   ├── services/
│   │   └── coinGeckoApi.ts   # API service layer
│   ├── types/
│   │   └── crypto.ts         # TypeScript interfaces
│   └── utils/
│       └── formatters.ts     # Utility functions
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies
```

## 🎯 Key Components

### CryptoTable

- Displays top 50 cryptocurrencies
- Sortable columns for different metrics
- Inline sparkline charts
- Click-to-view detailed charts

### PriceChart

- Interactive historical price charts
- Multiple timeframe options
- Area and line chart types
- Detailed hover tooltips

### MarketStats

- Global market capitalization
- 24h trading volume
- Bitcoin dominance percentage
- Active cryptocurrencies count

## 🚀 Performance Optimizations

- **Server-side rendering** with Next.js App Router
- **Image optimization** with Next.js Image component
- **Efficient API calls** with automatic retry and caching
- **Debounced search** to prevent excessive API calls
- **Lazy loading** for charts and heavy components

## 🎨 Customization

### Styling

- Modify `tailwind.config.ts` for custom colors and spacing
- Update component classes for different themes
- Add dark mode support by extending Tailwind configuration

### Data Refresh

- Change refresh interval in `useCryptoData.ts`
- Modify API endpoints in `coinGeckoApi.ts`
- Add new data sources or combine multiple APIs

### Features

- Add more chart types (candlestick, volume bars)
- Implement portfolio tracking
- Add price alerts and notifications
- Create comparison tools for multiple cryptocurrencies

## 🔒 Environment Variables

No environment variables required for the basic setup. The app uses CoinGecko's free public API.

For production deployment with higher rate limits, you can add:

```env
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically with zero configuration
3. Enjoy automatic deployments on every push

### Other Platforms

- **Netlify**: Deploy with `npm run build`
- **Railway**: Connect repository and deploy
- **Docker**: Use the included Dockerfile

## 📊 Features in Detail

### Real-time Updates

- Automatic data refresh every 30 seconds
- Manual refresh button for instant updates
- Loading states during data fetching
- Error handling with retry functionality

### Search & Filtering

- Real-time search across coin names and symbols
- Instant filtering without API calls
- Clear search results with count display

### Interactive Charts

- Zoom and pan functionality
- Multiple timeframe selection
- Chart type switching (area/line)
- Detailed tooltips with formatted data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) for providing excellent cryptocurrency API
- [Next.js](https://nextjs.org/) for the powerful React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for beautiful chart components
- [Lucide React](https://lucide.dev/) for clean, customizable icons

## 📞 Support

If you have any questions or need help with the project:

- Open an issue on GitHub
- Check the [documentation](docs/) for detailed guides
- Review the API documentation from CoinGecko

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
