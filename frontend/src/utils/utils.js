import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  // Ajoute une ligne de date en haut
  const dateStr = new Date().toLocaleString();
  const dateRow = {
    [Object.keys(rows[0] || { Date: "" })[0]]: `Downloaded: ${dateStr}`,
  };

  // Décale les données d'une ligne vers le bas
  const rowsWithDate = [dateRow, ...rows];

  const ws = XLSX.utils.json_to_sheet(rowsWithDate, { skipHeader: true });
  // Ajoute les en-têtes à la deuxième ligne
  XLSX.utils.sheet_add_json(ws, rows, { origin: "A2", skipHeader: false });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}

/**
 * Export chart data to PDF
 * @param {Object[]} rows - Array of objects (ex: [{ "Question Type": "MCQ", "Number of Responses": 120 }, ...])
 * @param {string} title - Title for the PDF
 * @param {string} fileName - Name of the PDF file
 */
export function exportChartDataToPdf({
  rows,
  title = "Chart Data",
  fileName = "chart_data.pdf",
}) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);

  // Ajoute la date en haut à droite
  const dateStr = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(dateStr, doc.internal.pageSize.getWidth() - 14, 18, {
    align: "right",
  });

  // Get columns from keys of first row
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const data = rows.map((row) => columns.map((col) => row[col]));

  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 25,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [237, 28, 36] }, // Example: Djezzy red
  });

  doc.save(fileName);
}
