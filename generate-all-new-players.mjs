import fs from 'fs';

const rostersUpdates = JSON.parse(fs.readFileSync('./roster-updates.json', 'utf-8'));

// Generate TypeScript code for new players
const newPlayers = rostersUpdates.newPlayers;

// Create player objects with minimal stats (placeholder stats for calculation)
const playerCode = newPlayers.map(p => {
  const id = p.name.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '');

  const isBatter = ['C', '1B', '2B', '3B', 'SS', 'OF', 'DH'].includes(p.position);

  const stats = isBatter
    ? '{ singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 }'
    : '{ w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 }';

  // Escape single quotes in names using double backslash
  const escapedName = p.name.replace(/'/g, "\\'" );
  return `  { id: '${id}', name: '${escapedName}', position: '${p.position}', team: '${p.mlbTeam}', age: 25, stats: ${stats} },`;
}).join('\n');

console.log(`// Generated ${newPlayers.length} new players from Excel rosters\n`);
console.log(playerCode);
console.log('\n');

// Save the generated code to a file for reference
fs.writeFileSync('./new-players-code.txt', playerCode);
console.log(`✓ Generated code saved to new-players-code.txt`);
