import { Plus } from 'lucide-react';
import { BaseballPlayer } from '../types';
import { analyzeSide, MARKET_RATE } from '../lib/scoring';
import PlayerSearch from './PlayerSearch';
import TradeSlot from './TradeSlot';

export interface PanelSlot {
  player: BaseballPlayer;
  cap: number;
}

interface Props {
  label: string;
  color: 'blue' | 'emerald';
  slots: PanelSlot[];
  allUsedIds: Set<string>;
  onAdd: (player: BaseballPlayer) => void;
  onCapChange: (idx: number, cap: number) => void;
  onRemove: (idx: number) => void;
}

const LABEL_COLOR = {
  blue:    'text-blue-400 border-blue-500/30 bg-blue-500/10',
  emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
};

export default function TradePanel({ label, color, slots, allUsedIds, onAdd, onCapChange, onRemove }: Props) {
  const side = analyzeSide(slots);
  const totalDynSurplus = side.dynSurplus;

  return (
    <div className="flex flex-col gap-3">
      {/* Panel header */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${LABEL_COLOR[color]}`}>
        <span className="font-bold text-sm">{label}</span>
        {slots.length > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-gray-400">{side.totalPts.toFixed(0)} pts</span>
            <span className="text-gray-500">${side.totalCap} cap</span>
            <span className={totalDynSurplus >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              3yr {totalDynSurplus >= 0 ? '+' : ''}{totalDynSurplus.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Player slots */}
      {slots.map((slot, i) => (
        <TradeSlot
          key={slot.player.id}
          player={slot.player}
          cap={slot.cap}
          onCapChange={cap => onCapChange(i, cap)}
          onRemove={() => onRemove(i)}
        />
      ))}

      {/* Search / add */}
      {slots.length < 6 && (
        <div className="relative">
          <PlayerSearch
            usedIds={allUsedIds}
            onSelect={onAdd}
            placeholder="Add player…"
          />
          <Plus size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        </div>
      )}

      {/* Side totals */}
      {slots.length > 0 && (
        <div className="bg-gray-900 border border-gray-700/50 rounded-lg px-3 py-2 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500">Proj. Pts</p>
            <p className="text-sm font-bold text-white font-mono">{side.totalPts.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Market Val</p>
            <p className="text-sm font-bold text-white font-mono">${(side.totalPts / MARKET_RATE).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Surplus</p>
            <p className={`text-sm font-bold font-mono ${side.totalSurplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {side.totalSurplus >= 0 ? '+' : ''}{side.totalSurplus.toFixed(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
