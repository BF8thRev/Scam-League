import fs from 'fs';

// Read the generated new players code exactly as-is
const newPlayersCode = fs.readFileSync('./new-players-code.txt', 'utf-8').trim();

// Read the current players file
let content = fs.readFileSync('./src/data/players.ts', 'utf-8');

// Remove the closing bracket and semicolon
content = content.replace(/]\;\s*$/, '');

// Append new players and closing bracket
const updated = content + '\n' + newPlayersCode + '\n];\n';

// Write back
fs.writeFileSync('./src/data/players.ts', updated);

const playerCount = newPlayersCode.split('\n').filter(line => line.includes('id:')).length;
console.log(`✓ Safely appended ${playerCount} new players to src/data/players.ts`);
