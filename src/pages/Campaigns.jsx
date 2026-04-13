import React, { useState, useEffect } from 'react';
import { fetchAllRecords, createRecord, updateRecord, TABLES } from '../services/airtable';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    companyName: '',
    location: '',
    numberOfLeads: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchAllRecords(TABLES.ROLE);
      setCampaigns(records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const validateForm = (data) => {
    const errors = {};
    if (!data.companyName?.trim()) {
      errors.companyName = 'Company Name is required';
    }
    if (!data.location?.trim()) {
      errors.location = 'Location is required';
    }
    if (!data.numberOfLeads || data.numberOfLeads <= 0) {
      errors.numberOfLeads = 'Number of Leads must be greater than 0';
    }
    return errors;
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const errors = validateForm(newCampaign);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await createRecord(TABLES.ROLE, {
        'Company Name': newCampaign.companyName,
        'Location': newCampaign.location,
        'Number of Leads': parseInt(newCampaign.numberOfLeads),
        'Status': 'Run'
      });
      
      setNewCampaign({ companyName: '', location: '', numberOfLeads: '' });
      setFormErrors({});
      loadCampaigns();
    } catch (err) {
      setError('Failed to create campaign: ' + err.message);
    }
  };

  const handleEditStart = (record) => {
    setEditingId(record.id);
    setEditData({
      companyName: record.fields['Company Name'] || '',
      location: record.fields['Location'] || '',
      numberOfLeads: record.fields['Number of Leads'] || ''
    });
  };

  const handleEditSave = async (recordId) => {
    const errors = validateForm(editData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!window.confirm('Are you sure you want to save these changes?')) {
      return;
    }

    try {
      await updateRecord(TABLES.ROLE, recordId, {
        'Company Name': editData.companyName,
        'Location': editData.location,
        'Number of Leads': parseInt(editData.numberOfLeads)
      });
      
      setEditingId(null);
      setEditData({});
      setFormErrors({});
      loadCampaigns();
    } catch (err) {
      setError('Failed to update campaign: ' + err.message);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditData({});
    setFormErrors({});
  };

  const handleMarkAsDone = async (recordId) => {
    if (!window.confirm('Are you sure you want to mark this campaign as Done?')) {
      return;
    }

    try {
      await updateRecord(TABLES.ROLE, recordId, {
        'Status': 'Done'
      });
      loadCampaigns();
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading campaigns...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button onClick={loadCampaigns} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  const activeRuns = campaigns.filter(c => c.fields.Status === 'Run');

  return (
    <div>
      <h2 className="page-title">Campaign Configuration</h2>

      {/* New Run Form */}
      <div className="form-container">
        <h3 style={{ marginBottom: '1rem' }}>Start New Lead Generation Run</h3>
        <form onSubmit={handleCreateCampaign}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={newCampaign.companyName}
              onChange={(e) => setNewCampaign({ ...newCampaign, companyName: e.target.value })}
              placeholder="Enter company name"
            />
            {formErrors.companyName && (
              <div className="error-message">{formErrors.companyName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={newCampaign.location}
              onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
              placeholder="Enter location"
            />
            {formErrors.location && (
              <div className="error-message">{formErrors.location}</div>
            )}
          </div>

          <div className="form-group">
            <label>Number of Leads</label>
            <input
              type="number"
              value={newCampaign.numberOfLeads}
              onChange={(e) => setNewCampaign({ ...newCampaign, numberOfLeads: e.target.value })}
              placeholder="Enter number of leads"
              min="1"
            />
            {formErrors.numberOfLeads && (
              <div className="error-message">{formErrors.numberOfLeads}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Start Lead Generation Run
          </button>
        </form>
      </div>

      {/* Existing Runs List */}
      <div className="table-container">
        <div className="table-header">
          <h3>Existing Campaigns</h3>
        </div>
        
        {activeRuns.length === 0 ? (
          <div className="empty-state">
            <p>No active runs found. Start a new campaign above.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Location</th>
                <th>Number of Leads</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeRuns.map(record => (
                <React.Fragment key={record.id}>
                  <tr>
                    <td>
                      {editingId === record.id ? (
                        <input
                          type="text"
                          value={editData.companyName}
                          onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        record.fields['Company Name']
                      )}
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <input
                          type="text"
                          value={editData.location}
                          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          style={{ width: '100%' }}
                        />
                      ) : (
                        record.fields['Location']
                      )}
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <input
                          type="number"
                          value={editData.numberOfLeads}
                          onChange={(e) => setEditData({ ...editData, numberOfLeads: e.target.value })}
                          style={{ width: '80px' }}
                        />
                      ) : (
                        record.fields['Number of Leads']
                      )}
                    </td>
                    <td>
                      <span className={`badge ${record.fields.Status === 'Run' ? 'badge-run' : 'badge-done'}`}>
                        {record.fields.Status}
                      </span>
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <>
                          <button 
                            onClick={() => handleEditSave(record.id)} 
                            className="btn btn-success"
                            style={{ marginRight: '0.5rem' }}
                          >
                            Save
                          </button>
                          <button onClick={handleEditCancel} className="btn btn-secondary">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEditStart(record)} 
                            className="btn btn-warning"
                            style={{ marginRight: '0.5rem' }}
                          >
                            Edit
                          </button>
                          {record.fields.Status === 'Run' && (
                            <button 
                              onClick={() => handleMarkAsDone(record.id)} 
                              className="btn btn-success"
                            >
                              Mark as Done
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                  {formErrors.companyName || formErrors.location || formErrors.numberOfLeads ? (
                    <tr>
                      <td colSpan="5">
                        <div className="error-message">
                          {formErrors.companyName && <span>{formErrors.companyName} </span>}
                          {formErrors.location && <span>{formErrors.location} </span>}
                          {formErrors.numberOfLeads && <span>{formErrors.numberOfLeads}</span>}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
