import fs from 'fs';

// Read the generated new players code
const newPlayersCode = fs.readFileSync('./new-players-code.txt', 'utf-8');

// Read the current players file
let content = fs.readFileSync('./src/data/players.ts', 'utf-8');

// Remove the closing bracket and semicolon
content = content.replace(/\];\s*$/m, '');

// Add the new players (the generated code doesn't have a leading newline, so add it)
const updated = content + '\n' + newPlayersCode + '\n];\n';

// Write back
fs.writeFileSync('./src/data/players.ts', updated);

const playerCount = newPlayersCode.split('\n').filter(line => line.includes('id:')).length;
console.log(`✓ Added ${playerCount} new players to src/data/players.ts`);
console.log(`  New file size: ${updated.length} bytes`);
