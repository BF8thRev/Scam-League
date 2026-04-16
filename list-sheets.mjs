import ExcelJS from 'exceljs';

async function listSheets() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('C:\\Users\\bryan\\Downloads\\Scam league rosters.xlsx');

  console.log('Sheets:', workbook.sheetnames);
  console.log('Total sheets:', workbook.worksheets.length);

  workbook.worksheets.forEach((ws, idx) => {
    console.log(`\nSheet ${idx}: "${ws.name}"`);
    console.log(`  Rows: ${ws.rowCount}, Cols: ${ws.columnCount}`);

    // Log first few rows with values
    for (let i = 1; i <= Math.min(3, ws.rowCount); i++) {
      const row = ws.getRow(i);
      const values = [];
      row.eachCell((cell) => {
        values.push(cell.value);
      });
      console.log(`  Row ${i}:`, values);
    }
  });
}

listSheets().catch(console.error);
