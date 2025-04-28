
import React from 'react';
import { Card, CardContent } from './card';
import { cn } from '../../lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IndexCardProps {
  id: string;
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  changePercent: number;
  className?: string;
}

export const IndexCard = ({
  id,
  symbol,
  name,
  currentValue,
  change,
  changePercent,
  className,
}: IndexCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Link to={`/indices/${id}`}>
      <Card className={cn("overflow-hidden hover:shadow-md transition-shadow cursor-pointer", className)}>
        <CardContent className="p-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-muted p-2 rounded">
                  <span className="font-mono font-bold">{symbol}</span>
                </div>
                <span className="font-medium">{name}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-end">
              <div>
                <p className="text-xl font-bold">
                  {currentValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              
              <div className={cn(
                "flex flex-col items-end",
                isPositive ? "text-positive" : "text-negative"
              )}>
                <div className="flex items-center">
                  {isPositive ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <span className="font-semibold">{Math.abs(changePercent).toFixed(2)}%</span>
                </div>
                <span className="text-sm">
                  {isPositive ? '+' : ''}{change.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default IndexCard;
