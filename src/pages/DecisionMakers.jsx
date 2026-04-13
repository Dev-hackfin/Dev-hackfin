import React, { useState, useEffect } from 'react';
import { fetchAllRecords, TABLES } from '../services/airtable';
import { exportToCSV, exportToExcel } from '../services/export';
import Pagination from '../components/Pagination';

const DecisionMakers = () => {
  const [decisionMakers, setDecisionMakers] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [meetingFilter, setMeetingFilter] = useState('');
  
  // Expanded row state
  const [expandedRowId, setExpandedRowId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const loadDecisionMakers = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchAllRecords(TABLES.DECISION_MAKERS);
      setDecisionMakers(records);
      setFilteredRecords(records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecisionMakers();
  }, []);

  // Filter records based on status and meeting filters
  useEffect(() => {
    let filtered = decisionMakers;
    
    if (statusFilter) {
      filtered = filtered.filter(record => record.fields.Status === statusFilter);
    }
    
    if (meetingFilter) {
      filtered = filtered.filter(record => record.fields.Meeting === meetingFilter);
    }
    
    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [statusFilter, meetingFilter, decisionMakers]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    exportToCSV(filteredRecords, 'decision-makers');
  };

  const handleExportExcel = () => {
    exportToExcel(filteredRecords, 'decision-makers');
  };

  const toggleExpand = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Yes') return 'badge-yes';
    if (status === 'No') return 'badge-no';
    return '';
  };

  const getMeetingBadgeClass = (meeting) => {
    if (meeting === 'Created') return 'badge-created';
    if (meeting === 'Not Created') return 'badge-not-created';
    if (meeting === 'Cancelled') return 'badge-cancelled';
    return '';
  };

  if (loading) {
    return <div className="loading">Loading decision makers...</div>;
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
      <h2 className="page-title">Decision Makers</h2>

      <div className="table-container">
        <div className="table-header">
          <div className="filter-controls">
            <select 
              className="filter-select" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            
            <select 
              className="filter-select" 
              value={meetingFilter} 
              onChange={(e) => setMeetingFilter(e.target.value)}
            >
              <option value="">All Meeting Status</option>
              <option value="Created">Created</option>
              <option value="Not Created">Not Created</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="table-actions">
            <button onClick={handleExportCSV} className="btn btn-secondary">
              Export CSV
            </button>
            <button onClick={handleExportExcel} className="btn btn-success">
              Export Excel
            </button>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <p>No decision makers found yet.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Person Name</th>
                  <th>Email</th>
                  <th>Company Name</th>
                  <th>Type</th>
                  <th>Personalized Email Content</th>
                  <th>Status</th>
                  <th>Meeting</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(record => {
                  const emailContent = record.fields['Personalized Email Content'] || '';
                  const truncatedContent = emailContent.length > 50 
                    ? emailContent.substring(0, 50) + '...' 
                    : emailContent;
                  
                  return (
                    <React.Fragment key={record.id}>
                      <tr>
                        <td>{record.fields['Person Name'] || '-'}</td>
                        <td>{record.fields.Email || '-'}</td>
                        <td>{record.fields['Company Name'] || '-'}</td>
                        <td>{record.fields.Type || '-'}</td>
                        <td>{truncatedContent || '-'}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(record.fields.Status)}`}>
                            {record.fields.Status || '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getMeetingBadgeClass(record.fields.Meeting)}`}>
                            {record.fields.Meeting || '-'}
                          </span>
                        </td>
                        <td>
                          {emailContent && (
                            <button 
                              onClick={() => toggleExpand(record.id)} 
                              className="expand-btn"
                            >
                              {expandedRowId === record.id ? 'Collapse' : 'Expand'}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedRowId === record.id && emailContent && (
                        <tr>
                          <td colSpan="8" className="expandable-row">
                            <strong>Full Email Content:</strong>
                            <div style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                              {emailContent}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DecisionMakers;
