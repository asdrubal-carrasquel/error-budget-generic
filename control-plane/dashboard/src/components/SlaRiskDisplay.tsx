import React from 'react';
import './SlaRiskDisplay.css';

interface SlaRiskDisplayProps {
  slaMet?: boolean;
  sloMet?: boolean;
}

/**
 * SLA Risk Display Component
 * 
 * SRE NOTE: This component shows SLA compliance status.
 * Remember: SLA is for business reporting, not operational decisions.
 * We use SLO and Error Budget for operational decisions.
 */
const SlaRiskDisplay: React.FC<SlaRiskDisplayProps> = ({ slaMet, sloMet }) => {
  if (slaMet === undefined) {
    return (
      <div className="sla-risk-display">
        <h4>SLA Status</h4>
        <div className="no-sla">No SLA configured</div>
      </div>
    );
  }

  return (
    <div className="sla-risk-display">
      <h4>SLA Status</h4>
      <div className={`sla-status ${slaMet ? 'met' : 'violated'}`}>
        {slaMet ? (
          <>
            <span className="status-icon">✓</span>
            <span className="status-text">SLA Compliant</span>
          </>
        ) : (
          <>
            <span className="status-icon">✗</span>
            <span className="status-text">SLA Violated - Financial Risk</span>
          </>
        )}
      </div>
      <div className="sla-note">
        <small>
          SRE NOTE: SLA violations are business problems. 
          Operational decisions should be based on SLO and Error Budget.
        </small>
      </div>
    </div>
  );
};

export default SlaRiskDisplay;
