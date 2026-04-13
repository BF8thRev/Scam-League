import { useState, useRef, useCallback, useEffect } from 'react';
import type ExcelJS from 'exceljs'; // type-only — runtime import is lazy inside parseFile
import { X, Upload, Check, AlertCircle, FileSpreadsheet, Save, ArrowRight } from 'lucide-react';
import { PLAYERS } from '../data/players';
import { loadRosters, saveRosters, fetchRostersFromSupabase } from '../lib/rosterStorage';
import { isSupabaseConfigured } from '../lib/supabase';

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

// ── localStorage helpers ──────────────────────────────────────────────────────

function buildInitialRows(): PlayerRow[] {
  const saved = loadRosters();
  return PLAYERS.map(p => {
    const override = saved?.data[p.id];
    return {
      id: p.id,
      name: p.name,
      position: p.position,
      mlbTeam: p.team,
      fantasyTeam: override?.fantasyTeam ?? p.fantasyTeam ?? '',
      capValue:    override?.capValue    != null ? String(override.capValue)
                 : p.capValue            != null ? String(p.capValue) : '',
      matched: false,
    };
  });
}

function rowsToStoreData(rows: PlayerRow[]) {
  const out: Record<string, { fantasyTeam?: string; capValue?: number }> = {};
  for (const r of rows) {
    const ft = r.fantasyTeam.trim();
    const cv = r.capValue.trim() ? parseFloat(r.capValue) : undefined;
    if (ft || (cv != null && !isNaN(cv))) {
      out[r.id] = {
        ...(ft                          ? { fantasyTeam: ft }  : {}),
        ...(cv != null && !isNaN(cv)    ? { capValue: cv }     : {}),
      };
    }
  }
  return out;
}

function fmtTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

// ── Excel/CSV parsing ─────────────────────────────────────────────────────────

function normalizeName(s: string) {
  return s.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const PLAYER_COLS = ['playername', 'player', 'name'];
const TEAM_COLS   = ['fantasyteam', 'fantasyowner', 'fantasyleagueteam', 'owner', 'team'];
const CAP_COLS    = ['capvalue', 'cap value', 'cap', 'salary', 'value', 'contract'];

function pickCol(headers: string[], candidates: string[]) {
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

// Convert an ExcelJS cell value to a plain string.
function cellStr(v: ExcelJS.CellValue): string {
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'object' && 'text' in v) return String((v as { text: string }).text);
  return String(v);
}

// Convert an ExcelJS worksheet to an array of plain objects (like SheetJS sheet_to_json).
function wsToJson(sheet: ExcelJS.Worksheet): Record<string, string>[] {
  const out: Record<string, string>[] = [];
  let headers: string[] = [];
  sheet.eachRow(row => {
    const vals = (row.values as ExcelJS.CellValue[]).slice(1); // 1-indexed → 0-indexed
    if (!headers.length) {
      headers = vals.map(v => cellStr(v).trim());
      return;
    }
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { if (h) obj[h] = cellStr(vals[i]).trim(); });
    if (Object.values(obj).some(v => v !== '')) out.push(obj);
  });
  return out;
}

// RFC 4180-compliant CSV parser (handles quoted fields with embedded commas).
function parseCSVText(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  function splitLine(line: string): string[] {
    const fields: string[] = [];
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
  return lines.slice(1)
    .map(line => {
      const vals = splitLine(line);
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { if (h) obj[h] = vals[i] ?? ''; });
      return obj;
    })
    .filter(row => Object.values(row).some(v => v !== ''));
}

type ParseResult = {
  rows: Array<{ name: string; fantasyTeam: string; capValue: string }>;
  colMap: { player: string | null; team: string | null; cap: string | null };
  totalRows: number;
  mode: 'single-sheet' | 'multi-sheet';
};

