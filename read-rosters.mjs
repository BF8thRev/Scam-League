import ExcelJS from 'exceljs';
import fs from 'fs';

async function readRosters() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(process.argv[2] || 'C:\\Users\\bryan\\Downloads\\Scam league rosters.xlsx');

  const allTeams = {};

  // Process each sheet (team)
  workbook.worksheets.forEach(sheet => {
    const teamName = sheet.name;
    const players = [];

    // Data starts at row 4 (row 3 is headers)
    // Columns are: B=Position, C=Player Info, D=Cap Value
    for (let rowNum = 4; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);
      const pos = row.getCell(2).value;     // Column B
      const playerInfo = row.getCell(3).value;  // Column C
      const capValue = row.getCell(4).value;   // Column D

      if (playerInfo && pos) {
        // Parse player info: "Player Name Position | TEAM"
        // Format: "Name POSITION | TEAM" e.g. "Salvador Perez C | KC"
        const playerStr = String(playerInfo).trim();
        const match = playerStr.match(/^(.+?)\s+([A-Z]{2})\s*\|\s*(\w+)$/);
        if (match) {
          const rawName = match[1];
          const mlbTeam = match[3];
          const position = String(pos).trim();

          // Remove position from end of name if present
          let playerName = rawName.trim();
          const posMatch = playerName.match(/\s+(C|1B|2B|3B|SS|OF|SP|RP|DH)$/);
          if (posMatch && posMatch[1] === position) {
            playerName = playerName.substring(0, playerName.length - posMatch[0].length);
          }

          players.push({
            name: playerName.trim(),
            position: position,
            mlbTeam: mlbTeam.trim(),
            capValue: typeof capValue === 'number' ? capValue : parseInt(capValue) || 0,
            fantasyTeam: teamName
          });
        }
      }
    }

    if (players.length > 0) {
      allTeams[teamName] = players;
    }
  });

  // Output as JSON
  console.log(JSON.stringify(allTeams, null, 2));
}

readRosters().catch(console.error);
