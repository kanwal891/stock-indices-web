
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchIndexById, fetchHistoricalData, createAlert } from '../services/apiService';
import { StockIndex, HistoricalData } from '../services/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

const IndexDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [index, setIndex] = useState<StockIndex | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const indexData = await fetchIndexById(id);
      if (indexData) {
        setIndex(indexData);
        const historical = await fetchHistoricalData(id, 30); // Fetch 30 days
        setHistoricalData(historical);
      }
    };
    
    fetchData();
  }, [id]);

  const handleCreateAlert = async () => {
    if (!isAuthenticated || !user || !index) return;

    try {
      const threshold = prompt("Enter threshold value:");
      if (!threshold) return;
      
      const condition = window.confirm("Press OK for 'above' threshold, Cancel for 'below'") ? 'above' : 'below';
      
      await createAlert({
        userId: user.id,
        indexId: index.id,
        indexSymbol: index.symbol,
        indexName: index.name,
        threshold: parseFloat(threshold),
        condition,
        active: true,
      });
      
      alert("Alert created successfully");
    } catch (error) {
      alert("Failed to create alert");
    }
  };

  if (!index) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div>
        <Link to="/indices">&larr; Back to Indices</Link>
      </div>
      
      <div className="mt-4">
        <h1>{index.name} ({index.symbol})</h1>
        <p>Current Value: {index.currentValue}</p>
        <p>Change: {index.change} ({index.changePercent}%)</p>
      </div>

      <div className="mt-4">
        <h2>Historical Data (30 days)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <LineChart data={historicalData} width={800} height={300}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>

      {isAuthenticated ? (
        <button 
          onClick={handleCreateAlert}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Set Price Alert
        </button>
      ) : (
        <Link to="/auth/login" className="mt-4 block">
          Login to set alerts
        </Link>
      )}
    </div>
  );
};

export default IndexDetail;
