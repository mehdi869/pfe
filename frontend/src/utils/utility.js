import * as XLSX from "xlsx";
/**
 * Store chart data in localStorage
 * @param {string} key
 * @param {any} data
 */
export const storeChartData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Error storing chart data:", err);
  }
};

/**
 * Retrieve chart data from localStorage
 * @param {string} key
 * @returns {any|null}
 */
export const getStoredChartData = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Error reading chart data:", err);
    return null;
  }
};

/**
 * Export data to Excel
 * @param {Object[]} rows - Array of objects to export (each object is a row)
 * @param {string} sheetName - Name of the Excel sheet
 * @param {string} fileName - Name of the Excel file
 */
export function exportToExcel({
  rows,
  sheetName = "Sheet1",
  fileName = "data.xlsx",
}) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}
