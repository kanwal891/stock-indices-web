
import React, { useState, useEffect } from 'react';
import { fetchIndices } from '../services/apiService';
import { StockIndex } from '../services/mockData';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import IndexCard from '../components/ui/index-card';
import { useToast } from '../hooks/use-toast';

const Indices = () => {
  const [indices, setIndices] = useState<StockIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const indicesData = await fetchIndices();
        setIndices(indicesData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch indices data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Filter indices based on search term and current tab
  const filteredIndices = indices.filter(index => {
    const matchesSearch = 
      index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      index.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'gainers') return matchesSearch && index.change > 0;
    if (currentTab === 'losers') return matchesSearch && index.change < 0;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Stock Indices</h1>
        <p className="text-muted-foreground">
          Browse and track global market indices
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search indices..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="gainers">Gainers</TabsTrigger>
            <TabsTrigger value="losers">Losers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Indices List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentTab === 'all' ? 'All Indices' : 
             currentTab === 'gainers' ? 'Gainers' : 'Losers'}
            {searchTerm && ` - Search: "${searchTerm}"`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-32 bg-muted animate-pulse-slow rounded-md"></div>
              ))}
            </div>
          ) : filteredIndices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndices.map((index) => (
                <IndexCard
                  key={index.id}
                  id={index.id}
                  symbol={index.symbol}
                  name={index.name}
                  currentValue={index.currentValue}
                  change={index.change}
                  changePercent={index.changePercent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No indices found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Indices;
