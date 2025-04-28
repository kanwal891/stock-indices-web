
import React, { useState, useEffect } from 'react';
import { fetchIndices, fetchUserAlerts, updateAlert, deleteAlert, createAlert } from '../services/apiService';
import { Alert, StockIndex } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Card } from '../components/ui/card';
import AlertList from '../components/alerts/AlertList';
import AlertForm from '../components/alerts/AlertForm';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [indices, setIndices] = useState<StockIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch indices for the form
        const indicesData = await fetchIndices();
        setIndices(indicesData);
        
        // If authenticated, fetch user alerts
        if (isAuthenticated && user) {
          const alertsData = await fetchUserAlerts(user.id);
          setAlerts(alertsData);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user, toast]);

  const handleToggleAlert = async (alertId: string, active: boolean) => {
    try {
      await updateAlert(alertId, { active });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, active } : alert
      ));
      
      toast({
        title: 'Success',
        description: `Alert ${active ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update alert',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      
      toast({
        title: 'Success',
        description: 'Alert deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        variant: 'destructive',
      });
    }
  };

  const handleCreateAlert = async (data: { indexId: string; condition: 'above' | 'below'; threshold: number }) => {
    if (!user) return;
    
    try {
      const index = indices.find(i => i.id === data.indexId);
      if (!index) return;
      
      const newAlert = await createAlert({
        userId: user.id,
        indexId: data.indexId,
        indexSymbol: index.symbol,
        indexName: index.name,
        threshold: data.threshold,
        condition: data.condition,
        active: true,
      });
      
      setAlerts([...alerts, newAlert]);
      
      toast({
        title: 'Success',
        description: 'Alert created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create alert',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Card className="max-w-md p-6 text-center space-y-4">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">
            You need to be logged in to view and manage alerts.
          </p>
          <Button asChild>
            <Link to="/auth/login">Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Price Alerts</h1>
        <p className="text-muted-foreground">
          Set up and manage your index price alerts
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <AlertList
            alerts={alerts}
            onToggle={handleToggleAlert}
            onDelete={handleDeleteAlert}
            loading={loading}
          />
        </div>
        
        <div className="order-1 lg:order-2">
          <AlertForm
            indices={indices}
            onSubmit={handleCreateAlert}
          />
        </div>
      </div>
    </div>
  );
};

export default Alerts;
