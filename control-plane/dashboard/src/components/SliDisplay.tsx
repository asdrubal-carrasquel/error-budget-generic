import React from 'react';
import './SliDisplay.css';

interface SliDisplayProps {
  sliValue: number;
  sliPercentage: number;
  sloTarget: number;
}

/**
 * SLI Display Component
 * 
 * SRE NOTE: Displays current SLI value compared to SLO target.
 * SLI is the measured service quality, SLO is the target.
 */
const SliDisplay: React.FC<SliDisplayProps> = ({ sliValue, sliPercentage, sloTarget }) => {
  const isMet = sliPercentage >= sloTarget;
  const difference = sliPercentage - sloTarget;

  return (
    <div className="sli-display">
      <h4>SLI (Service Level Indicator)</h4>
      <div className="sli-value">
        <span className="value">{sliPercentage.toFixed(3)}%</span>
        <span className={`target ${isMet ? 'met' : 'not-met'}`}>
          Target: {sloTarget}%
        </span>
      </div>
      <div className="sli-status">
        {isMet ? (
          <span className="status-met">✓ SLO Met</span>
        ) : (
          <span className="status-not-met">
            ✗ SLO Not Met ({difference > 0 ? '+' : ''}{difference.toFixed(3)}%)
          </span>
        )}
      </div>
    </div>
  );
};

export default SliDisplay;
