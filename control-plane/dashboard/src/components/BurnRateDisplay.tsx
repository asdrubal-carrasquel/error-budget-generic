import React from 'react';
import './BurnRateDisplay.css';

interface BurnRateDisplayProps {
  burnRate: number;
  policy: string;
}

/**
 * Burn Rate Display Component
 * 
 * SRE NOTE: Burn Rate measures how fast we're consuming Error Budget.
 * - Burn Rate > 1.0: Consuming budget faster than allocated (danger zone)
 * - Burn Rate = 1.0: Consuming at exactly the allocated rate
 * - Burn Rate < 1.0: Consuming slower than allocated (safe zone)
 */
const BurnRateDisplay: React.FC<BurnRateDisplayProps> = ({ burnRate, policy }) => {
  const isCritical = burnRate > 1.0;
  const isSafe = burnRate < 1.0;

  const getPolicyDescription = () => {
    switch (policy) {
      case 'FULL_SPEED':
        return 'Full feature velocity allowed';
      case 'LIMITED':
        return 'Reduce feature velocity, focus on reliability';
      case 'FREEZE':
        return 'Stop all non-critical deployments';
      default:
        return 'Policy: ' + policy;
    }
  };

  return (
    <div className="burn-rate-display">
      <h4>Burn Rate & Policy</h4>
      <div className="burn-rate-value">
        <span className={`value ${isCritical ? 'critical' : isSafe ? 'safe' : 'warning'}`}>
          {burnRate.toFixed(2)}x
        </span>
        <span className="description">
          {isCritical && '⚠️ Consuming faster than allocated'}
          {!isCritical && !isSafe && '⚡ Consuming at allocated rate'}
          {isSafe && '✓ Consuming slower than allocated'}
        </span>
      </div>
      <div className="policy-info">
        <strong>Applied Policy:</strong> {getPolicyDescription()}
      </div>
    </div>
  );
};

export default BurnRateDisplay;
