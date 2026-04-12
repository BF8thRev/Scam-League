import { useState, useRef, useCallback, useEffect } from 'react';
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx';
import { X, Upload, Check, AlertCircle, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { PLAYERS } from '../data/players';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PlayerRow {
  id: string;
  name: string;
  position: string;
  mlbTeam: string;
  fantasyTeam: string;
  capValue: string;
  matched: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeName(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normalizeHeader(h: string) {
  return h.toLowerCase().replace(/[^a-z]/g, '');
}

const PLAYER_COLS = ['playername', 'player', 'name'];
const TEAM_COLS   = ['fantasyteam', 'fantasyowner', 'fantasyleagueteam', 'owner', 'team'];
const CAP_COLS    = ['capvalue', 'cap value', 'cap', 'salary', 'value', 'contract'];

function pickCol(headers: string[], candidates: string[]) {
  // First pass: exact match (case-insensitive, trimmed)
  for (const h of headers) {
    if (candidates.includes(h.trim().toLowerCase())) return h;
  }
  // Second pass: strip all non-alpha
  const norm = headers.map(h => h.toLowerCase().replace(/[^a-z]/g, ''));
  for (const c of candidates) {
    const cNorm = c.replace(/[^a-z]/g, '');
    const i = norm.indexOf(cNorm);
    if (i !== -1) return headers[i];
  }
  return null;
}

function parseWorkbook(data: ArrayBuffer): {
  rows: Array<{ name: string; fantasyTeam: string; capValue: string }>;
  colMap: { player: string | null; team: string | null; cap: string | null };
  totalRows: number;
  mode: 'multi-sheet' | 'single-sheet';
  sheetNames: string[];
} {
  const wb         = xlsxRead(data, { type: 'array', cellText: true });
  const isMulti    = wb.SheetNames.length > 1;
  const allRows: Array<{ name: string; fantasyTeam: string; capValue: string }> = [];
  let detectedCols = { player: null as string | null, team: null as string | null, cap: null as string | null };

  function readSheet(sheetName: string, overrideTeam: string | null) {
    const sheet = wb.Sheets[sheetName];
    const raw   = xlsxUtils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
    if (!raw.length) return;

    const headers   = Object.keys(raw[0]);
    const playerCol = pickCol(headers, PLAYER_COLS);
    const teamCol   = overrideTeam ? null : pickCol(headers, TEAM_COLS);
    const capCol    = pickCol(headers, CAP_COLS);

    if (!detectedCols.player && playerCol) detectedCols = { player: playerCol, team: teamCol, cap: capCol };

    if (!playerCol) return;

    for (const r of raw) {
      const name = String(r[playerCol] ?? '').trim();
      if (!name) continue;
      allRows.push({
        name,
        fantasyTeam: overrideTeam ?? (teamCol ? String(r[teamCol] ?? '').trim() : ''),
        capValue:    capCol ? String(r[capCol] ?? '').replace(/[^0-9.]/g, '') : '',
      });
    }
  }

  if (isMulti) {
    for (const name of wb.SheetNames) readSheet(name, name);
    detectedCols = { player: 'Player column', team: '(sheet name)', cap: detectedCols.cap };
  } else {
    readSheet(wb.SheetNames[0], null);
  }

  return {
    rows: allRows,
    colMap: detectedCols,
    totalRows: allRows.length,
    mode: isMulti ? 'multi-sheet' : 'single-sheet',
    sheetNames: wb.SheetNames,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPage({ onClose }: { onClose: () => void }) {
  const [tableRows, setTableRows] = useState<PlayerRow[]>(() =>
    PLAYERS.map(p => ({
      id: p.id, name: p.name, position: p.position, mlbTeam: p.team,
      fantasyTeam: p.fantasyTeam ?? '', capValue: p.capValue != null ? String(p.capValue) : '',
      matched: false,
    }))
  );

  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState<string | null>(null);
  const [colMap, setColMap]       = useState<{ player: string | null; team: string | null; cap: string | null } | null>(null);
  const [msg, setMsg]             = useState<{ ok: boolean; text: string } | null>(null);
  const [exported, setExported]   = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  // ── Parse uploaded file ────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setMsg(null);

    file.arrayBuffer().then(buf => {
      try {
        const { rows, colMap: cm, totalRows, mode, sheetNames } = parseWorkbook(buf);
        console.log(`Mode: ${mode}, sheets: ${sheetNames.join(', ')}`);
        setColMap(cm);

        if (!cm.player) {
          setMsg({ ok: false, text: `Could not find a player name column. Headers detected — rename one column to "Player" or "Name".` });
          return;
        }

        let matched = 0;
        const unmatched: string[] = [];

        setTableRows(prev => {
          const next = prev.map(r => ({ ...r, matched: false }));
          for (const { name, fantasyTeam, capValue } of rows) {
            const needle = normalizeName(name);
            const i = next.findIndex(r => normalizeName(r.name) === needle);
            if (i === -1) { unmatched.push(name); continue; }
            if (fantasyTeam) next[i].fantasyTeam = fantasyTeam;
            if (capValue)    next[i].capValue    = capValue;
            next[i].matched = true;
            matched++;
          }
          return next;
        });

        const warn = unmatched.length
          ? ` Could not match: ${unmatched.slice(0, 3).join(', ')}${unmatched.length > 3 ? ` +${unmatched.length - 3} more` : ''}.`
          : '';
        setMsg({ ok: unmatched.length === 0, text: `Matched ${matched} of ${totalRows} rows.${warn}` });
      } catch (e) {
        setMsg({ ok: false, text: `Failed to parse file: ${(e as Error).message}` });
      }
    });
  }, []);

  // ── Drag & drop + file input ───────────────────────────────────────────────

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = Array.from(e.dataTransfer.files).find(f =>
      f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv')
    );
    if (file) handleFile(file);
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  // ── Export JSON for Claude to apply ───────────────────────────────────────

  function buildExport() {
    const out: Record<string, { fantasyTeam?: string; capValue?: number }> = {};
    for (const r of tableRows) {
      const ft = r.fantasyTeam.trim();
      const cv = r.capValue.trim() ? parseFloat(r.capValue) : undefined;
      if (ft || (cv != null && !isNaN(cv))) {
        out[r.id] = {
          ...(ft ? { fantasyTeam: ft } : {}),
          ...(cv != null && !isNaN(cv) ? { capValue: cv } : {}),
        };
      }
    }
    return out;
  }

  async function copyForClaude() {
    const json = JSON.stringify(buildExport(), null, 2);
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // fallback
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      a.download = 'roster-updates.json';
      a.click();
    }
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  const filledCount = tableRows.filter(r => r.fantasyTeam || r.capValue).length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: 'white', fontFamily: 'inherit' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1f2937', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 900, letterSpacing: '-0.3px' }}>
            <span style={{ color: '#34d399' }}>SCAM</span>
            <span style={{ color: '#6b7280', fontWeight: 300, margin: '0 5px' }}>·</span>
            LEAGUE
            <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '13px', marginLeft: '10px' }}>/ Roster Import</span>
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#4b5563' }}>
            Upload your Excel or CSV roster file to set fantasy team names and cap values
          </p>
        </div>
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'none', border: '1px solid #374151', borderRadius: '8px', color: '#6b7280', fontSize: '12px', cursor: 'pointer' }}>
          <X size={12} /> Back
        </button>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px' }}>

        {/* ── Upload zone ─────────────────────────────────────────────────── */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#34d399' : fileName ? '#059669' : '#374151'}`,
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'rgba(52,211,153,0.05)' : fileName ? 'rgba(5,150,105,0.07)' : '#0d1117',
            transition: 'all 0.15s',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            {fileName
              ? <FileSpreadsheet size={40} style={{ color: '#34d399' }} />
              : <Upload size={40} style={{ color: '#374151' }} />
            }
          </div>

          {fileName ? (
            <>
              <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#34d399' }}>{fileName}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Click to replace with a different file</p>
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 700, color: '#e5e7eb' }}>
                Drop your Excel or CSV file here
              </p>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280' }}>
                or click to browse
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '8px 16px' }}>
                <FileSpreadsheet size={14} style={{ color: '#9ca3af' }} />
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>.xlsx &nbsp;·&nbsp; .xls &nbsp;·&nbsp; .csv</span>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#4b5563' }}>
                Expected columns: <code style={{ color: '#6b7280' }}>Player</code>, <code style={{ color: '#6b7280' }}>Fantasy Team</code>, <code style={{ color: '#6b7280' }}>Cap Value</code> &nbsp;(names are flexible)
              </p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={onFileInput} />
        </div>

        {/* ── Column mapping + status ──────────────────────────────────────── */}
        {colMap && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {(['player','team','cap'] as const).map(k => {
              const label = { player: 'Player col', team: 'Team col', cap: 'Cap col' }[k];
              const val   = colMap[k];
              return (
                <div key={k} style={{ background: '#0d1117', border: `1px solid ${val ? '#374151' : '#7f1d1d'}`, borderRadius: '8px', padding: '8px 14px', fontSize: '12px' }}>
                  <span style={{ color: '#6b7280' }}>{label}: </span>
                  <span style={{ color: val ? '#34d399' : '#ef4444', fontWeight: 600 }}>{val ?? 'not found'}</span>
                </div>
              );
            })}
          </div>
        )}

        {msg && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px', background: msg.ok ? 'rgba(6,78,59,0.35)' : 'rgba(120,53,15,0.35)', border: `1px solid ${msg.ok ? '#065f46' : '#92400e'}`, color: msg.ok ? '#6ee7b7' : '#fcd34d', fontSize: '13px' }}>
            {msg.ok ? <Check size={15} style={{ marginTop: '1px', flexShrink: 0 }} /> : <AlertCircle size={15} style={{ marginTop: '1px', flexShrink: 0 }} />}
            {msg.text}
          </div>
        )}

        {/* ── Player table ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            All Players
            {filledCount > 0 && <span style={{ color: '#34d399', fontWeight: 400, marginLeft: '8px', textTransform: 'none' }}>{filledCount} filled</span>}
          </p>

          {filledCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Copy → paste here → Claude updates players.ts</span>
              <button
                onClick={copyForClaude}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', background: exported ? '#059669' : '#2563eb', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                {exported ? <Check size={13} /> : <ArrowRight size={13} />}
                {exported ? 'Copied — paste into chat!' : 'Copy JSON for Claude'}
              </button>
            </div>
          )}
        </div>

        <div style={{ border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0d1117', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid #1f2937' }}>
                  {['#','Player','Pos','MLB Team','Fantasy Team','Cap Value'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '10px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #0d1117', background: row.matched ? 'rgba(6,78,59,0.18)' : 'transparent' }}>
                    <td style={{ padding: '5px 12px', color: '#374151', fontSize: '11px', fontFamily: 'monospace' }}>{i + 1}</td>
                    <td style={{ padding: '5px 12px' }}>
                      <span style={{ color: '#e5e7eb' }}>{row.name}</span>
                      {row.matched && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#34d399' }}>✓</span>}
                    </td>
                    <td style={{ padding: '5px 12px', color: '#4b5563', fontSize: '11px', fontFamily: 'monospace' }}>{row.position}</td>
                    <td style={{ padding: '5px 12px', color: '#4b5563', fontSize: '11px', fontFamily: 'monospace' }}>{row.mlbTeam}</td>
                    <td style={{ padding: '5px 12px' }}>
                      <input
                        type="text" value={row.fantasyTeam}
                        onChange={e => setTableRows(p => p.map(r => r.id === row.id ? { ...r, fantasyTeam: e.target.value, matched: false } : r))}
                        placeholder="—"
                        style={{ width: '100%', minWidth: '130px', background: 'transparent', border: 'none', borderBottom: '1px solid #1f2937', color: '#e5e7eb', fontSize: '13px', padding: '2px 4px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '5px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ color: '#374151', fontSize: '11px' }}>$</span>
                        <input
                          type="number" value={row.capValue} min={0}
                          onChange={e => setTableRows(p => p.map(r => r.id === row.id ? { ...r, capValue: e.target.value, matched: false } : r))}
                          placeholder="0"
                          style={{ width: '60px', background: 'transparent', border: 'none', borderBottom: '1px solid #1f2937', color: '#e5e7eb', fontSize: '13px', padding: '2px 4px', outline: 'none', fontFamily: 'monospace' }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
