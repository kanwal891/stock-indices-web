import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { fetchApiStats } from '../services/apiService';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '../components/ui/progress';
import { Info } from 'lucide-react';

const Settings = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const { data: apiStats, isLoading } = useQuery({
    queryKey: ['apiStats'],
    queryFn: fetchApiStats,
  });

  // Format reset date
  const formatResetDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculate usage percentage
  const usagePercentage = apiStats ? Math.round((apiStats.usedCalls / apiStats.limitCalls) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthenticated ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="pt-2">
                  <Button variant="destructive" onClick={logout}>
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">You are not logged in</p>
                <Button className="mt-2" asChild>
                  <a href="/auth/login">Log In</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Usage */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : apiStats ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{apiStats.usedCalls} / {apiStats.limitCalls} calls</span>
                  </div>
                  <Progress value={usagePercentage} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Plan Resets On</p>
                  <p className="font-medium">{formatResetDate(apiStats.resetDate)}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Info className="h-4 w-4 mr-2" />
                <span>API statistics unavailable</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Information */}
      <Card>
        <CardHeader>
          <CardTitle>About This Application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>This application allows you to track stock indices and set price alerts. Currently using mock data for demonstration purposes.</p>
            
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">Demo Mode</p>
              <p className="text-sm text-muted-foreground mt-1">
                This is a demo version with simulated data. In a production version, this would connect to a real financial data API like Finnhub or Polygon.io.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
