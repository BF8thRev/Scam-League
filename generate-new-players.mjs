import fs from 'fs';

const rostersUpdates = JSON.parse(fs.readFileSync('./roster-updates.json', 'utf-8'));

// Generate TypeScript code for new players
const newPlayers = rostersUpdates.newPlayers;

// Create player objects with minimal stats (placeholder stats for calculation)
const playerCode = newPlayers.map(p => {
  const id = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isBatter = ['C', '1B', '2B', '3B', 'SS', 'OF', 'DH'].includes(p.position);

  const stats = isBatter
    ? '{ singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 }'
    : '{ w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 }';

  return `  {
    id: '${id}', name: '${p.name}', position: '${p.position}', team: '${p.mlbTeam}', age: 25,
    stats: ${stats},
  },`;
}).join('\n');

console.log('New players to add to PLAYERS array:\n');
console.log(playerCode);

// Also generate the roster data
const rosterData = {};

// Add updates for existing players
Object.entries(rostersUpdates.updates).forEach(([id, update]) => {
  rosterData[id] = {
    fantasyTeam: update.fantasyTeam,
    capValue: update.capValue
  };
});

// Add new players
newPlayers.forEach(p => {
  const id = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  rosterData[id] = {
    fantasyTeam: p.fantasyTeam,
    capValue: p.capValue
  };
});

// Free agents should be marked with fantasyTeam: undefined (will default to no team)
rostersUpdates.freeAgents.forEach(p => {
  rosterData[p.id] = {
    fantasyTeam: 'Free Agent',
    capValue: undefined
  };
});

fs.writeFileSync('./final-roster-data.json', JSON.stringify(rosterData, null, 2));
console.log('\n\nFinal roster data saved to final-roster-data.json');
console.log(`Total entries: ${Object.keys(rosterData).length}`);
