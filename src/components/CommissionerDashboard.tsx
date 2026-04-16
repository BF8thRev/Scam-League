import { useState, useMemo } from 'react';
import { TrendingUp, Zap, BarChart3, BookOpen } from 'lucide-react';
import type { TradeRow } from '../types/database';
import { LEAGUE_POSITION_DATA } from '../lib/positionAnalysis';

interface Props {
  trades: TradeRow[];
}

export default function CommissionerDashboard({ trades }: Props) {
  const [activeTab, setActiveTab] = useState<'ratings' | 'patterns' | 'blindspots' | 'positionref'>('positionref');

  // Filter trades with dimension scores
  const ratedTrades = useMemo(() =>
    trades.filter(t => t.dimension_scores).sort((a, b) =>
      (b.dimension_scores?.composite_score ?? 0) - (a.dimension_scores?.composite_score ?? 0)
    ),
    [trades]
  );

  // Analyze league patterns
  const leaguePatterns = useMemo(() => {
    const monthTotals: Record<string, number[]> = {};
    const positionCaps: Record<string, number[]> = {};

    ratedTrades.forEach(trade => {
      // Monthly patterns
      const month = trade.calendar_context || 'unknown';
      if (!monthTotals[month]) monthTotals[month] = [];
      monthTotals[month].push(trade.dimension_scores?.composite_score ?? 0);

      // Position patterns
      [...trade.side_a_assets, ...trade.side_b_assets].forEach(asset => {
        if (asset.position) {
          if (!positionCaps[asset.position]) positionCaps[asset.position] = [];
          positionCaps[asset.position].push(asset.cap);
        }
      });
    });

    const monthStats = Object.entries(monthTotals).map(([month, scores]) => ({
      month,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      count: scores.length,
    }));

    return { monthStats, positionCaps };
  }, [ratedTrades]);

  // Analyze blindspots (your opinion vs algorithm)
  const blindspots = useMemo(() => {
    const gaps: { dimension: string; gap: number; count: number }[] = [];

    // Filter trades where you rated them
    const opinionedTrades = ratedTrades.filter(t => t.admin_opinion_rating);

    if (opinionedTrades.length === 0) return [];

    const dimensions = [
      { key: 'cap_efficiency', label: 'Cap Efficiency' },
      { key: 'position_value', label: 'Position Value' },
      { key: 'mlb_team_context', label: 'MLB Team Context' },
      { key: 'dynasty_outlook', label: 'Dynasty Outlook' },
      { key: 'season_timing', label: 'Season Timing' },
    ];

    dimensions.forEach(({ key, label }) => {
      let totalGap = 0;
      opinionedTrades.forEach(trade => {
        const algScore = trade.dimension_scores?.[key as keyof typeof trade.dimension_scores] ?? 5;
        const adminOpinion = trade.admin_opinion_rating ?? 5;
        totalGap += Math.abs(algScore - adminOpinion);
      });
      const avgGap = totalGap / opinionedTrades.length;
      if (avgGap > 0.5) {
        gaps.push({ dimension: label, gap: avgGap, count: opinionedTrades.length });
      }
    });

    return gaps.sort((a, b) => b.gap - a.gap);
  }, [ratedTrades]);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700 overflow-x-auto">
        {[
          { id: 'positionref', label: 'Position Analysis (Reference)', icon: <BookOpen size={14} /> },
          { id: 'ratings', label: 'Trade Ratings', icon: <BarChart3 size={14} /> },
          { id: 'patterns', label: 'League Patterns', icon: <TrendingUp size={14} /> },
          { id: 'blindspots', label: 'Your Blindspots', icon: <Zap size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'positionref' && (
          <div className="space-y-4 overflow-visible">
            <div className="space-y-2 mb-4">
              <h3 className="text-sm font-bold text-white">Your League's Position Scarcity</h3>
              <p className="text-xs text-gray-500">Elite player availability (last 3 years, 300+ pts threshold) — What point totals qualify as "elite" at each position?</p>
            </div>

            {/* Clean Table Layout - No Scroll */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-visible">
              {/* Table Header */}
              <div className="grid grid-cols-9 gap-0 border-b border-gray-700 bg-gray-900/60">
                <div className="px-2 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tight">Position</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-red-400 text-center">99th</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-orange-400 text-center">95th</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-yellow-400 text-center">90th</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-gray-400 text-center">Repl.</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-blue-400 text-center">Supply</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-purple-400 text-center">Scarcity</div>
                <div className="px-1 py-1.5 text-[10px] font-bold text-emerald-400 text-center">Tier</div>
                <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 text-center">Target</div>
              </div>

              {/* Table Rows */}
              {Object.entries(LEAGUE_POSITION_DATA)
                .sort(([a], [b]) => {
                  return LEAGUE_POSITION_DATA[a].scarcity_score - LEAGUE_POSITION_DATA[b].scarcity_score;
                })
                .map(([position, data]) => {
                  const totalPlayers = data.count;
                  const elite99 = Math.max(1, Math.round(totalPlayers * 0.01));
                  const elite95 = Math.max(1, Math.round(totalPlayers * 0.05));
                  const elite90 = Math.max(1, Math.round(totalPlayers * 0.10));

                  let tier = 'DEEP';
                  let tierBg = 'bg-green-900/30';
                  let tierText = 'text-green-400';
                  if (data.scarcity_score <= 0.15) {
                    tier = 'SCARCE';
                    tierBg = 'bg-red-900/30';
                    tierText = 'text-red-400';
                  } else if (data.scarcity_score <= 0.18) {
                    tier = 'MODERATE';
                    tierBg = 'bg-yellow-900/30';
                    tierText = 'text-yellow-400';
                  }

                  return (
                    <div key={position} className="grid grid-cols-9 gap-0 border-b border-gray-700/30 hover:bg-gray-800/20 transition-colors">
                      {/* Position */}
                      <div className="px-2 py-1.5 font-black text-white text-base">{position}</div>

                      {/* 99th */}
                      <div className="px-1 py-1.5 text-center">
                        <p className="font-mono font-bold text-red-400 text-[11px]">{data.percentiles[99]}</p>
                        <p className="text-[9px] text-gray-500">~{elite99}</p>
                      </div>

                      {/* 95th */}
                      <div className="px-1 py-1.5 text-center">
                        <p className="font-mono font-bold text-orange-400 text-[11px]">{data.percentiles[95]}</p>
                        <p className="text-[9px] text-gray-500">~{elite95}</p>
                      </div>

                      {/* 90th */}
                      <div className="px-1 py-1.5 text-center">
                        <p className="font-mono font-bold text-yellow-400 text-[11px]">{data.percentiles[90]}</p>
                        <p className="text-[9px] text-gray-500">~{elite90}</p>
                      </div>

                      {/* Replacement */}
                      <div className="px-1 py-1.5 text-center">
                        <p className="font-mono font-bold text-gray-300 text-[11px]">{data.percentiles[50]}</p>
                        <p className="text-[9px] text-gray-600">med</p>
                      </div>

                      {/* Supply (total) */}
                      <div className="px-1 py-1.5 text-center">
                        <p className="font-bold text-blue-400 text-sm">{totalPlayers}</p>
                        <p className="text-[9px] text-gray-600">pl</p>
                      </div>

                      {/* Scarcity % */}
                      <div className="px-1 py-1.5 text-center">
                        <p className={`font-bold text-[11px] ${data.scarcity_score <= 0.15 ? 'text-red-400' : data.scarcity_score <= 0.18 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {(data.scarcity_score * 100).toFixed(0)}%
                        </p>
                        <p className="text-[9px] text-gray-600">90+</p>
                      </div>

                      {/* Tier Badge */}
                      <div className={`px-1 py-1.5 text-center ${tierBg} flex items-center justify-center`}>
                        <span className={`text-[10px] font-bold ${tierText}`}>{tier}</span>
                      </div>

                      {/* Target */}
                      <div className="px-2 py-1.5 text-center text-[9px] text-gray-400">
                        <p className="font-mono font-bold">{data.percentiles[90]}+</p>
                        <p>({elite90})</p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Legend below table */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-300 space-y-1">
              <p className="font-semibold text-blue-400">📊 Understanding the Table</p>
              <p>• <strong>99th/95th/90th/Repl.:</strong> Point thresholds at each tier (left = elite, right = baseline)</p>
              <p>• <strong>Supply:</strong> Total meaningful players (300+ pts) at that position</p>
              <p>• <strong>Scarcity:</strong> % of players reaching 90th+ tier. Lower = rarer elite players</p>
              <p>• <strong>Tier:</strong> SCARCE (red): Few elite exist • MODERATE (yellow) • DEEP (green): Many elite</p>
              <p>• <strong>Target:</strong> Aim for the 90th%ile threshold. Only ~{Math.round(Object.values(LEAGUE_POSITION_DATA).reduce((sum, d) => sum + (d.count * 0.1), 0) / 9)} players per position reach it annually.</p>
            </div>
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-3">Top-rated trades (by composite score)</p>
            {ratedTrades.length === 0 ? (
              <p className="text-xs text-gray-600 italic">No rated trades yet</p>
            ) : (
              ratedTrades.slice(0, 10).map(trade => (
                <div key={trade.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 text-xs">
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {trade.side_a_owner} ↔ {trade.side_b_owner}
                    </p>
                    <p className="text-gray-500 text-[10px]">{trade.trade_date}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-bold text-emerald-400">
                      {trade.dimension_scores?.composite_score.toFixed(1)}/10
                    </p>
                    <p className="text-gray-500">Risk: {trade.dimension_scores?.risk_score.toFixed(1)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-4">
            {leaguePatterns.monthStats.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-semibold">Trade quality by month</p>
                <div className="space-y-1">
                  {leaguePatterns.monthStats.map(({ month, avg, count }) => (
                    <div key={month} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 capitalize w-20">{month}</span>
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full mx-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500/60 rounded-full"
                          style={{ width: `${(avg / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-500 w-12 text-right">
                        {avg.toFixed(1)} ({count})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold">Average cap per position</p>
              <div className="space-y-1">
                {Object.entries(leaguePatterns.positionCaps)
                  .map(([pos, caps]) => ({
                    pos,
                    avg: caps.reduce((a, b) => a + b, 0) / caps.length,
                  }))
                  .sort((a, b) => b.avg - a.avg)
                  .slice(0, 5)
                  .map(({ pos, avg }) => (
                    <div key={pos} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-mono">{pos}</span>
                      <span className="text-emerald-400">${avg.toFixed(1)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blindspots' && (
          <div className="space-y-3">
            {blindspots.length === 0 ? (
              <p className="text-xs text-gray-600 italic">
                {ratedTrades.filter(t => t.admin_opinion_rating).length === 0
                  ? 'Rate some trades first to see your blindspots'
                  : 'No systematic gaps found (you agree with the algorithm!)'}
              </p>
            ) : (
              blindspots.map(({ dimension, gap }) => (
                <div key={dimension} className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-yellow-300">{dimension}</span>
                    <span className="text-xs text-gray-500">Gap: {gap.toFixed(1)} pts avg</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    You consistently disagree with the algorithm on {dimension.toLowerCase()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
