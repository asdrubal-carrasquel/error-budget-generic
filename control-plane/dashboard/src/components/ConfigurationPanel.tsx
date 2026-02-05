import React, { useState } from 'react';
import './ConfigurationPanel.css';
import { createSli, createSlo, createSla, createPolicy } from '../services/api';

/**
 * Configuration Panel Component
 * 
 * SRE NOTE: This component allows dynamic configuration of SLIs, SLOs, SLAs, and Policies.
 * All configuration is stored in the database and applied without code changes.
 */
const ConfigurationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sli' | 'slo' | 'sla' | 'policy'>('sli');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      switch (activeTab) {
        case 'sli':
          await createSli({
            name: data.name as string,
            type: data.type as string || 'ratio',
            goodQuery: data.goodQuery as string,
            totalQuery: data.totalQuery as string,
            window: data.window as string || '30d',
          });
          setMessage('SLI created successfully');
          break;
        case 'slo':
          await createSlo({
            sliId: data.sliId as string,
            target: parseFloat(data.target as string),
            window: data.window as string || '30d',
          });
          setMessage('SLO created successfully');
          break;
        case 'sla':
          await createSla({
            sloId: data.sloId as string,
            target: parseFloat(data.target as string),
          });
          setMessage('SLA created successfully');
          break;
        case 'policy':
          await createPolicy({
            threshold: parseFloat(data.threshold as string),
            action: data.action as string,
            description: data.description as string || '',
          });
          setMessage('Policy created successfully');
          break;
      }

      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="configuration-panel">
      <div className="tabs">
        <button
          className={activeTab === 'sli' ? 'active' : ''}
          onClick={() => setActiveTab('sli')}
        >
          SLI
        </button>
        <button
          className={activeTab === 'slo' ? 'active' : ''}
          onClick={() => setActiveTab('slo')}
        >
          SLO
        </button>
        <button
          className={activeTab === 'sla' ? 'active' : ''}
          onClick={() => setActiveTab('sla')}
        >
          SLA
        </button>
        <button
          className={activeTab === 'policy' ? 'active' : ''}
          onClick={() => setActiveTab('policy')}
        >
          Policy
        </button>
      </div>

      <form onSubmit={handleSubmit} className="config-form">
        {activeTab === 'sli' && (
          <>
            <label>Name: <input name="name" required /></label>
            <label>Type: <input name="type" defaultValue="ratio" /></label>
            <label>Good Query (PromQL): <textarea name="goodQuery" required rows={3} /></label>
            <label>Total Query (PromQL): <textarea name="totalQuery" required rows={3} /></label>
            <label>Window: <input name="window" defaultValue="30d" /></label>
          </>
        )}

        {activeTab === 'slo' && (
          <>
            <label>SLI ID: <input name="sliId" required /></label>
            <label>Target (%): <input name="target" type="number" step="0.001" required /></label>
            <label>Window: <input name="window" defaultValue="30d" /></label>
          </>
        )}

        {activeTab === 'sla' && (
          <>
            <label>SLO ID: <input name="sloId" required /></label>
            <label>Target (%): <input name="target" type="number" step="0.001" required /></label>
          </>
        )}

        {activeTab === 'policy' && (
          <>
            <label>Threshold (%): <input name="threshold" type="number" step="0.01" required /></label>
            <label>Action: 
              <select name="action" required>
                <option value="FULL_SPEED">FULL_SPEED</option>
                <option value="LIMITED">LIMITED</option>
                <option value="FREEZE">FREEZE</option>
              </select>
            </label>
            <label>Description: <textarea name="description" rows={2} /></label>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>

        {message && (
          <div className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ConfigurationPanel;
