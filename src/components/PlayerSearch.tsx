import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { BaseballPlayer, Position } from '../types';
import { PLAYERS } from '../data/players';
import { calcPts } from '../lib/scoring';

const POS_COLOR: Record<Position, string> = {
  C:   'text-sky-400',
  '1B':'text-green-400',
  '2B':'text-green-300',
  SS:  'text-yellow-400',
  '3B':'text-orange-400',
  OF:  'text-blue-400',
  SP:  'text-red-400',
  RP:  'text-pink-400',
  DH:  'text-purple-400',
};

interface Props {
  usedIds: Set<string>;
  onSelect: (player: BaseballPlayer) => void;
  placeholder?: string;
}

export default function PlayerSearch({ usedIds, onSelect, placeholder = 'Search players…' }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.trim().length < 1
    ? []
    : PLAYERS
        .filter(p => !usedIds.has(p.id) && p.name.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => calcPts(b) - calcPts(a))
        .slice(0, 10);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function pick(player: BaseballPlayer) {
    onSelect(player);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 focus-within:border-emerald-500 transition-colors">
        <Search size={14} className="text-gray-500 flex-shrink-0" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="bg-transparent text-sm text-white placeholder-gray-600 outline-none w-full"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 top-full mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          {results.map(p => (
            <li key={p.id}>
              <button
                onMouseDown={e => { e.preventDefault(); pick(p); }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-800 transition-colors text-left gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs font-bold w-8 flex-shrink-0 ${POS_COLOR[p.position]}`}>
                    {p.position}
                  </span>
                  <span className="text-sm text-white truncate">{p.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{p.team}</span>
                </div>
                <span className="text-xs font-mono text-gray-400 flex-shrink-0">
                  {calcPts(p).toFixed(0)} pts
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim().length >= 1 && results.length === 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-3">
          <p className="text-sm text-gray-500">No players found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
