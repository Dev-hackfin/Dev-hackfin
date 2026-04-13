import React, { useState, useEffect } from 'react';
import { fetchAllRecords, TABLES } from '../services/airtable';
import { exportToCSV, exportToExcel } from '../services/export';
import Pagination from '../components/Pagination';

const CompanyLeads = () => {
  const [companyLeads, setCompanyLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const loadCompanyLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await fetchAllRecords(TABLES.COMPANY_LEADS);
      setCompanyLeads(records);
      setFilteredLeads(records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyLeads();
  }, []);

  // Filter leads based on search term
  useEffect(() => {
    let filtered = companyLeads;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = companyLeads.filter(record => {
        const companyName = (record.fields['Company Name'] || '').toLowerCase();
        const category = (record.fields.Category || '').toLowerCase();
        return companyName.includes(term) || category.includes(term);
      });
    }
    
    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, companyLeads]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLeads.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredLeads.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    exportToCSV(filteredLeads, 'company-leads');
  };

  const handleExportExcel = () => {
    exportToExcel(filteredLeads, 'company-leads');
  };

  if (loading) {
    return <div className="loading">Loading company leads...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button onClick={loadCompanyLeads} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Company Leads</h2>

      <div className="table-container">
        <div className="table-header">
          <div className="table-actions">
            <input
              type="text"
              className="search-input"
              placeholder="Search by Company Name or Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

        {filteredLeads.length === 0 ? (
          <div className="empty-state">
            <p>No company leads yet. Run a campaign to populate leads.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Category</th>
                  <th>Website</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.fields['Company Name'] || '-'}</td>
                    <td>{record.fields.Category || '-'}</td>
                    <td>
                      {record.fields.Website ? (
                        <a 
                          href={record.fields.Website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#3498db' }}
                        >
                          {record.fields.Website}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{record.fields['Phone Number'] || '-'}</td>
                  </tr>
                ))}
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

export default CompanyLeads;
