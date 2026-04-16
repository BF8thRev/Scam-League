import { ROSTERS } from '../data/rosters';

export interface PlayerRoster {
  fantasyTeam: string;
  capValue: number;
  position: string;
  mlbTeam: string;
}

// Build lookup map from player name to roster info
const buildPlayerLookup = () => {
  const map = new Map<string, PlayerRoster>();

  ROSTERS.forEach(roster => {
    roster.players.forEach(player => {
      // Normalize name for matching (lowercase, remove extra spaces)
      const key = player.name.toLowerCase().trim();
      map.set(key, {
        fantasyTeam: roster.team,
        capValue: player.capValue,
        position: player.position,
        mlbTeam: player.mlbTeam,
      });
    });
  });

  return map;
};

const playerLookup = buildPlayerLookup();

/**
 * Look up a player's roster info (team and cap value) by name
 * Returns null if not found in rosters
 */
export function lookupPlayerRoster(playerName: string): PlayerRoster | null {
  const key = playerName.toLowerCase().trim();
  return playerLookup.get(key) || null;
}
