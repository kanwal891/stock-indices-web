
import { 
  StockIndex, 
  HistoricalData, 
  Alert,
  ApiStats, 
  mockIndices, 
  generateHistoricalData,
  generateMockAlerts,
  mockApiStats
} from './mockData';

// Simulate API calls with small delays to mimic real-world behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchIndices = async (): Promise<StockIndex[]> => {
  await delay(500);
  return [...mockIndices];
};

export const fetchIndexById = async (id: string): Promise<StockIndex | undefined> => {
  await delay(300);
  return mockIndices.find(index => index.id === id);
};

export const fetchHistoricalData = async (indexId: string, days: number = 30): Promise<HistoricalData[]> => {
  await delay(800);
  
  // Different volatility and trend for different indices
  let volatility = 20;
  let trend = 1;
  
  switch(indexId) {
    case 'sp500':
      volatility = 15;
      trend = 0.8;
      break;
    case 'nasdaq':
      volatility = 25;
      trend = 1.2;
      break;
    case 'dow':
      volatility = 10;
      trend = 0.5;
      break;
    case 'russell2000':
      volatility = 18;
      trend = -0.3;
      break;
    case 'ftse100':
      volatility = 12;
      trend = 0.1;
      break;
    case 'dax':
      volatility = 15;
      trend = 0.4;
      break;
  }
  
  return generateHistoricalData(days, volatility, trend);
};

export const fetchUserAlerts = async (userId: string): Promise<Alert[]> => {
  await delay(400);
  return generateMockAlerts();
};

export const createAlert = async (alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> => {
  await delay(600);
  
  const newAlert: Alert = {
    ...alert,
    id: `alert_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  return newAlert;
};

export const updateAlert = async (alertId: string, updates: Partial<Alert>): Promise<Alert> => {
  await delay(400);
  
  const alerts = generateMockAlerts();
  const alertIndex = alerts.findIndex(a => a.id === alertId);
  
  if (alertIndex === -1) {
    throw new Error('Alert not found');
  }
  
  const updatedAlert = {
    ...alerts[alertIndex],
    ...updates
  };
  
  return updatedAlert;
};

export const deleteAlert = async (alertId: string): Promise<void> => {
  await delay(300);
  // In a real app, this would delete the alert from the backend
};

export const fetchApiStats = async (): Promise<ApiStats> => {
  await delay(200);
  return {...mockApiStats};
};
