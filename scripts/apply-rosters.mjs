/**
 * apply-rosters.mjs
 *
 * Reads an Excel (.xlsx) or CSV file and permanently writes fantasyTeam + capValue
 * into src/data/players.ts.
 *
 * Usage:
 *   node scripts/apply-rosters.mjs imports/rosters.xlsx
 *
 * ── Two supported layouts ────────────────────────────────────────────────────
 *
 * PREFERRED — Multiple sheets, one per team:
 *   Sheet name  = fantasy team name  (e.g. "Team Alpha")
 *   Columns     = Player, Cap  (team is inferred from sheet name)
 *
 * ALSO WORKS — Single sheet, all players:
 *   Columns     = Player, Fantasy Team, Cap
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, extname } from 'path';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');

// ── 1. Read file ──────────────────────────────────────────────────────────────

const inputArg = process.argv[2];
if (!inputArg) {
  console.error('Usage: node scripts/apply-rosters.mjs <path-to-excel-or-csv>');
  process.exit(1);
}

const inputPath = resolve(ROOT, inputArg);
const ext       = extname(inputPath).toLowerCase();
console.log(`\nReading: ${inputPath}\n`);

// ── 2. Parse file ─────────────────────────────────────────────────────────────

function normalizeHeader(h) {
  return String(h).toLowerCase().replace(/[^a-z]/g, '');
}

const PLAYER_COLS = ['playername','player','name'];
const TEAM_COLS   = ['fantasyteam','fantasyowner','owner','team'];
const CAP_COLS    = ['capvalue','cap value','cap','salary','value','contract'];

function pickCol(headers, candidates) {
  for (const h of headers) {
    if (candidates.includes(h.trim().toLowerCase())) return h;
  }
  const norm = headers.map(h => h.toLowerCase().replace(/[^a-z]/g, ''));
  for (const c of candidates) {
    const i = norm.indexOf(c.replace(/[^a-z]/g, ''));
    if (i !== -1) return headers[i];
  }
  return null;
}

function cellStr(v) {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object' && 'text' in v) return String(v.text);
  return String(v);
}

function wsToJson(sheet) {
  const out = [];
  let headers = [];
  sheet.eachRow(row => {
    const vals = Array.from(row.values).slice(1); // 1-indexed → 0-indexed
    if (!headers.length) {
      headers = vals.map(v => cellStr(v).trim());
      return;
    }
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = cellStr(vals[i]).trim(); });
    if (Object.values(obj).some(v => v !== '')) out.push(obj);
  });
  return out;
}

// Simple RFC 4180 CSV parser
function parseCSVText(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  function splitLine(line) {
    const fields = [];
    let field = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { field += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) { fields.push(field.trim()); field = ''; }
      else field += ch;
    }
    fields.push(field.trim());
    return fields;
  }
  const headers = splitLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitLine(line);
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = vals[i] ?? ''; });
    return obj;
  }).filter(row => Object.values(row).some(v => v !== ''));
}

function extractRows(rawRows, teamOverride) {
  if (!rawRows.length) return [];
  const headers   = Object.keys(rawRows[0]);
  const playerCol = pickCol(headers, PLAYER_COLS);
  const teamCol   = teamOverride ? null : pickCol(headers, TEAM_COLS);
  const capCol    = pickCol(headers, CAP_COLS);
  if (!playerCol) return [];
  return rawRows
    .map(r => ({
      name:        String(r[playerCol] ?? '').trim(),
      fantasyTeam: teamOverride ?? (teamCol ? String(r[teamCol] ?? '').trim() : ''),
      capValue:    capCol ? String(r[capCol] ?? '').replace(/[^0-9.]/g, '') : '',
    }))
    .filter(r => r.name.length > 0);
}

const wb = new ExcelJS.Workbook();

let allRows = [];

if (ext === '.csv') {
  console.log('Mode: CSV');
  await wb.csv.readFile(inputPath);
  const sheet = wb.worksheets[0];
  allRows = extractRows(wsToJson(sheet), null);
  console.log(`  ${allRows.length} rows parsed`);
} else {
  await wb.xlsx.readFile(inputPath);
  console.log(`Sheets found: ${wb.worksheets.map(ws => ws.name).join(', ')}`);
  const isMultiTeam = wb.worksheets.length > 1;

  if (isMultiTeam) {
    console.log(`\nMode: MULTI-SHEET — treating each sheet name as the fantasy team name`);
    for (const ws of wb.worksheets) {
      const rows = extractRows(wsToJson(ws), ws.name);
      console.log(`  "${ws.name}": ${rows.length} players`);
      allRows.push(...rows);
    }
  } else {
    console.log(`\nMode: SINGLE-SHEET — looking for Player / Fantasy Team / Cap columns`);
    allRows = extractRows(wsToJson(wb.worksheets[0]), null);
    console.log(`  ${allRows.length} rows parsed`);
  }
}

if (!allRows.length) {
  console.error('\n❌  No player rows found. Check your column headers.');
  process.exit(1);
}

// ── 3. Match players ──────────────────────────────────────────────────────────

function normalizeName(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const playersSource = readFileSync(resolve(ROOT, 'src/data/players.ts'), 'utf8');
const playerList    = [];
const re            = /id:\s*'([^']+)',\s*name:\s*['"]([^'"]+)['"]/g;
let m;
while ((m = re.exec(playersSource)) !== null) {
  playerList.push({ id: m[1], name: m[2] });
}
console.log(`\nLoaded ${playerList.length} players from players.ts`);

const updates    = {};
let   matched    = 0;
const unmatched  = [];

for (const { name, fantasyTeam, capValue } of allRows) {
  const needle = normalizeName(name);
  const player = playerList.find(p => normalizeName(p.name) === needle);
  if (!player) { unmatched.push(name); continue; }

  const cap = capValue ? parseFloat(capValue) : undefined;
  updates[player.id] = {
    ...(fantasyTeam                ? { fantasyTeam }   : {}),
    ...(cap != null && !isNaN(cap) ? { capValue: cap } : {}),
  };
  matched++;
}

console.log(`\nMatched  : ${matched}`);
console.log(`Unmatched: ${unmatched.length}`);
if (unmatched.length) {
  unmatched.slice(0, 10).forEach(n => console.warn(`  ⚠  "${n}"`));
  if (unmatched.length > 10) console.warn(`  ... and ${unmatched.length - 10} more`);
}

if (!matched) {
  console.error('\n❌  Nothing matched — check player name column.');
  process.exit(1);
}

// ── 4. Patch players.ts ───────────────────────────────────────────────────────

let source = playersSource;

for (const [id, data] of Object.entries(updates)) {
  const idPattern = new RegExp(`(id:\\s*'${id}'[^}]*?)(,?\\s*\\})`, 's');
  const result = source.replace(idPattern, (_full, body, _closing) => {
    let patched = body
      .replace(/,?\s*fantasyTeam:\s*'[^']*'/g, '')
      .replace(/,?\s*capValue:\s*[\d.]+/g, '');

    const extras = [];
    if (data.fantasyTeam) extras.push(`fantasyTeam: '${data.fantasyTeam}'`);
    if (data.capValue != null) extras.push(`capValue: ${data.capValue}`);

    if (extras.length) {
      patched = patched.trimEnd() + ',\n    ' + extras.join(', ');
    }

    return patched + ',\n  }';
  });

  if (result === source) {
    console.warn(`  ⚠  Could not patch id="${id}"`);
  } else {
    source = result;
  }
}

writeFileSync(resolve(ROOT, 'src/data/players.ts'), source, 'utf8');
console.log(`\n✅  players.ts updated — ${matched} players patched.`);
