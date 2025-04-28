
import React, { useState, useEffect } from 'react';
import { fetchIndices, fetchHistoricalData } from '../services/apiService';
import { StockIndex, HistoricalData } from '../services/mockData';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { StatCard } from '../components/ui/stat-card';
import IndexChart from '../components/charts/IndexChart';
import IndexCard from '../components/ui/index-card';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const [indices, setIndices] = useState<StockIndex[]>([]);
  const [sp500Data, setSp500Data] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const indicesData = await fetchIndices();
        setIndices(indicesData);
        
        // Fetch S&P 500 historical data for the main chart
        const sp500Historical = await fetchHistoricalData('sp500', 180);
        setSp500Data(sp500Historical);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch market data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Calculate market summary
  const marketSummary = {
    totalIndices: indices.length,
    gainers: indices.filter(i => i.change > 0).length,
    losers: indices.filter(i => i.change < 0).length,
  };
  
  // Find major movers
  const sortedByChange = [...indices].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  const topMovers = sortedByChange.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Market Dashboard</h1>
        <p className="text-muted-foreground">
          Track and monitor stock indices in real-time
        </p>
      </div>

      {/* Market Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Indices"
          value={marketSummary.totalIndices}
          icon={<BarChart2 className="h-5 w-5" />}
        />
        <StatCard
          title="Gainers Today"
          value={marketSummary.gainers}
          icon={<TrendingUp className="h-5 w-5 text-positive" />}
          change={{ value: (marketSummary.gainers / marketSummary.totalIndices) * 100, isPositive: true }}
        />
        <StatCard
          title="Losers Today"
          value={marketSummary.losers}
          icon={<TrendingDown className="h-5 w-5 text-negative" />}
          change={{ value: (marketSummary.losers / marketSummary.totalIndices) * 100, isPositive: false }}
        />
      </div>

      {/* Main Chart */}
      <IndexChart data={sp500Data} title="S&P 500" />

      {/* Major Movers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Movers Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <>
                <div className="h-32 bg-muted animate-pulse-slow rounded-md"></div>
                <div className="h-32 bg-muted animate-pulse-slow rounded-md"></div>
                <div className="h-32 bg-muted animate-pulse-slow rounded-md"></div>
              </>
            ) : (
              topMovers.map((index) => (
                <IndexCard
                  key={index.id}
                  id={index.id}
                  symbol={index.symbol}
                  name={index.name}
                  currentValue={index.currentValue}
                  change={index.change}
                  changePercent={index.changePercent}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
