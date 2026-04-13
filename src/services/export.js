import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No records to export.');
    return;
  }

  // Convert Airtable records to plain objects
  const formattedData = data.map(record => {
    const obj = {};
    Object.keys(record.fields).forEach(key => {
      let value = record.fields[key];
      // Handle array fields (like attachments)
      if (Array.isArray(value)) {
        value = value.map(item => typeof item === 'object' ? item.url || item.name : item).join(', ');
      }
      obj[key] = value;
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No records to export.');
    return;
  }

  // Convert Airtable records to plain objects
  const formattedData = data.map(record => {
    const obj = {};
    Object.keys(record.fields).forEach(key => {
      let value = record.fields[key];
      // Handle array fields (like attachments)
      if (Array.isArray(value)) {
        value = value.map(item => typeof item === 'object' ? item.url || item.name : item).join(', ');
      }
      obj[key] = value;
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
