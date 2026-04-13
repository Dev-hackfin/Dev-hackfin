import axios from 'axios';

// Use environment variable if available, otherwise use a demo placeholder
// NOTE: The placeholder will not fetch real data. Replace with your actual key from 
// https://airtable.com/create/tokens to connect to real Airtable data.
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'keyDemoPreviewModeOnly';
const BASE_ID = 'app1Ctf5UsDa2Ukxl';

const api = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Fetch all records with pagination support
export const fetchAllRecords = async (tableName) => {
  const allRecords = [];
  let offset = null;
  
  do {
    try {
      const params = offset ? { offset } : {};
      const response = await api.get(`/${tableName}`, { params });
      
      if (response.data.records) {
        allRecords.push(...response.data.records);
      }
      
      offset = response.data.offset;
    } catch (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      throw new Error(`Failed to fetch data from ${tableName}: ${error.message}`);
    }
  } while (offset);
  
  return allRecords;
};

// Create a new record
export const createRecord = async (tableName, fields) => {
  try {
    const response = await api.post(`/${tableName}`, {
      fields
    });
    return response.data;
  } catch (error) {
    console.error(`Error creating record in ${tableName}:`, error);
    throw new Error(`Failed to create record: ${error.message}`);
  }
};

// Update a record
export const updateRecord = async (tableName, recordId, fields) => {
  try {
    const response = await api.patch(`/${tableName}/${recordId}`, {
      fields
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating record in ${tableName}:`, error);
    throw new Error(`Failed to update record: ${error.message}`);
  }
};

// Table name mappings
export const TABLES = {
  COMPANY_LEADS: 'tblzdOiL8ylQXATje',
  DECISION_MAKERS: 'tbl9GD3EjWddWF3ci',
  ROLE: 'tbldAg7DDd0wzrinm'
};
