
export interface StockIndex {
  id: string;
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  changePercent: number;
  previousClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
}

export interface HistoricalData {
  date: string;
  value: number;
}

export interface Alert {
  id: string;
  userId: string;
  indexId: string;
  indexSymbol: string;
  indexName: string;
  threshold: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: string;
}

export const mockIndices: StockIndex[] = [
  {
    id: "sp500",
    symbol: "^GSPC",
    name: "S&P 500",
    currentValue: 5123.27,
    change: 28.14,
    changePercent: 0.55,
    previousClose: 5095.13,
    openPrice: 5095.00,
    dayHigh: 5130.47,
    dayLow: 5088.19,
    volume: 2574350000,
  },
  {
    id: "dow",
    symbol: "^DJI",
    name: "Dow Jones Industrial Average",
    currentValue: 38245.75,
    change: -15.94,
    changePercent: -0.04,
    previousClose: 38261.69,
    openPrice: 38262.00,
    dayHigh: 38341.97,
    dayLow: 38085.70,
    volume: 354520000,
  },
  {
    id: "nasdaq",
    symbol: "^IXIC",
    name: "NASDAQ Composite",
    currentValue: 16315.75,
    change: 183.02,
    changePercent: 1.13,
    previousClose: 16132.73,
    openPrice: 16133.00,
    dayHigh: 16321.94,
    dayLow: 16101.12,
    volume: 4982560000,
  },
  {
    id: "russell2000",
    symbol: "^RUT",
    name: "Russell 2000",
    currentValue: 2026.41,
    change: 7.21,
    changePercent: 0.36,
    previousClose: 2019.20,
    openPrice: 2019.00,
    dayHigh: 2030.54,
    dayLow: 2011.26,
    volume: 892480000,
  },
  {
    id: "ftse100",
    symbol: "^FTSE",
    name: "FTSE 100",
    currentValue: 8143.80,
    change: -17.47,
    changePercent: -0.21,
    previousClose: 8161.27,
    openPrice: 8161.00,
    dayHigh: 8172.36,
    dayLow: 8122.98,
    volume: 621540000,
  },
  {
    id: "dax",
    symbol: "^GDAXI",
    name: "DAX",
    currentValue: 17826.32,
    change: 98.75,
    changePercent: 0.56,
    previousClose: 17727.57,
    openPrice: 17727.60,
    dayHigh: 17848.54,
    dayLow: 17701.23,
    volume: 548760000,
  },
];

export const generateHistoricalData = (days: number, volatility: number, trend: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  let previousValue = mockIndices[0].currentValue - (trend * days);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some random variation plus the trend
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendChange = trend;
    previousValue = previousValue + randomChange + trendChange;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(previousValue.toFixed(2)),
    });
  }
  
  return data;
};

// Generate mock alerts
export const generateMockAlerts = (): Alert[] => {
  return [
    {
      id: "1",
      userId: "user1",
      indexId: "sp500",
      indexSymbol: "^GSPC",
      indexName: "S&P 500",
      threshold: 5200,
      condition: "above",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      userId: "user1",
      indexId: "nasdaq",
      indexSymbol: "^IXIC",
      indexName: "NASDAQ Composite",
      threshold: 16000,
      condition: "below",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ];
};

// Mock API statistics
export interface ApiStats {
  usedCalls: number;
  limitCalls: number;
  resetDate: string;
}

export const mockApiStats: ApiStats = {
  usedCalls: 482,
  limitCalls: 1000,
  resetDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
};
