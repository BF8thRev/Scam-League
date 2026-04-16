import { DimensionScores } from '../types';

interface Props {
  scores: DimensionScores;
  adminOpinion?: number;
  adminComment?: string;
}

const DIMENSION_LABELS = {
  cap_efficiency: 'Cap Efficiency',
  position_value: 'Position Value',
  mlb_team_context: 'MLB Team Context',
  dynasty_outlook: 'Dynasty Outlook',
  season_timing: 'Season Timing',
};

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-emerald-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 4) return 'text-orange-400';
  return 'text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-emerald-500/20';
  if (score >= 6) return 'bg-yellow-500/20';
  if (score >= 4) return 'bg-orange-500/20';
  return 'bg-red-500/20';
}

function getGrade(score: number): string {
  if (score >= 9) return 'A+';
  if (score >= 8) return 'A';
  if (score >= 7) return 'B+';
  if (score >= 6) return 'B';
  if (score >= 5) return 'C+';
  if (score >= 4) return 'C';
  if (score >= 3) return 'D';
  return 'F';
}

export default function TradeRatingCard({ scores, adminOpinion, adminComment }: Props) {
  const dimensions = [
    { key: 'cap_efficiency' as const, label: DIMENSION_LABELS.cap_efficiency, value: scores.cap_efficiency },
    { key: 'position_value' as const, label: DIMENSION_LABELS.position_value, value: scores.position_value },
    { key: 'mlb_team_context' as const, label: DIMENSION_LABELS.mlb_team_context, value: scores.mlb_team_context },
    { key: 'dynasty_outlook' as const, label: DIMENSION_LABELS.dynasty_outlook, value: scores.dynasty_outlook },
    { key: 'season_timing' as const, label: DIMENSION_LABELS.season_timing, value: scores.season_timing },
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 space-y-4">
      {/* Composite Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">COMPOSITE RATING</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${getScoreColor(scores.composite_score)}`}>
              {scores.composite_score.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">/10</span>
            <span className={`text-sm font-bold ml-2 px-2 py-0.5 rounded ${getScoreBg(scores.composite_score)} ${getScoreColor(scores.composite_score)}`}>
              {getGrade(scores.composite_score)}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">RISK SCORE</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold ${getScoreColor(scores.risk_score)}`}>
              {scores.risk_score.toFixed(1)}
            </span>
            <span className="text-xs text-gray-600">/10</span>
          </div>
        </div>
      </div>

      {/* Dimension Breakdown */}
      <div className="space-y-2">
        <p className="text-xs text-gray-600 font-semibold">DIMENSION BREAKDOWN</p>
        {dimensions.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400 flex-1">{label}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getScoreBg(value).replace('/20', '/100')}`}
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-mono font-bold w-8 text-right ${getScoreColor(value)}`}>
                {value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Opinion */}
      {(adminOpinion !== undefined || adminComment) && (
        <div className="border-t border-gray-700/30 pt-3">
          <p className="text-xs text-gray-600 font-semibold mb-2">YOUR SECRET SAUCE</p>
          <div className="flex items-start gap-2">
            {adminOpinion !== undefined && (
              <div className="flex flex-col items-center">
                <span className={`text-sm font-black ${getScoreColor(adminOpinion)}`}>
                  {adminOpinion}
                </span>
                <span className="text-xs text-gray-600">/10</span>
              </div>
            )}
            {adminComment && (
              <p className="text-xs text-gray-400 italic flex-1">"{adminComment}"</p>
            )}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="text-xs text-gray-600 border-t border-gray-700/30 pt-3 space-y-1">
        <p>• <strong>Composite:</strong> Your opinion (10%) + algorithm's 5 factors (cap, position, timing, MLB context, dynasty)</p>
        <p>• <strong>Risk:</strong> Separate from value — shows downside exposure independent of fair value</p>
      </div>
    </div>
  );
}
