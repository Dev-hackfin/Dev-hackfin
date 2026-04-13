import React, { useState, useEffect } from 'react';
import { fetchAllRecords, TABLES } from '../services/airtable';

const OutreachStatus = () => {
  const [decisionMakers, setDecisionMakers] = useState([]);
  const [pendingOutreach, setPendingOutreach] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDecisionMakers = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchAllRecords(TABLES.DECISION_MAKERS);
      setDecisionMakers(records);
      
      // Filter for Status = No (pending outreach)
      const pending = records.filter(record => record.fields.Status === 'No');
      setPendingOutreach(pending);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecisionMakers();
  }, []);

  const getMeetingBadgeClass = (meeting) => {
    if (meeting === 'Created') return 'badge-created';
    if (meeting === 'Not Created') return 'badge-not-created';
    if (meeting === 'Cancelled') return 'badge-cancelled';
    return '';
  };

  if (loading) {
    return <div className="loading">Loading outreach status...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button onClick={loadDecisionMakers} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Outreach Status</h2>

      <div className="table-container">
        <div className="table-header">
          <h3>Email Campaign Overview - Pending Outreach</h3>
        </div>

        {pendingOutreach.length === 0 ? (
          <div className="empty-state">
            <p>No pending outreach records found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Person Name</th>
                <th>Email</th>
                <th>Company Name</th>
                <th>Personalized Email Content</th>
                <th>Meeting Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingOutreach.map(record => {
                const emailContent = record.fields['Personalized Email Content'] || '';
                const truncatedContent = emailContent.length > 100 
                  ? emailContent.substring(0, 100) + '...' 
                  : emailContent;
                
                return (
                  <tr key={record.id}>
                    <td>{record.fields['Person Name'] || '-'}</td>
                    <td>{record.fields.Email || '-'}</td>
                    <td>{record.fields['Company Name'] || '-'}</td>
                    <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {truncatedContent || '-'}
                    </td>
                    <td>
                      <span className={`badge ${getMeetingBadgeClass(record.fields.Meeting)}`}>
                        {record.fields.Meeting || '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OutreachStatus;
