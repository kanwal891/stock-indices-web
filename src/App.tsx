
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth pages

// Main pages
import {TooltipProvider} from "@radix-ui/react-tooltip";
import RouteWrapper from "./components/layout/RouteWrapper.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Indices from "./pages/Indices.tsx";
import IndexDetail from "./pages/IndexDetail.tsx";
import Alerts from "./pages/Alerts.tsx";
import {Settings} from "lucide-react";
import NotFound from "./pages/NotFound.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Main Routes */}
            <Route path="/" element={<RouteWrapper><Dashboard /></RouteWrapper>} />
            <Route path="/indices" element={<RouteWrapper><Indices /></RouteWrapper>} />
            <Route path="/indices/:id" element={<RouteWrapper><IndexDetail /></RouteWrapper>} />
            
            {/* Protected Routes */}
            <Route 
              path="/alerts" 
              element={
                <RouteWrapper>
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                </RouteWrapper>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <RouteWrapper>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </RouteWrapper>
              } 
            />
            
            {/* Not Found */}
            <Route path="*" element={<RouteWrapper><NotFound /></RouteWrapper>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
