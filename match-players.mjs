import fs from 'fs';

// Load extracted players
const PLAYERS = JSON.parse(fs.readFileSync('./extracted-players.json', 'utf-8'));

// Read the raw roster data from Excel
const rostersRaw = JSON.parse(fs.readFileSync('./rosters-raw.json', 'utf-8'));

// Create a lookup map for existing players by name (normalized)
const existingPlayerMap = new Map();
PLAYERS.forEach(p => {
  const key = normalizeName(p.name);
  existingPlayerMap.set(key, p);
});

function normalizeName(name) {
  return name.toLowerCase().trim();
}

function findBestMatch(excelName, excelPosition, excelTeam) {
  const normalizedName = normalizeName(excelName);

  // Direct match
  if (existingPlayerMap.has(normalizedName)) {
    return existingPlayerMap.get(normalizedName);
  }

  // Partial match (checking if any existing player name is similar)
  for (const [key, player] of existingPlayerMap) {
    if (key.includes(normalizedName) || normalizedName.includes(key)) {
      // Additional check: position and team should match
      if (player.position === excelPosition && player.team === excelTeam) {
        return player;
      }
    }
  }

  return null;
}

const rosterUpdates = {}; // For matched players
const newPlayers = [];    // For new players
const allPlayers = new Set();
const teamedPlayers = new Set();

// Process each team's rosters
Object.entries(rostersRaw).forEach(([teamName, players]) => {
  players.forEach(p => {
    allPlayers.add(p.name);
    teamedPlayers.add(p.name);

    const match = findBestMatch(p.name, p.position, p.mlbTeam);

    if (match) {
      // Update existing player
      if (!rosterUpdates[match.id]) {
        rosterUpdates[match.id] = {
          id: match.id,
          name: match.name,
          position: match.position,
          mlbTeam: match.team,
          fantasyTeam: teamName,
          capValue: p.capValue,
          excelName: p.name,
          matchConfidence: 'direct'
        };
      }
    } else {
      // New player not in system
      newPlayers.push({
        name: p.name,
        position: p.position,
        mlbTeam: p.mlbTeam,
        fantasyTeam: teamName,
        capValue: p.capValue
      });
    }
  });
});

// Find free agents (players in PLAYERS but not in any team roster)
const freeAgents = PLAYERS.filter(p => !Object.keys(rosterUpdates).includes(p.id));

console.log('\n=== ROSTER UPDATE SUMMARY ===\n');
console.log(`Existing players to update: ${Object.keys(rosterUpdates).length}`);
console.log(`New players to add: ${newPlayers.length}`);
console.log(`Free agents (not on any team): ${freeAgents.length}`);

// Save results
fs.writeFileSync('./roster-updates.json', JSON.stringify({
  updates: rosterUpdates,
  newPlayers: newPlayers,
  freeAgents: freeAgents.map(p => ({ id: p.id, name: p.name, position: p.position, team: p.team }))
}, null, 2));

console.log('\nResults saved to roster-updates.json');

// Show sample of each
console.log('\n=== Sample Updates ===');
Object.entries(rosterUpdates).slice(0, 3).forEach(([id, update]) => {
  console.log(`${update.name} (${id}): ${update.mlbTeam} → ${update.fantasyTeam}, Cap: ${update.capValue}`);
});

if (newPlayers.length > 0) {
  console.log('\n=== Sample New Players ===');
  newPlayers.slice(0, 3).forEach(p => {
    console.log(`${p.name} (${p.position}, ${p.mlbTeam}): ${p.fantasyTeam}, Cap: ${p.capValue}`);
  });
}

if (freeAgents.length > 0) {
  console.log('\n=== Sample Free Agents ===');
  freeAgents.slice(0, 3).forEach(p => {
    console.log(`${p.name} (${p.position}, ${p.team})`);
  });
}
