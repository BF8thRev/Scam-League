import { X } from 'lucide-react';
import { ROSTERS } from '../data/rosters';

interface Props {
  onClose: () => void;
}

export default function RostersPage({ onClose }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">League Rosters</h1>
          <p className="text-sm text-gray-400 mt-1">{ROSTERS.length} teams • {ROSTERS.reduce((sum, t) => sum + t.players.length, 0)} players</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {ROSTERS.map(roster => (
          <div
            key={roster.team}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
          >
            {/* Team Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
              <h2 className="text-lg font-bold">{roster.team}</h2>
              <p className="text-sm text-emerald-100">{roster.players.length} players</p>
            </div>

            {/* Players Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Player</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Pos</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-300">Team</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-300">Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.players.map((player, idx) => (
                    <tr
                      key={`${roster.team}-${idx}`}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 py-2 text-white">{player.name}</td>
                      <td className="px-4 py-2 text-gray-400 font-mono text-xs">{player.position}</td>
                      <td className="px-4 py-2 text-gray-400 font-mono text-xs">{player.mlbTeam}</td>
                      <td className="px-4 py-2 text-right">
                        <span className="bg-emerald-900/40 text-emerald-300 px-3 py-1 rounded font-mono font-semibold">
                          {player.capValue}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
