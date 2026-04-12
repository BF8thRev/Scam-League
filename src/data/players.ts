import { BaseballPlayer } from '../types';

// Pitching projections include: w, sv, cg, so (shutouts), qs, inn, k, er, l, bs
// Batting projections: singles, doubles, triples, hr, rbi, r, bb, k, sb (no CS in scoring)
// Effective batting multipliers: 1B→2, 2B→2.5, 3B→3, HR→5 (H=1 baked in)

export const PLAYERS: BaseballPlayer[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // CATCHERS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'rutschman', name: 'Adley Rutschman', position: 'C', team: 'BAL', age: 27,
    stats: { singles: 90, doubles: 32, triples: 2, hr: 22, rbi: 82, r: 85, bb: 88, k: 98, sb: 4 },
  },
  {
    id: 'raleigh', name: 'Cal Raleigh', position: 'C', team: 'SEA', age: 28,
    stats: { singles: 70, doubles: 24, triples: 1, hr: 34, rbi: 92, r: 80, bb: 55, k: 142, sb: 1 },
  },
  {
    id: 'wsmith', name: 'Will Smith', position: 'C', team: 'LAD', age: 29,
    stats: { singles: 80, doubles: 25, triples: 1, hr: 22, rbi: 78, r: 75, bb: 60, k: 100, sb: 3 },
  },
  {
    id: 'realmuto', name: 'J.T. Realmuto', position: 'C', team: 'PHI', age: 34,
    stats: { singles: 74, doubles: 22, triples: 2, hr: 18, rbi: 68, r: 68, bb: 44, k: 102, sb: 14 },
  },
  {
    id: 'moreno', name: 'Gabriel Moreno', position: 'C', team: 'ARI', age: 24,
    stats: { singles: 85, doubles: 22, triples: 2, hr: 12, rbi: 58, r: 60, bb: 35, k: 75, sb: 8 },
  },
  {
    id: 'kirk', name: 'Alejandro Kirk', position: 'C', team: 'TOR', age: 26,
    stats: { singles: 88, doubles: 22, triples: 0, hr: 14, rbi: 65, r: 60, bb: 55, k: 68, sb: 0 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FIRST BASE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'freeman', name: 'Freddie Freeman', position: '1B', team: 'LAD', age: 35,
    stats: { singles: 100, doubles: 38, triples: 3, hr: 22, rbi: 92, r: 92, bb: 84, k: 98, sb: 8 },
  },
  {
    id: 'vlad', name: 'Vladimir Guerrero Jr.', position: '1B', team: 'TOR', age: 26,
    stats: { singles: 95, doubles: 35, triples: 2, hr: 36, rbi: 114, r: 98, bb: 78, k: 118, sb: 5 },
  },
  {
    id: 'alonso', name: 'Pete Alonso', position: '1B', team: 'NYM', age: 30,
    stats: { singles: 74, doubles: 27, triples: 1, hr: 42, rbi: 120, r: 88, bb: 82, k: 138, sb: 2 },
  },
  {
    id: 'olson', name: 'Matt Olson', position: '1B', team: 'ATL', age: 31,
    stats: { singles: 78, doubles: 30, triples: 2, hr: 38, rbi: 112, r: 90, bb: 80, k: 148, sb: 4 },
  },
  {
    id: 'walker', name: 'Christian Walker', position: '1B', team: 'ARI', age: 33,
    stats: { singles: 75, doubles: 28, triples: 2, hr: 30, rbi: 92, r: 82, bb: 60, k: 130, sb: 5 },
  },
  {
    id: 'torkelson', name: 'Spencer Torkelson', position: '1B', team: 'DET', age: 25,
    stats: { singles: 70, doubles: 24, triples: 1, hr: 26, rbi: 82, r: 75, bb: 68, k: 145, sb: 2 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SECOND BASE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'altuve', name: 'Jose Altuve', position: '2B', team: 'HOU', age: 35,
    stats: { singles: 84, doubles: 27, triples: 3, hr: 20, rbi: 72, r: 85, bb: 56, k: 90, sb: 12 },
  },
  {
    id: 'albies', name: 'Ozzie Albies', position: '2B', team: 'ATL', age: 28,
    stats: { singles: 90, doubles: 32, triples: 5, hr: 28, rbi: 92, r: 98, bb: 48, k: 108, sb: 20 },
  },
  {
    id: 'marte', name: 'Ketel Marte', position: '2B', team: 'ARI', age: 31,
    stats: { singles: 88, doubles: 28, triples: 3, hr: 24, rbi: 82, r: 88, bb: 62, k: 112, sb: 12 },
  },
  {
    id: 'semien', name: 'Marcus Semien', position: '2B', team: 'TEX', age: 35,
    stats: { singles: 87, doubles: 30, triples: 3, hr: 24, rbi: 82, r: 98, bb: 52, k: 118, sb: 15 },
  },
  {
    id: 'gimenez', name: 'Andrés Giménez', position: '2B', team: 'CLE', age: 26,
    stats: { singles: 82, doubles: 28, triples: 3, hr: 16, rbi: 65, r: 82, bb: 52, k: 102, sb: 22 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SHORTSTOP
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'bwitt', name: 'Bobby Witt Jr.', position: 'SS', team: 'KC', age: 25,
    stats: { singles: 100, doubles: 38, triples: 8, hr: 28, rbi: 98, r: 112, bb: 50, k: 140, sb: 42 },
  },
  {
    id: 'ghenderson', name: 'Gunnar Henderson', position: 'SS', team: 'BAL', age: 24,
    stats: { singles: 85, doubles: 36, triples: 5, hr: 36, rbi: 106, r: 108, bb: 78, k: 135, sb: 18 },
  },
  {
    id: 'edc', name: 'Elly De La Cruz', position: 'SS', team: 'CIN', age: 23,
    // High K rate costs big in this system; elite SB partially offsets
    stats: { singles: 80, doubles: 25, triples: 9, hr: 26, rbi: 82, r: 108, bb: 52, k: 178, sb: 68 },
  },
  {
    id: 'lindor', name: 'Francisco Lindor', position: 'SS', team: 'NYM', age: 31,
    stats: { singles: 88, doubles: 30, triples: 3, hr: 28, rbi: 92, r: 98, bb: 68, k: 125, sb: 25 },
  },
  {
    id: 'seager', name: 'Corey Seager', position: 'SS', team: 'TEX', age: 31,
    stats: { singles: 84, doubles: 30, triples: 2, hr: 32, rbi: 95, r: 88, bb: 70, k: 130, sb: 4 },
  },
  {
    id: 'tturner', name: 'Trea Turner', position: 'SS', team: 'PHI', age: 32,
    stats: { singles: 94, doubles: 27, triples: 5, hr: 20, rbi: 75, r: 105, bb: 50, k: 120, sb: 30 },
  },
  {
    id: 'holliday', name: 'Jackson Holliday', position: 'SS', team: 'BAL', age: 21,
    stats: { singles: 78, doubles: 26, triples: 4, hr: 16, rbi: 68, r: 85, bb: 64, k: 130, sb: 14 },
  },
  {
    id: 'abrams', name: 'CJ Abrams', position: 'SS', team: 'WAS', age: 24,
    stats: { singles: 88, doubles: 24, triples: 5, hr: 18, rbi: 68, r: 95, bb: 45, k: 138, sb: 40 },
    rebuilder: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // THIRD BASE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'jramirez', name: 'José Ramírez', position: '3B', team: 'CLE', age: 32,
    stats: { singles: 88, doubles: 38, triples: 4, hr: 32, rbi: 108, r: 105, bb: 74, k: 90, sb: 22 },
  },
  {
    id: 'machado', name: 'Manny Machado', position: '3B', team: 'SD', age: 32,
    stats: { singles: 88, doubles: 30, triples: 2, hr: 28, rbi: 92, r: 90, bb: 72, k: 118, sb: 8 },
  },
  {
    id: 'riley', name: 'Austin Riley', position: '3B', team: 'ATL', age: 28,
    stats: { singles: 82, doubles: 32, triples: 3, hr: 32, rbi: 100, r: 92, bb: 58, k: 138, sb: 5 },
  },
  {
    id: 'bregman', name: 'Alex Bregman', position: '3B', team: 'BOS', age: 31,
    stats: { singles: 85, doubles: 38, triples: 2, hr: 22, rbi: 88, r: 90, bb: 82, k: 95, sb: 6 },
  },
  {
    id: 'arenado', name: 'Nolan Arenado', position: '3B', team: 'STL', age: 34,
    stats: { singles: 80, doubles: 27, triples: 2, hr: 24, rbi: 88, r: 80, bb: 50, k: 105, sb: 3 },
  },
  {
    id: 'hayes', name: "Ke'Bryan Hayes", position: '3B', team: 'PIT', age: 28,
    stats: { singles: 85, doubles: 28, triples: 4, hr: 14, rbi: 65, r: 78, bb: 52, k: 108, sb: 14 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // OUTFIELD
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'soto', name: 'Juan Soto', position: 'OF', team: 'NYM', age: 26,
    stats: { singles: 90, doubles: 34, triples: 2, hr: 38, rbi: 112, r: 112, bb: 128, k: 110, sb: 6 },
  },
  {
    id: 'acuna', name: 'Ronald Acuña Jr.', position: 'OF', team: 'ATL', age: 27,
    stats: { singles: 92, doubles: 28, triples: 5, hr: 35, rbi: 98, r: 118, bb: 78, k: 122, sb: 62 },
  },
  {
    id: 'yordan', name: 'Yordan Alvarez', position: 'OF', team: 'HOU', age: 28,
    stats: { singles: 78, doubles: 35, triples: 1, hr: 42, rbi: 120, r: 100, bb: 90, k: 128, sb: 2 },
  },
  {
    id: 'betts', name: 'Mookie Betts', position: 'OF', team: 'LAD', age: 32,
    stats: { singles: 88, doubles: 32, triples: 3, hr: 26, rbi: 92, r: 108, bb: 72, k: 92, sb: 14 },
  },
  {
    id: 'tucker', name: 'Kyle Tucker', position: 'OF', team: 'HOU', age: 28,
    stats: { singles: 88, doubles: 36, triples: 4, hr: 30, rbi: 98, r: 100, bb: 84, k: 128, sb: 22 },
  },
  {
    id: 'jrod', name: 'Julio Rodríguez', position: 'OF', team: 'SEA', age: 24,
    stats: { singles: 92, doubles: 30, triples: 5, hr: 28, rbi: 92, r: 105, bb: 58, k: 148, sb: 36 },
  },
  {
    id: 'carroll', name: 'Corbin Carroll', position: 'OF', team: 'ARI', age: 24,
    stats: { singles: 88, doubles: 26, triples: 5, hr: 20, rbi: 72, r: 102, bb: 65, k: 120, sb: 46 },
  },
  {
    id: 'mharris', name: 'Michael Harris II', position: 'OF', team: 'ATL', age: 24,
    stats: { singles: 85, doubles: 26, triples: 4, hr: 22, rbi: 80, r: 90, bb: 42, k: 115, sb: 28 },
  },
  {
    id: 'chourio', name: 'Jackson Chourio', position: 'OF', team: 'MIL', age: 21,
    stats: { singles: 82, doubles: 24, triples: 5, hr: 22, rbi: 78, r: 92, bb: 38, k: 128, sb: 32 },
  },
  {
    id: 'larsn', name: 'Lars Nootbaar', position: 'OF', team: 'STL', age: 27,
    stats: { singles: 78, doubles: 22, triples: 3, hr: 18, rbi: 65, r: 82, bb: 75, k: 122, sb: 12 },
  },
  {
    id: 'arozarena', name: 'Randy Arozarena', position: 'OF', team: 'SEA', age: 30,
    stats: { singles: 80, doubles: 25, triples: 3, hr: 20, rbi: 72, r: 85, bb: 55, k: 132, sb: 28 },
  },
  {
    id: 'oneill', name: "Tyler O'Neill", position: 'OF', team: 'BOS', age: 29,
    stats: { singles: 72, doubles: 22, triples: 2, hr: 26, rbi: 75, r: 80, bb: 50, k: 140, sb: 10 },
  },
  {
    id: 'trout', name: 'Mike Trout', position: 'OF', team: 'LAA', age: 33,
    // Persistent injury risk; projecting partial season
    stats: { singles: 68, doubles: 20, triples: 1, hr: 22, rbi: 72, r: 72, bb: 80, k: 122, sb: 6 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DH
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'ohtani-bat', name: 'Shohei Ohtani (bat)', position: 'DH', team: 'LAD', age: 30,
    stats: { singles: 82, doubles: 30, triples: 3, hr: 48, rbi: 128, r: 112, bb: 98, k: 122, sb: 30 },
  },
  {
    id: 'ozuna', name: 'Marcell Ozuna', position: 'DH', team: 'ATL', age: 34,
    stats: { singles: 72, doubles: 22, triples: 1, hr: 28, rbi: 88, r: 72, bb: 48, k: 138, sb: 2 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // STARTING PITCHERS
  // w, sv, cg, so(shutouts), qs, inn, k, er, l, bs
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'skubal', name: 'Tarik Skubal', position: 'SP', team: 'DET', age: 28,
    // DET is a contender; elite K rate; ace profile
    stats: { w: 15, sv: 0, cg: 2, so: 2, qs: 30, inn: 192, k: 235, er: 62, l: 7, bs: 0 },
  },
  {
    id: 'gcole', name: 'Gerrit Cole', position: 'SP', team: 'NYY', age: 34,
    stats: { w: 14, sv: 0, cg: 1, so: 1, qs: 28, inn: 195, k: 218, er: 68, l: 8, bs: 0 },
  },
  {
    id: 'zwheeler', name: 'Zack Wheeler', position: 'SP', team: 'PHI', age: 35,
    // Elite workhorse but age 35 steep decline incoming
    stats: { w: 14, sv: 0, cg: 2, so: 2, qs: 29, inn: 200, k: 210, er: 70, l: 8, bs: 0 },
  },
  {
    id: 'yamamoto', name: 'Yoshinobu Yamamoto', position: 'SP', team: 'LAD', age: 27,
    stats: { w: 14, sv: 0, cg: 2, so: 2, qs: 28, inn: 188, k: 215, er: 65, l: 7, bs: 0 },
  },
  {
    id: 'burnes', name: 'Corbin Burnes', position: 'SP', team: 'BAL', age: 30,
    stats: { w: 14, sv: 0, cg: 1, so: 1, qs: 28, inn: 188, k: 215, er: 70, l: 8, bs: 0 },
  },
  {
    id: 'skenes', name: 'Paul Skenes', position: 'SP', team: 'PIT', age: 22,
    // PIT is rebuilding → W ceiling capped; elite stuff but bad team
    rebuilder: true,
    stats: { w: 11, sv: 0, cg: 1, so: 1, qs: 26, inn: 178, k: 222, er: 58, l: 10, bs: 0 },
  },
  {
    id: 'lwebb', name: 'Logan Webb', position: 'SP', team: 'SF', age: 28,
    // CG workhorse; SF middling context
    stats: { w: 13, sv: 0, cg: 3, so: 1, qs: 28, inn: 195, k: 178, er: 72, l: 8, bs: 0 },
  },
  {
    id: 'fried', name: 'Max Fried', position: 'SP', team: 'NYY', age: 31,
    stats: { w: 13, sv: 0, cg: 1, so: 1, qs: 27, inn: 182, k: 178, er: 70, l: 8, bs: 0 },
  },
  {
    id: 'strider', name: 'Spencer Strider', position: 'SP', team: 'ATL', age: 26,
    // Below 176 INN → IP ceiling warning fires; coming back from TJ
    stats: { w: 13, sv: 0, cg: 1, so: 1, qs: 24, inn: 168, k: 215, er: 58, l: 7, bs: 0 },
  },
  {
    id: 'cease', name: 'Dylan Cease', position: 'SP', team: 'SD', age: 29,
    stats: { w: 13, sv: 0, cg: 1, so: 0, qs: 25, inn: 182, k: 210, er: 82, l: 9, bs: 0 },
  },
  {
    id: 'alcantara', name: 'Sandy Alcantara', position: 'SP', team: 'MIA', age: 29,
    // MIA rebuilding → win totals capped; CG/SO bonuses help offset
    rebuilder: true,
    stats: { w: 11, sv: 0, cg: 4, so: 2, qs: 26, inn: 198, k: 162, er: 78, l: 11, bs: 0 },
  },
  {
    id: 'imanaga', name: 'Shota Imanaga', position: 'SP', team: 'CHC', age: 31,
    stats: { w: 12, sv: 0, cg: 0, so: 0, qs: 25, inn: 170, k: 185, er: 65, l: 9, bs: 0 },
  },
  {
    id: 'peralta', name: 'Freddy Peralta', position: 'SP', team: 'MIL', age: 28,
    // Below 176 INN → ceiling risk fires
    stats: { w: 12, sv: 0, cg: 0, so: 0, qs: 22, inn: 162, k: 198, er: 62, l: 8, bs: 0 },
  },
  {
    id: 'gausman', name: 'Kevin Gausman', position: 'SP', team: 'TOR', age: 34,
    stats: { w: 12, sv: 0, cg: 1, so: 1, qs: 26, inn: 178, k: 192, er: 72, l: 9, bs: 0 },
  },
  {
    id: 'glasnow', name: 'Tyler Glasnow', position: 'SP', team: 'LAD', age: 32,
    // Below 176 → IP ceiling; fragile health history
    stats: { w: 11, sv: 0, cg: 1, so: 1, qs: 22, inn: 155, k: 198, er: 60, l: 8, bs: 0 },
  },
  {
    id: 'nola', name: 'Aaron Nola', position: 'SP', team: 'PHI', age: 31,
    stats: { w: 13, sv: 0, cg: 1, so: 1, qs: 27, inn: 188, k: 188, er: 78, l: 9, bs: 0 },
  },
  {
    id: 'lopez', name: 'Pablo López', position: 'SP', team: 'MIN', age: 28,
    stats: { w: 12, sv: 0, cg: 2, so: 1, qs: 26, inn: 178, k: 172, er: 72, l: 8, bs: 0 },
  },
  {
    id: 'sale', name: 'Chris Sale', position: 'SP', team: 'ATL', age: 36,
    // Below 176 at 36 — IP ceiling + age decline
    stats: { w: 11, sv: 0, cg: 1, so: 1, qs: 22, inn: 158, k: 195, er: 62, l: 8, bs: 0 },
  },
  {
    id: 'bieber', name: 'Shane Bieber', position: 'SP', team: 'CLE', age: 29,
    stats: { w: 13, sv: 0, cg: 1, so: 1, qs: 27, inn: 185, k: 188, er: 72, l: 8, bs: 0 },
  },
  {
    id: 'ohtani-pit', name: 'Shohei Ohtani (SP)', position: 'SP', team: 'LAD', age: 30,
    // Post-TJ 2025; strong team context
    stats: { w: 13, sv: 0, cg: 1, so: 1, qs: 26, inn: 180, k: 210, er: 62, l: 7, bs: 0 },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RELIEF PITCHERS
  // w, sv, cg(0), so(0), qs(0), inn, k, er, l, bs
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'clase', name: 'Emmanuel Clase', position: 'RP', team: 'CLE', age: 27,
    // Elite closer; low K but elite contact suppression
    stats: { w: 3, sv: 42, cg: 0, so: 0, qs: 0, inn: 68, k: 72, er: 20, l: 4, bs: 4 },
  },
  {
    id: 'helsley', name: 'Ryan Helsley', position: 'RP', team: 'STL', age: 30,
    stats: { w: 4, sv: 40, cg: 0, so: 0, qs: 0, inn: 65, k: 78, er: 22, l: 5, bs: 5 },
  },
  {
    id: 'fbautista', name: 'Félix Bautista', position: 'RP', team: 'BAL', age: 29,
    stats: { w: 3, sv: 36, cg: 0, so: 0, qs: 0, inn: 60, k: 82, er: 18, l: 4, bs: 4 },
  },
  {
    id: 'hader', name: 'Josh Hader', position: 'RP', team: 'HOU', age: 30,
    stats: { w: 3, sv: 38, cg: 0, so: 0, qs: 0, inn: 62, k: 88, er: 22, l: 5, bs: 5 },
  },
  {
    id: 'diaz', name: 'Edwin Díaz', position: 'RP', team: 'NYM', age: 31,
    // BS risk is high for Diaz historically; W=25 system makes BS=-15 brutal
    stats: { w: 3, sv: 35, cg: 0, so: 0, qs: 0, inn: 62, k: 90, er: 22, l: 4, bs: 6 },
  },
  {
    id: 'mmiller', name: 'Mason Miller', position: 'RP', team: 'OAK', age: 26,
    rebuilder: true,
    stats: { w: 3, sv: 35, cg: 0, so: 0, qs: 0, inn: 60, k: 88, er: 20, l: 4, bs: 5 },
  },
  {
    id: 'doval', name: 'Camilo Doval', position: 'RP', team: 'SF', age: 27,
    stats: { w: 3, sv: 32, cg: 0, so: 0, qs: 0, inn: 60, k: 78, er: 22, l: 5, bs: 6 },
  },
  {
    id: 'munoz', name: 'Andrés Muñoz', position: 'RP', team: 'SEA', age: 25,
    stats: { w: 3, sv: 32, cg: 0, so: 0, qs: 0, inn: 62, k: 80, er: 20, l: 4, bs: 5 },
  },
  {
    id: 'bednar', name: 'David Bednar', position: 'RP', team: 'PIT', age: 30,
    rebuilder: true,
    stats: { w: 3, sv: 30, cg: 0, so: 0, qs: 0, inn: 62, k: 76, er: 22, l: 5, bs: 6 },
  },
  {
    id: 'holmes', name: 'Clay Holmes', position: 'RP', team: 'NYY', age: 32,
    // 7 BS is devastating in this system: 7*15=105 pts lost
    stats: { w: 4, sv: 30, cg: 0, so: 0, qs: 0, inn: 62, k: 70, er: 25, l: 5, bs: 7 },
  },
  {
    id: 'phillipse', name: 'Evan Phillips', position: 'RP', team: 'LAD', age: 30,
    stats: { w: 3, sv: 28, cg: 0, so: 0, qs: 0, inn: 60, k: 72, er: 20, l: 4, bs: 5 },
  },
  {
    id: 'romano', name: 'Jordan Romano', position: 'RP', team: 'TOR', age: 31,
    stats: { w: 3, sv: 28, cg: 0, so: 0, qs: 0, inn: 58, k: 68, er: 22, l: 5, bs: 6 },
  },
];
