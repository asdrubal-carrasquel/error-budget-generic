import React from 'react';
import './ServiceStatus.css';

interface ServiceStatusProps {
  status: string;
}

/**
 * Service Status Component
 * 
 * SRE NOTE: This component displays the overall service status:
 * - 🟢 GREEN: All SLOs met, Error Budget > 50%
 * - 🟡 YELLOW: SLOs met but Error Budget < 50%, or some SLOs not met
 * - 🔴 RED: Critical Error Budget (< 10%) or SLO violations
 */
const ServiceStatus: React.FC<ServiceStatusProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case '🟢':
        return 'Healthy';
      case '🟡':
        return 'Warning';
      case '🔴':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`service-status status-${status}`}>
      <div className="status-indicator">{status}</div>
      <div className="status-text">{getStatusText()}</div>
    </div>
  );
};

export default ServiceStatus;
