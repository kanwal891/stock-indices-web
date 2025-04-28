
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { StockIndex } from '../../services/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';

interface AlertFormProps {
  indices: StockIndex[];
  onSubmit: (data: {
    indexId: string;
    condition: 'above' | 'below';
    threshold: number;
  }) => Promise<void>;
  selectedIndex?: StockIndex;
}

const AlertForm: React.FC<AlertFormProps> = ({ indices, onSubmit, selectedIndex }) => {
  const [indexId, setIndexId] = useState<string>(selectedIndex?.id || '');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState<string>(selectedIndex ? selectedIndex.currentValue.toString() : '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate
      if (!indexId) {
        toast({
          title: "Error",
          description: "Please select an index",
          variant: "destructive",
        });
        return;
      }
      
      if (!threshold || isNaN(Number(threshold))) {
        toast({
          title: "Error",
          description: "Please enter a valid threshold value",
          variant: "destructive",
        });
        return;
      }
      
      await onSubmit({
        indexId,
        condition,
        threshold: parseFloat(threshold),
      });
      
      // Reset form
      if (!selectedIndex) {
        setIndexId('');
        setCondition('above');
        setThreshold('');
      }
      
      toast({
        title: "Success",
        description: "Alert created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set threshold when index changes
  const handleIndexChange = (value: string) => {
    setIndexId(value);
    const index = indices.find(i => i.id === value);
    if (index) {
      setThreshold(index.currentValue.toString());
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="index">Index</Label>
            <Select 
              value={indexId} 
              onValueChange={handleIndexChange} 
              disabled={loading || !!selectedIndex}
            >
              <SelectTrigger id="index">
                <SelectValue placeholder="Select an index" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Indices</SelectLabel>
                  {indices.map((index) => (
                    <SelectItem key={index.id} value={index.id}>
                      {index.name} ({index.symbol})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(v) => setCondition(v as 'above' | 'below')} disabled={loading}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="threshold">Threshold Value</Label>
            <Input
              id="threshold"
              type="number"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Alert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AlertForm;
