import React, { useState, useEffect } from 'react';
import { fetchAllRecords, TABLES } from '../services/airtable';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalCompanyLeads: 0,
    totalDecisionMakers: 0,
    emailsSent: 0,
    pendingOutreach: 0,
    meetingsCreated: 0,
    meetingConversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all company leads
      const companyLeads = await fetchAllRecords(TABLES.COMPANY_LEADS);
      
      // Fetch all decision makers
      const decisionMakers = await fetchAllRecords(TABLES.DECISION_MAKERS);
      
      // Calculate metrics
      const totalCompanyLeads = companyLeads.length;
      const totalDecisionMakers = decisionMakers.length;
      
      const emailsSent = decisionMakers.filter(
        record => record.fields.Status === 'Yes'
      ).length;
      
      const pendingOutreach = decisionMakers.filter(
        record => record.fields.Status === 'No'
      ).length;
      
      const meetingsCreated = decisionMakers.filter(
        record => record.fields.Meeting === 'Created'
      ).length;
      
      const meetingConversionRate = emailsSent > 0 
        ? ((meetingsCreated / emailsSent) * 100).toFixed(2)
        : 0;

      setMetrics({
        totalCompanyLeads,
        totalDecisionMakers,
        emailsSent,
        pendingOutreach,
        meetingsCreated,
        meetingConversionRate
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return <div className="loading">Loading metrics...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading metrics: {error}</p>
        <button onClick={loadMetrics} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Summary Dashboard</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={loadMetrics} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.totalCompanyLeads}</div>
          <div className="metric-label">Total Company Leads</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{metrics.totalDecisionMakers}</div>
          <div className="metric-label">Total Decision Makers</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{metrics.emailsSent}</div>
          <div className="metric-label">Emails Sent</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{metrics.pendingOutreach}</div>
          <div className="metric-label">Pending Outreach</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{metrics.meetingsCreated}</div>
          <div className="metric-label">Meetings Created</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{metrics.meetingConversionRate}%</div>
          <div className="metric-label">Meeting Conversion Rate</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
