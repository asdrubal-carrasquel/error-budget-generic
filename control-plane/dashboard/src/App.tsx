import React, { useState, useEffect } from 'react';
import './App.css';
import ServiceStatus from './components/ServiceStatus';
import SliDisplay from './components/SliDisplay';
import ErrorBudgetChart from './components/ErrorBudgetChart';
import BurnRateDisplay from './components/BurnRateDisplay';
import SlaRiskDisplay from './components/SlaRiskDisplay';
import ConfigurationPanel from './components/ConfigurationPanel';
import { getDashboardData } from './services/api';

interface ServiceData {
  sloId: string;
  sloName: string;
  sloTarget: number;
  sliValue?: number;
  sliPercentage?: number;
  errorBudgetRemaining?: number;
  errorBudgetRemainingPercentage?: number;
  burnRate?: number;
  sloMet?: boolean;
  slaMet?: boolean;
  appliedPolicy?: string;
  error?: string;
}

interface DashboardData {
  overallStatus: string;
  services: ServiceData[];
  timestamp: string;
}

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData) {
    return <div className="App">Loading...</div>;
  }

  if (error && !dashboardData) {
    return <div className="App">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="App">No data available</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Error Budget Controller</h1>
        <div className="header-actions">
          <button onClick={() => setShowConfig(!showConfig)}>
            {showConfig ? 'Hide' : 'Show'} Configuration
          </button>
          <button onClick={loadDashboard}>Refresh</button>
        </div>
      </header>

      {showConfig && (
        <div className="config-panel">
          <ConfigurationPanel />
        </div>
      )}

      <div className="dashboard-grid">
        <div className="status-card">
          <h2>Overall Status</h2>
          <ServiceStatus status={dashboardData.overallStatus} />
        </div>

        {dashboardData.services.map((service) => (
          <div key={service.sloId} className="service-card">
            <h3>{service.sloName}</h3>
            {service.error ? (
              <div className="error">Error: {service.error}</div>
            ) : (
              <>
                <SliDisplay
                  sliValue={service.sliValue || 0}
                  sliPercentage={service.sliPercentage || 0}
                  sloTarget={service.sloTarget}
                />
                <ErrorBudgetChart
                  remaining={service.errorBudgetRemaining || 0}
                  remainingPercentage={service.errorBudgetRemainingPercentage || 0}
                />
                <BurnRateDisplay
                  burnRate={service.burnRate || 0}
                  policy={service.appliedPolicy || 'UNKNOWN'}
                />
                <SlaRiskDisplay
                  slaMet={service.slaMet}
                  sloMet={service.sloMet}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <footer className="App-footer">
        Last updated: {new Date(dashboardData.timestamp).toLocaleString()}
      </footer>
    </div>
  );
}

export default App;
