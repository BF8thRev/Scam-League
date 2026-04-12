import { useEffect, useState, useMemo } from 'react';
import { Loader2, RefreshCw, Filter } from 'lucide-react';
import type { TradeRow } from '../types/database';
import { fetchTrades, knownOwners } from '../lib/tradeHistory';
import { buildAllOwnerStats } from '../lib/ownerAnalysis';
import TradeRecordCard from './TradeRecordCard';
import OwnerCard from './OwnerCard';

const YOU = '1987'; // Update to your actual owner name in the league

type VerdictFilter = 'all' | 'A' | 'B' | 'FAIR';

export default function HistoryPage() {
  const [trades, setTrades]       = useState<TradeRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [ownerFilter, setOwner]   = useState('all');
  const [verdict, setVerdict]     = useState<VerdictFilter>('all');
  const [tab, setTab]             = useState<'trades' | 'owners'>('trades');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTrades();
      setTrades(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const owners = useMemo(() => ['all', ...knownOwners(trades)], [trades]);

  const filtered = useMemo(() => {
    return trades.filter(t => {
      const ownerMatch =
        ownerFilter === 'all' ||
        t.side_a_owner === ownerFilter ||
        t.side_b_owner === ownerFilter;
      const verdictMatch =
        verdict === 'all' || t.grade_snapshot.verdict === verdict;
      return ownerMatch && verdictMatch;
    });
  }, [trades, ownerFilter, verdict]);

  const ownerStats = useMemo(() => buildAllOwnerStats(trades), [trades]);

  // Summary counts
  const totals = useMemo(() => ({
    total: trades.length,
    wins:  trades.filter(t => t.grade_snapshot.verdict !== 'FAIR').length,
    fair:  trades.filter(t => t.grade_snapshot.verdict === 'FAIR').length,
  }), [trades]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Trade History</h2>
          {!loading && (
            <p className="text-xs text-gray-500 mt-0.5">
              {totals.total} trades logged · {totals.wins} decisive · {totals.fair} fair
            </p>
          )}
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-600">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit">
        {(['trades', 'owners'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors capitalize ${
              tab === t ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'owners' ? `Owners (${ownerStats.length})` : `Trades (${trades.length})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-600" />
        </div>
      )}

      {/* ── Trades tab ───────────────────────────────────────────────── */}
      {!loading && tab === 'trades' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={13} className="text-gray-600" />
            <select
              value={ownerFilter}
              onChange={e => setOwner(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
            >
              {owners.map(o => (
                <option key={o} value={o}>{o === 'all' ? 'All owners' : o}</option>
              ))}
            </select>
            <select
              value={verdict}
              onChange={e => setVerdict(e.target.value as VerdictFilter)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
            >
              <option value="all">All verdicts</option>
              <option value="A">Side A won</option>
              <option value="B">Side B won</option>
              <option value="FAIR">Fair trades</option>
            </select>
            {(ownerFilter !== 'all' || verdict !== 'all') && (
              <button onClick={() => { setOwner('all'); setVerdict('all'); }}
                className="text-xs text-gray-500 hover:text-gray-300">
                Clear
              </button>
            )}
            <span className="text-xs text-gray-600 ml-auto">{filtered.length} shown</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-sm">No trades match the current filters.</p>
              <p className="text-gray-700 text-xs mt-1">
                Log trades from the Calculator tab using the "Log this trade" panel.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(t => (
                <TradeRecordCard
                  key={t.id}
                  trade={t}
                  onDeleted={load}
                  onUpdated={load}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Owners tab ───────────────────────────────────────────────── */}
      {!loading && tab === 'owners' && (
        <div className="space-y-4">
          {ownerStats.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-sm">No owner data yet — log some trades first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownerStats.map(s => (
                <OwnerCard key={s.name} stats={s} isYou={s.name === YOU} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
