import fs from 'fs';

const rostersUpdates = JSON.parse(fs.readFileSync('./roster-updates.json', 'utf-8'));

// Group new players by team
const playersByTeam = {};
rostersUpdates.newPlayers.forEach(p => {
  if (!playersByTeam[p.fantasyTeam]) {
    playersByTeam[p.fantasyTeam] = [];
  }
  playersByTeam[p.fantasyTeam].push(p);
});

// Generate code using double quotes to avoid apostrophe issues
function generatePlayerCode(players) {
  return players.map(p => {
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

    return `  { id: '${id}', name: "${p.name}", position: '${p.position}', team: '${p.mlbTeam}', age: 25, stats: ${stats} },`;
  }).join('\n');
}

// Generate for first team (1987)
const firstTeam = '1987';
const firstTeamPlayers = playersByTeam[firstTeam];

console.log(`\n📋 Team: ${firstTeam}`);
console.log(`Players: ${firstTeamPlayers.length}\n`);
console.log(generatePlayerCode(firstTeamPlayers));

// Save for reference
fs.writeFileSync(`./players-${firstTeam}.txt`, generatePlayerCode(firstTeamPlayers));
console.log(`\n✓ Saved to players-${firstTeam}.txt`);

// Save all teams for later
for (const [team, players] of Object.entries(playersByTeam)) {
  fs.writeFileSync(`./players-${team}.txt`, generatePlayerCode(players));
}

console.log(`\n✓ Generated player code for all ${Object.keys(playersByTeam).length} teams`);
console.log('\nTeams:');
Object.entries(playersByTeam)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([team, players]) => {
    console.log(`  ${team}: ${players.length} players`);
  });
