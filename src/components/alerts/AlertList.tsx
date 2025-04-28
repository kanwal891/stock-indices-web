
import React from 'react';
import { AlertTriangle, Bell, BellOff, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Alert } from '../../services/mockData';
import { Badge } from '../ui/badge';

interface AlertListProps {
  alerts: Alert[];
  onToggle: (alertId: string, active: boolean) => void;
  onDelete: (alertId: string) => void;
  loading?: boolean;
}

const AlertList: React.FC<AlertListProps> = ({
  alerts,
  onToggle,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="animate-pulse-slow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Your Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Your Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 space-y-2">
            <BellOff className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No alerts created yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first alert to get notifications
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Your Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.indexName}</span>
                  <Badge variant={alert.active ? "default" : "outline"}>
                    {alert.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {alert.condition === 'above' ? 'Above' : 'Below'}{' '}
                  <span className="font-medium">
                    {alert.threshold.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={alert.active}
                  onCheckedChange={(checked) => onToggle(alert.id, checked)}
                  aria-label="Toggle alert"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(alert.id)}
                  aria-label="Delete alert"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertList;
