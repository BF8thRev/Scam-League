import ExcelJS from 'exceljs';

async function debug() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('C:\\Users\\bryan\\Downloads\\Scam league rosters.xlsx');

  workbook.worksheets.forEach((sheet, idx) => {
    console.log(`\n=== Sheet ${idx}: "${sheet.name}" ===`);

    let playerCount = 0;
    for (let rowNum = 4; rowNum <= Math.min(sheet.rowCount, 10); rowNum++) {
      const row = sheet.getRow(rowNum);
      const pos = row.getCell(1).value;
      const playerInfo = row.getCell(2).value;
      const capValue = row.getCell(3).value;

      if (playerInfo) {
        playerCount++;
        const playerStr = String(playerInfo).trim();
        const match = playerStr.match(/^(.+?)\s+([A-Z]{2})\s*\|\s*(\w+)$/);
        console.log(`  Row ${rowNum}: "${playerStr.substring(0, 50)}..." Pos=${pos} Cap=${capValue} Match=${match ? 'YES' : 'NO'}`);
      }
    }
    console.log(`  Total rows with data: ${playerCount}`);
  });
}

debug().catch(console.error);
