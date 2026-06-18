import * as XLSX from 'xlsx';

interface Column {
  header: string;
  field: string;
}

// Define an interface for the data items
interface DataItem {
  [key: string]: string | number | boolean | null | undefined;
}

export const ExportToExcel = (data: DataItem[], columns: Column[], fileName: string): void => {
  // Filter columns to exclude "Actions"
  const filteredColumns = columns.filter(col => col.header !== "Actions");

  const dataWithHeaders = data.map(row => {
    const newRow: { [key: string]: string | number | boolean | null | undefined } = {};
    filteredColumns.forEach(column => {
      newRow[column.header] = row[column.field];
    });
    return newRow;
  });

  // Create the worksheet without initial data
  const ws = XLSX.utils.aoa_to_sheet([
    [fileName.replace('.xlsx', '')], // Título en la primera fila sin la extensión .xlsx
    filteredColumns.map(col => col.header) // Encabezados en la segunda fila
  ]);

  // Add the data from the third row
  XLSX.utils.sheet_add_json(ws, dataWithHeaders, {
    origin: 'A3',
    skipHeader: true
  });

  // Apply bold format to the title and headers
  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  // Format for the title (first row)
  const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
  if (ws[titleCell]) {
    ws[titleCell].s = { 
      font: { bold: true, size: 14 },
      alignment: { horizontal: 'center' }
    };
  }

  // Format for the headers (second row)
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    const headerCell = XLSX.utils.encode_cell({ r: 1, c: col });
    if (ws[headerCell]) {
      ws[headerCell].s = { 
        font: { bold: true },
        alignment: { horizontal: 'center' }
      };
    }
  }

  // Adjust the column widths automatically
  const colWidths = [];
  for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    let maxLength = 0;
    for (let row = headerRange.s.r; row <= headerRange.e.r; row++) {
      const cell = XLSX.utils.encode_cell({ r: row, c: col });
      if (ws[cell] && ws[cell].v) {
        const length = ws[cell].v.toString().length;
        maxLength = Math.max(maxLength, length);
      }
    }
    colWidths[col] = maxLength + 2;
  }
  ws['!cols'] = colWidths.map(width => ({ width }));

  // Merge cells for the title
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headerRange.e.c } }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");

  XLSX.writeFile(wb, fileName);
};