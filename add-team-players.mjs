import fs from 'fs';

const team = process.argv[2] || '1987';
const playerCode = fs.readFileSync(`./players-${team}.txt`, 'utf-8').trim();

// Read current players file
let content = fs.readFileSync('./src/data/players.ts', 'utf-8');

// Remove closing bracket/semicolon
content = content.replace(/\];\s*$/, '');

// Add the new players and close
const updated = content + '\n' + playerCode + '\n];\n';

// Write back
fs.writeFileSync('./src/data/players.ts', updated);

const count = playerCode.split('\n').length;
console.log(`✓ Added ${count} players from team "${team}"`);
console.log(`  File size: ${updated.length} bytes`);