async function parseFile(data: ArrayBuffer, fileName: string): Promise<ParseResult> {
  const allRows: ParseResult['rows'] = [];
  let detected: ParseResult['colMap'] = { player: null, team: null, cap: null };

  function extractRows(raw: Record<string, string>[], teamOverride: string | null) {
    if (!raw.length) return;
    const headers   = Object.keys(raw[0]);
    const playerCol = pickCol(headers, PLAYER_COLS);
    const teamCol   = teamOverride ? null : pickCol(headers, TEAM_COLS);
    const capCol    = pickCol(headers, CAP_COLS);
    if (!detected.player && playerCol) detected = { player: playerCol, team: teamCol, cap: capCol };
    if (!playerCol) return;
    for (const r of raw) {
      const name = String(r[playerCol] ?? '').trim();
      if (!name) continue;
      allRows.push({
        name,
        fantasyTeam: teamOverride ?? (teamCol ? String(r[teamCol] ?? '').trim() : ''),
        capValue:    capCol ? String(r[capCol] ?? '').replace(/[^0-9.]/g, '') : '',
      });
    }
  }

  if (/\.csv$/i.test(fileName)) {
    const text = new TextDecoder('utf-8').decode(data);
    extractRows(parseCSVText(text), null);
    return { rows: allRows, colMap: detected, totalRows: allRows.length, mode: 'single-sheet' };
  }

  // xlsx — import ExcelJS lazily so the main bundle stays lean
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(data);
  const isMulti = wb.worksheets.length > 1;

  if (isMulti) {
    for (const ws of wb.worksheets) extractRows(wsToJson(ws), ws.name);
    detected = { player: 'Player column', team: '(sheet name)', cap: detected.cap };
  } else {
    extractRows(wsToJson(wb.worksheets[0]), null);
  }

  return { rows: allRows, colMap: detected, totalRows: allRows.length,
           mode: isMulti ? 'multi-sheet' : 'single-sheet' };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPage({ onClose }: { onClose: () => void }) {
  const [tableRows, setTableRows] = useState<PlayerRow[]>(buildInitialRows);
  const [dragOver, setDragOver]       = useState(false);
  const [fileName, setFileName]       = useState<string | null>(null);
  const [colMap, setColMap]           = useState<{ player: string | null; team: string | null; cap: string | null } | null>(null);
  const [parseMsg, setParseMsg]       = useState<{ ok: boolean; text: string } | null>(null);
  const [savedAt, setSavedAt]         = useState<string | null>(() => loadRosters()?.savedAt ?? null);
  const [saveFlash, setSaveFlash]     = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveDetail, setSaveDetail]   = useState('');
  const [copied, setCopied]           = useState(false);
  const fileRef                       = useRef<HTMLInputElement>(null);

  // ── Load from Supabase on mount (if configured), otherwise use localStorage ─

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchRostersFromSupabase().then(store => {
      if (!store) return;
      setTableRows(prev => prev.map(r => {
        const ov = store.data[r.id];
        if (!ov) return r;
        return {
          ...r,
          fantasyTeam: ov.fantasyTeam ?? r.fantasyTeam,
          capValue:    ov.capValue    != null ? String(ov.capValue) : r.capValue,
        };
      }));
      setSavedAt(store.savedAt);
    }).catch(() => {/* silently fall back to localStorage */});
  }, []);

  // ── Manual save (localStorage + Supabase) ─────────────────────────────────

  async function handleSave() {
    setSaveFlash('saving');
    setSaveDetail('');
    try {
      const { savedAt: ts, supabase: savedRemote } = await saveRosters(rowsToStoreData(tableRows));
      setSavedAt(ts);
      setSaveFlash('saved');
      setSaveDetail(savedRemote ? 'Saved to Supabase' : 'Saved locally');
      setTimeout(() => setSaveFlash('idle'), 3000);
    } catch (e) {
      setSaveFlash('error');
      setSaveDetail((e as Error).message);
      setTimeout(() => setSaveFlash('idle'), 5000);
    }
  }

  // ── Auto-save to localStorage only on table edits (debounced) ────────────

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      saveRosters(rowsToStoreData(tableRows)).catch(() => {});
    }, 1000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [tableRows]);

  // ── File parse ────────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setParseMsg(null);

    file.arrayBuffer().then(async buf => {
      try {
        const { rows, colMap: cm, totalRows } = await parseFile(buf, file.name);
        setColMap(cm);

        if (!cm.player) {
          setParseMsg({ ok: false, text: 'Could not find a player name column. Rename a column to "Player" or "Name".' });
          return;
        }

        let matched   = 0;
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
          // Auto-save immediately after file parse (don't wait for debounce)
          setTimeout(() => {
            saveRosters(rowsToStoreData(next))
              .then(({ savedAt: ts }) => setSavedAt(ts))
              .catch(() => {});
          }, 0);
          return next;
        });

        const warn = unmatched.length
          ? ` No match for: ${unmatched.slice(0, 3).join(', ')}${unmatched.length > 3 ? ` +${unmatched.length - 3} more` : ''}.`
          : '';
        setParseMsg({ ok: unmatched.length === 0, text: `Matched ${matched} of ${totalRows} rows.${warn}` });
      } catch (e) {
        setParseMsg({ ok: false, text: `Parse error: ${(e as Error).message}` });
      }
    });
  }, []);

  // ── Drag & drop ───────────────────────────────────────────────────────────

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = Array.from(e.dataTransfer.files).find(f =>
      /\.(xlsx|csv)$/i.test(f.name));
    if (file) handleFile(file);
  }

  // ── Copy JSON for Claude ──────────────────────────────────────────────────

  async function copyForClaude() {
    const json = JSON.stringify(rowsToStoreData(tableRows), null, 2);
    try { await navigator.clipboard.writeText(json); }
    catch {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      a.download = 'roster-updates.json'; a.click();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
            {savedAt
              ? <span>Last saved: <span style={{ color: '#6b7280' }}>{fmtTimestamp(savedAt)}</span></span>
              : 'No saved data — upload your roster file below'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Save Rosters button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <button
              onClick={handleSave}
              disabled={saveFlash === 'saving'}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', border: 'none', borderRadius: '8px',
                cursor: saveFlash === 'saving' ? 'default' : 'pointer',
                fontSize: '12px', fontWeight: 700,
                background: saveFlash === 'saved'  ? '#059669'
                           : saveFlash === 'error'  ? '#7f1d1d'
                           : saveFlash === 'saving' ? '#1f2937'
                           : '#1f2937',
                color: saveFlash === 'saving' ? '#6b7280' : 'white',
                opacity: saveFlash === 'saving' ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
            >
              {saveFlash === 'saving' ? <Save size={13} style={{ opacity: 0.5 }} /> :
               saveFlash === 'saved'  ? <Check size={13} /> :
               <Save size={13} />}
              {saveFlash === 'saving' ? 'Saving…' :
               saveFlash === 'saved'  ? 'Saved!' :
               saveFlash === 'error'  ? 'Error' :
               'Save Rosters'}
            </button>
            {saveDetail && (
              <span style={{ fontSize: '10px', color: saveFlash === 'error' ? '#f87171' : '#34d399' }}>
                {saveDetail}
              </span>
            )}
          </div>

          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', background: 'none', border: '1px solid #374151', borderRadius: '8px', color: '#6b7280', fontSize: '12px', cursor: 'pointer' }}>
            <X size={12} /> Back
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>

        {/* ── Upload zone ─────────────────────────────────────────────────── */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#34d399' : fileName ? '#059669' : '#374151'}`,
            borderRadius: '14px', padding: '36px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'all 0.15s', marginBottom: '20px',
            background: dragOver ? 'rgba(52,211,153,0.05)' : fileName ? 'rgba(5,150,105,0.06)' : '#0d1117',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            {fileName
              ? <FileSpreadsheet size={36} style={{ color: '#34d399' }} />
              : <Upload size={36} style={{ color: '#4b5563' }} />}
          </div>

          {fileName ? (
            <>
              <p style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 700, color: '#34d399' }}>{fileName}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Click to upload a different file</p>
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 5px', fontSize: '17px', fontWeight: 700, color: '#e5e7eb' }}>
                Drop your Excel file here
              </p>
              <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#6b7280' }}>or click to browse &nbsp;·&nbsp; .xlsx &nbsp;·&nbsp; .csv</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#4b5563' }}>
                Multi-sheet: each sheet name = fantasy team &nbsp;·&nbsp; Columns: <code style={{ color: '#6b7280' }}>Player</code>, <code style={{ color: '#6b7280' }}>Cap value</code>
              </p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".xlsx,.csv" style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
        </div>

        {/* Column map */}
        {colMap && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {(['player','team','cap'] as const).map(k => {
              const labels = { player: 'Player col', team: 'Team col', cap: 'Cap col' };
              const val    = colMap[k];
              return (
                <div key={k} style={{ background: '#0d1117', border: `1px solid ${val ? '#1f2937' : '#7f1d1d'}`, borderRadius: '8px', padding: '6px 12px', fontSize: '12px' }}>
                  <span style={{ color: '#4b5563' }}>{labels[k]}: </span>
                  <span style={{ color: val ? '#34d399' : '#ef4444', fontWeight: 600 }}>{val ?? 'not found'}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Parse message */}
        {parseMsg && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', background: parseMsg.ok ? 'rgba(6,78,59,0.3)' : 'rgba(120,53,15,0.3)', border: `1px solid ${parseMsg.ok ? '#065f46' : '#92400e'}`, color: parseMsg.ok ? '#6ee7b7' : '#fcd34d' }}>
            {parseMsg.ok ? <Check size={14} style={{ flexShrink: 0, marginTop: '1px' }} /> : <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />}
            {parseMsg.text}
          </div>
        )}

        {/* Table header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            All Players
            {filledCount > 0 && (
              <span style={{ color: '#34d399', fontWeight: 500, marginLeft: '8px', textTransform: 'none' }}>
                {filledCount} / {tableRows.length} filled
              </span>
            )}
          </p>

          {filledCount > 0 && (
            <button
              onClick={copyForClaude}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: copied ? '#059669' : '#1e3a5f', border: `1px solid ${copied ? '#059669' : '#2563eb'}`, borderRadius: '8px', color: copied ? 'white' : '#93c5fd', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              {copied ? <Check size={13} /> : <ArrowRight size={13} />}
              {copied ? 'Copied — paste into chat!' : 'Copy JSON for Claude'}
            </button>
          )}
        </div>

        {/* Player table */}
        <div style={{ border: '1px solid #1f2937', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ maxHeight: '58vh', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0d1117', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid #1f2937' }}>
                  {['#', 'Player', 'Pos', 'MLB', 'Fantasy Team', 'Cap Value'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '10px', color: '#4b5563', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #0a0f1a', background: row.matched ? 'rgba(6,78,59,0.15)' : 'transparent' }}>
                    <td style={{ padding: '5px 12px', color: '#374151', fontSize: '11px', fontFamily: 'monospace' }}>{i + 1}</td>
                    <td style={{ padding: '5px 12px' }}>
                      <span style={{ color: '#e5e7eb' }}>{row.name}</span>
                      {row.matched && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#34d399' }}>✓</span>}
                    </td>
                    <td style={{ padding: '5px 12px', color: '#4b5563', fontFamily: 'monospace', fontSize: '11px' }}>{row.position}</td>
                    <td style={{ padding: '5px 12px', color: '#4b5563', fontFamily: 'monospace', fontSize: '11px' }}>{row.mlbTeam}</td>
                    <td style={{ padding: '5px 12px' }}>
                      <input
                        type="text" value={row.fantasyTeam} placeholder="—"
                        onChange={e => setTableRows(p => p.map(r => r.id === row.id ? { ...r, fantasyTeam: e.target.value, matched: false } : r))}
                        style={{ width: '100%', minWidth: '130px', background: 'transparent', border: 'none', borderBottom: '1px solid #1f2937', color: '#e5e7eb', fontSize: '13px', padding: '2px 4px', outline: 'none' }}
                      />
                    </td>
                    <td style={{ padding: '5px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ color: '#374151', fontSize: '11px' }}>$</span>
                        <input
                          type="number" value={row.capValue} placeholder="0" min={0}
                          onChange={e => setTableRows(p => p.map(r => r.id === row.id ? { ...r, capValue: e.target.value, matched: false } : r))}
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
