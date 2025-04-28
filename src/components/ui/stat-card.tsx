
import React from 'react';
import { Card, CardContent } from './card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  change,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {change && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  change.isPositive ? "text-positive" : "text-negative"
                )}>
                  {change.isPositive ? '+' : ''}{change.value.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
