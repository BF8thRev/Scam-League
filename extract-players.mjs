import fs from 'fs';

// Read the players.ts file
const content = fs.readFileSync('./src/data/players.ts', 'utf-8');

// Extract all player objects using regex
// This is a simplified parser for the player structure
const players = [];
const playerPattern = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*position:\s*'([^']+)',\s*team:\s*'([^']+)',\s*age:\s*(\d+),/g;

let match;
while ((match = playerPattern.exec(content)) !== null) {
  players.push({
    id: match[1],
    name: match[2],
    position: match[3],
    team: match[4],
    age: parseInt(match[5])
  });
}

console.log(`Extracted ${players.length} players`);
fs.writeFileSync('./extracted-players.json', JSON.stringify(players, null, 2));
