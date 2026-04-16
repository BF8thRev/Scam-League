import fs from 'fs';

const newPlayersCode = `  {
    id: 'ottolopez', name: 'Otto Lopez', position: 'SS', team: 'MIA', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'codybellinger', name: 'Cody Bellinger', position: 'OF', team: 'NYY', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'petecrowarmstrong', name: 'Pete Crow-Armstrong', position: 'OF', team: 'CHC', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'jacksonmerrill', name: 'Jackson Merrill', position: 'OF', team: 'SD', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'xanderbogaerts', name: 'Xander Bogaerts', position: 'DH', team: 'SD', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'kyleschwarber', name: 'Kyle Schwarber', position: 'DH', team: 'PHI', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'byronbuxton', name: 'Byron Buxton', position: 'OF', team: 'MIN', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'dylanbeavers', name: 'Dylan Beavers', position: 'DH', team: 'BAL', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'konnorgriffin', name: 'Konnor Griffin', position: 'DH', team: 'PIT', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'trevorstory', name: 'Trevor Story', position: 'DH', team: 'BOS', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'calebbonemer', name: 'Caleb Bonemer', position: 'SS', team: 'CHW', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'bradenmontgomery', name: 'Braden Montgomery', position: 'OF', team: 'CHW', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'leodevries', name: 'Leo De Vries', position: 'DH', team: 'ATH', age: 25,
    stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 },
  },
  {
    id: 'krisbubic', name: 'Kris Bubic', position: 'SP', team: 'KC', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'edwardcabrera', name: 'Edward Cabrera', position: 'SP', team: 'CHC', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'sethlugo', name: 'Seth Lugo', position: 'SP', team: 'KC', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'robbieray', name: 'Robbie Ray', position: 'SP', team: 'SF', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'cristophersanchez', name: 'Cristopher Sanchez', position: 'SP', team: 'PHI', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'jacoblopez', name: 'Jacob Lopez', position: 'SP', team: 'ATH', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'reynaldolopez', name: 'Reynaldo Lopez', position: 'SP', team: 'ATL', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'joeycantillo', name: 'Joey Cantillo', position: 'RP', team: 'CLE', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },
  {
    id: 'abneruribe', name: 'Abner Uribe', position: 'RP', team: 'MIL', age: 25,
    stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 },
  },`;

// Read the current players file
let content = fs.readFileSync('./src/data/players.ts', 'utf-8');

// Remove the closing bracket and semicolon
content = content.replace(/\];\s*$/m, '');

// Add the new players
const updated = content + '\n' + newPlayersCode + '\n];\n';

// Write back
fs.writeFileSync('./src/data/players.ts', updated);

console.log('✓ Added 22 new players to src/data/players.ts');
console.log(`  New file size: ${updated.length} bytes`);
