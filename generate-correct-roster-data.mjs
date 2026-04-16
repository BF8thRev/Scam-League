import fs from 'fs';

const rosterUpdates = JSON.parse(fs.readFileSync('./roster-updates.json', 'utf-8'));

const rosterData = {};

// Add existing players with updated teams and cap values
Object.entries(rosterUpdates.updates).forEach(([id, update]) => {
  rosterData[id] = {
    fantasyTeam: update.fantasyTeam,
    capValue: update.capValue
  };
});

// Add new players (they're already matched to teams in the data)
rosterUpdates.newPlayers.forEach(p => {
  const id = p.name.toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]/g, '');

  rosterData[id] = {
    fantasyTeam: p.fantasyTeam,
    capValue: p.capValue
  };
});

// Don't add free agents - they shouldn't have fantasyTeam set

console.log('Roster data summary:');
const teams = {};
Object.values(rosterData).forEach(entry => {
  const team = entry.fantasyTeam;
  teams[team] = (teams[team] || 0) + 1;
});

Object.entries(teams).sort().forEach(([team, count]) => {
  console.log(`  ${team}: ${count} players`);
});

console.log(`\nTotal roster entries: ${Object.keys(rosterData).length}`);

fs.writeFileSync('./correct-roster-data.json', JSON.stringify(rosterData, null, 2));
console.log('✓ Saved to correct-roster-data.json');
