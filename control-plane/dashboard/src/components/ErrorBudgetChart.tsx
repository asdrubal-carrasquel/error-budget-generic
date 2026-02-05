import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './ErrorBudgetChart.css';

interface ErrorBudgetChartProps {
  remaining: number;
  remainingPercentage: number;
}

/**
 * Error Budget Chart Component
 * 
 * SRE NOTE: Error Budget is the key metric that balances reliability and velocity.
 * This chart visualizes how much Error Budget remains.
 */
const ErrorBudgetChart: React.FC<ErrorBudgetChartProps> = ({ remaining, remainingPercentage }) => {
  const consumed = 100 - remainingPercentage;
  
  const data = [
    { name: 'Remaining', value: remainingPercentage, color: '#4caf50' },
    { name: 'Consumed', value: consumed, color: '#f44336' },
  ];

  const getStatusColor = () => {
    if (remainingPercentage > 50) return '#4caf50';
    if (remainingPercentage > 10) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="error-budget-chart">
      <h4>Error Budget</h4>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="budget-info">
        <div className="budget-value" style={{ color: getStatusColor() }}>
          {remainingPercentage.toFixed(2)}% Remaining
        </div>
        <div className="budget-description">
          {remainingPercentage > 50 && '🟢 Healthy - Full velocity allowed'}
          {remainingPercentage <= 50 && remainingPercentage > 10 && '🟡 Warning - Reduce velocity'}
          {remainingPercentage <= 10 && '🔴 Critical - Freeze deployments'}
        </div>
      </div>
    </div>
  );
};

export default ErrorBudgetChart;
