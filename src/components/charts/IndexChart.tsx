
import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { HistoricalData } from '../../services/mockData';
import { Button } from '../ui/button';

interface IndexChartProps {
  data: HistoricalData[];
  title: string;
  className?: string;
}

const timeRanges = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
];

export const IndexChart = ({ 
  data,
  title,
  className 
}: IndexChartProps) => {
  const [selectedRange, setSelectedRange] = useState(1); // Default to 1M
  
  // Filter data based on selected time range
  const filteredData = data.slice(-timeRanges[selectedRange].days);

  // Calculate if the trend is positive (last value >= first value)
  const isPositive = filteredData.length >= 2 && 
    filteredData[filteredData.length - 1].value >= filteredData[0].value;

  // Format date for x-axis ticks
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-1">
            {timeRanges.map((range, index) => (
              <Button
                key={range.label}
                variant={selectedRange === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(index)}
                className="h-7 px-2.5"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredData}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#27AE60" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E74C3C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E74C3C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }} 
              tickFormatter={(value) => value.toLocaleString()}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickMargin={10}
            />
            <Tooltip 
              formatter={(value: number) => [
                value.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }), 
                "Value"
              ]}
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #eee',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#27AE60" : "#E74C3C"} 
              strokeWidth={2}
              fill={isPositive ? "url(#colorPositive)" : "url(#colorNegative)"} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IndexChart;
