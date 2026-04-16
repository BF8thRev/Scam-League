import ExcelJS from 'exceljs';

async function debugRosters() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('C:\\Users\\bryan\\Downloads\\Scam league rosters.xlsx');

  workbook.eachSheet((sheet, sheetIndex) => {
    if (sheetIndex > 0) return; // Only check first sheet

    console.log(`Sheet: ${sheet.name}`);
    console.log(`Dimensions: ${sheet.dimensions}`);

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber <= 5) { // First 5 rows
        console.log(`\nRow ${rowNumber}:`);
        row.eachCell((cell, colNumber) => {
          console.log(`  Col ${colNumber}: value="${cell.value}" type=${typeof cell.value}`);
        });
      }
    });
  });
}

debugRosters().catch(console.error);
