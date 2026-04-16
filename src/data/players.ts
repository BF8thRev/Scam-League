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

{ id: 'ronaldacunajr', name: "Ronald Acuna Jr.", position: 'OF', team: 'ATL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'oneilcruz', name: "Oneil Cruz", position: 'OF', team: 'PIT', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'tylersoderstrom', name: "Tyler Soderstrom", position: 'DH', team: 'ATH', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jordanwalker', name: "Jordan Walker", position: 'DH', team: 'STL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jjwetherholt', name: "JJ Wetherholt", position: 'SS', team: 'STL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jaccaglianone', name: "Jac Caglianone", position: 'OF', team: 'KC', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'coltoncowser', name: "Colton Cowser", position: 'OF', team: 'BAL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'junghoolee', name: "Jung Hoo Lee", position: 'OF', team: 'SF', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'noelvimarte', name: "Noelvi Marte", position: 'OF', team: 'CIN', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'wyattlangford', name: "Wyatt Langford", position: 'DH', team: 'TEX', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'aidanmiller', name: "Aidan Miller", position: 'SS', team: 'PHI', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'coltemerson', name: "Colt Emerson", position: 'DH', team: 'SEA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'kodaisenga', name: "Kodai Senga", position: 'SP', team: 'NYM', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'gavinwilliams', name: "Gavin Williams", position: 'SP', team: 'CLE', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'tannerbibee', name: "Tanner Bibee", position: 'SP', team: 'CLE', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'kyleharrison', name: "Kyle Harrison", position: 'SP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jacobmisiorowski', name: "Jacob Misiorowski", position: 'SP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'kumarrocker', name: "Kumar Rocker", position: 'SP', team: 'TEX', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'trevorrogers', name: "Trevor Rogers", position: 'SP', team: 'BAL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'josesoriano', name: "Jose Soriano", position: 'SP', team: 'LAA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'joemusgrove', name: "Joe Musgrove", position: 'SP', team: 'SD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'dansbyswanson', name: "Dansby Swanson", position: 'SS', team: 'CHC', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'justincrawford', name: "Justin Crawford", position: 'OF', team: 'PHI', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'adolisgarcia', name: "Adolis Garcia", position: 'OF', team: 'PHI', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'andypages', name: "Andy Pages", position: 'OF', team: 'LAD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'willyadames', name: "Willy Adames", position: 'DH', team: 'SF', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ajgarcia', name: "AJ Garcia", position: 'OF', team: 'Unaffiliated', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'lawrencebutler', name: "Lawrence Butler", position: 'OF', team: 'ATH', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'tylerbell', name: "Tyler Bell", position: 'DH', team: 'Unaffiliated', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'hunterbrown', name: "Hunter Brown", position: 'SP', team: 'HOU', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'rynenelson', name: "Ryne Nelson", position: 'SP', team: 'ARI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'michaelwacha', name: "Michael Wacha", position: 'SP', team: 'KC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'emiliopagan', name: "Emilio Pagan", position: 'RP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'matthewboyd', name: "Matthew Boyd", position: 'SP', team: 'CHC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'tylerbremner', name: "Tyler Bremner", position: 'SP', team: 'LAA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'connellyearly', name: "Connelly Early", position: 'SP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'merrillkelly', name: "Merrill Kelly", position: 'SP', team: 'ARI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'davidpeterson', name: "David Peterson", position: 'SP', team: 'NYM', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jamesontaillon', name: "Jameson Taillon", position: 'SP', team: 'CHC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'treyyesavage', name: "Trey Yesavage", position: 'SP', team: 'TOR', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'trevormegill', name: "Trevor Megill", position: 'RP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'geraldoperdomo', name: "Geraldo Perdomo", position: 'SS', team: 'ARI', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'juliorodriguez', name: "Julio Rodriguez", position: 'OF', team: 'SEA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'georgespringer', name: "George Springer", position: 'OF', team: 'TOR', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'rafaeldevers', name: "Rafael Devers", position: 'DH', team: 'SF', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'christianyelich', name: "Christian Yelich", position: 'DH', team: 'MIL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'masynwinn', name: "Masyn Winn", position: 'SS', team: 'STL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'joshuabaez', name: "Joshua Baez", position: 'OF', team: 'STL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'daylenlile', name: "Daylen Lile", position: 'OF', team: 'WAS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'eduardoquintero', name: "Eduardo Quintero", position: 'OF', team: 'LAD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'rochcholowsky', name: "Roch Cholowsky", position: 'DH', team: 'Unaffiliated', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'seiyasuzuki', name: "Seiya Suzuki", position: 'DH', team: 'CHC', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'shanebaz', name: "Shane Baz", position: 'SP', team: 'BAL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'tajbradley', name: "Taj Bradley", position: 'SP', team: 'MIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'sonnygray', name: "Sonny Gray", position: 'SP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'nickpivetta', name: "Nick Pivetta", position: 'SP', team: 'SD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jhoanduran', name: "Jhoan Duran", position: 'RP', team: 'PHI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'joseberrios', name: "Jose Berrios", position: 'SP', team: 'TOR', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'adrianhouser', name: "Adrian Houser", position: 'SP', team: 'SF', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jacksonflora', name: "Jackson Flora", position: 'SP', team: 'Unaffiliated', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'nicklodolo', name: "Nick Lodolo", position: 'SP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'willwarren', name: "Will Warren", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'braxtonashcraft', name: "Braxton Ashcraft", position: 'RP', team: 'PIT', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'reiddetmers', name: "Reid Detmers", position: 'RP', team: 'LAA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'kenleyjansen', name: "Kenley Jansen", position: 'RP', team: 'DET', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'paytontolle', name: "Payton Tolle", position: 'RP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'bobichette', name: "Bo Bichette", position: 'SS', team: 'NYM', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'kerrycarpenter', name: "Kerry Carpenter", position: 'OF', team: 'DET', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'taylorward', name: "Taylor Ward", position: 'OF', team: 'BAL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'joshualowe', name: "Joshua Lowe", position: 'OF', team: 'LAA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'kylestowers', name: "Kyle Stowers", position: 'OF', team: 'MIA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jorgepolanco', name: "Jorge Polanco", position: 'DH', team: 'NYM', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'brycerainer', name: "Bryce Rainer", position: 'SS', team: 'DET', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'edwardflorentino', name: "Edward Florentino", position: 'OF', team: 'PIT', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'lazaromontes', name: "Lazaro Montes", position: 'OF', team: 'SEA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'garrettcrochet', name: "Garrett Crochet", position: 'SP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'mitchkeller', name: "Mitch Keller", position: 'SP', team: 'PIT', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'mikesoroka', name: "Mike Soroka", position: 'SP', team: 'ARI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jacobdegrom', name: "Jacob deGrom", position: 'SP', team: 'TEX', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'raiseliglesias', name: "Raisel Iglesias", position: 'RP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'walkerbuehler', name: "Walker Buehler", position: 'SP', team: 'SD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'dustinmay', name: "Dustin May", position: 'SP', team: 'STL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'justinverlander', name: "Justin Verlander", position: 'SP', team: 'DET', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'stevenmatz', name: "Steven Matz", position: 'RP', team: 'TB', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'robertsuarez', name: "Robert Suarez", position: 'RP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'ryanwalker', name: "Ryan Walker", position: 'RP', team: 'SF', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'travissykora', name: "Travis Sykora", position: 'SP', team: 'WAS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'zacharyneto', name: "Zachary Neto", position: 'SS', team: 'LAA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'wilyerabreu', name: "Wilyer Abreu", position: 'OF', team: 'BOS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'teoscarhernandez', name: "Teoscar Hernandez", position: 'OF', team: 'LAD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ramonlaureano', name: "Ramon Laureano", position: 'OF', team: 'SD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'franklinarias', name: "Franklin Arias", position: 'SS', team: 'BOS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'joshhsmith', name: "Josh H. Smith", position: 'SS', team: 'TEX', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jettwilliams', name: "Jett Williams", position: 'SS', team: 'MIL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'daultonvarsho', name: "Daulton Varsho", position: 'OF', team: 'TOR', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'trentgrisham', name: "Trent Grisham", position: 'DH', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'grantholmes', name: "Grant Holmes", position: 'SP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'michaelking', name: "Michael King", position: 'SP', team: 'SD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jackleiter', name: "Jack Leiter", position: 'SP', team: 'TEX', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'maxscherzer', name: "Max Scherzer", position: 'SP', team: 'TOR', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'andresmunoz', name: "Andres Munoz", position: 'RP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'brayanbello', name: "Brayan Bello", position: 'SP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'loganhenderson', name: "Logan Henderson", position: 'SP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'cristianjavier', name: "Cristian Javier", position: 'SP', team: 'HOU', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'shanemcclanahan', name: "Shane McClanahan", position: 'SP', team: 'TB', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'ryanpepiot', name: "Ryan Pepiot", position: 'SP', team: 'TB', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'bradysinger', name: "Brady Singer", position: 'SP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'ryansloan', name: "Ryan Sloan", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'ajsmithshawver', name: "A.J. Smith-Shawver", position: 'SP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'blakesnell', name: "Blake Snell", position: 'SP', team: 'LAD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'cjabrams', name: "C.J. Abrams", position: 'SS', team: 'WAS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'luisrobert', name: "Luis Robert", position: 'OF', team: 'NYM', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jameswood', name: "James Wood", position: 'OF', team: 'WAS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'carloscorrea', name: "Carlos Correa", position: 'DH', team: 'HOU', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'daxkilby', name: "Dax Kilby", position: 'SS', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'evancarter', name: "Evan Carter", position: 'OF', team: 'TEX', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'denzelclarke', name: "Denzel Clarke", position: 'OF', team: 'ATH', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jakobmarsee', name: "Jakob Marsee", position: 'OF', team: 'MIA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ceddannerafaela', name: "Ceddanne Rafaela", position: 'OF', team: 'BOS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ivanherrera', name: "Ivan Herrera", position: 'DH', team: 'STL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'logangilbert', name: "Logan Gilbert", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'georgekirby', name: "George Kirby", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'euryperez', name: "Eury Perez", position: 'SP', team: 'MIA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'coleragans', name: "Cole Ragans", position: 'SP', team: 'KC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'emmetsheehan', name: "Emmet Sheehan", position: 'SP', team: 'LAD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'petefairbanks', name: "Pete Fairbanks", position: 'RP', team: 'MIA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'mickabel', name: "Mick Abel", position: 'SP', team: 'MIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'liamdoyle', name: "Liam Doyle", position: 'SP', team: 'STL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'huntergreene', name: "Hunter Greene", position: 'SP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jaredjones', name: "Jared Jones", position: 'SP', team: 'PIT', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'parkermessick', name: "Parker Messick", position: 'SP', team: 'CLE', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'ryanweathers', name: "Ryan Weathers", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'danielpalencia', name: "Daniel Palencia", position: 'RP', team: 'CHC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'dennissantana', name: "Dennis Santana", position: 'RP', team: 'PIT', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'kadeanderson', name: "Kade Anderson", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'chasedelauter', name: "Chase DeLauter", position: 'OF', team: 'CLE', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'aaronjudge', name: "Aaron Judge", position: 'OF', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'fernandotatisjr', name: "Fernando Tatis Jr.", position: 'OF', team: 'SD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'justinlebron', name: "Justin Lebron", position: 'SS', team: 'Unaffiliated', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'carsonbenge', name: "Carson Benge", position: 'OF', team: 'NYM', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jacobwilson', name: "Jacob Wilson", position: 'DH', team: 'ATH', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'eliwillits', name: "Eli Willits", position: 'SS', team: 'WAS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'chaseburns', name: "Chase Burns", position: 'SP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jesusluzardo', name: "Jesus Luzardo", position: 'SP', team: 'PHI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'joeryan', name: "Joe Ryan", position: 'SP', team: 'MIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'randyvasquez', name: "Randy Vasquez", position: 'SP', team: 'SD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'lucaserceg', name: "Lucas Erceg", position: 'RP', team: 'KC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'michaelburrows', name: "Michael Burrows", position: 'SP', team: 'HOU', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jackflaherty', name: "Jack Flaherty", position: 'SP', team: 'DET', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'didierfuentes', name: "Didier Fuentes", position: 'SP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'tatsuyaimai', name: "Tatsuya Imai", position: 'SP', team: 'HOU', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'carlosrodon', name: "Carlos Rodon", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jeffhoffman', name: "Jeff Hoffman", position: 'RP', team: 'TOR', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'codyponce', name: "Cody Ponce", position: 'RP', team: 'TOR', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jacksonjobe', name: "Jackson Jobe", position: 'SP', team: 'DET', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'pablolopez', name: "Pablo Lopez", position: 'SP', team: 'MIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'jarrenduran', name: "Jarren Duran", position: 'OF', team: 'BOS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'rileygreene', name: "Riley Greene", position: 'OF', team: 'DET', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'heliotramos', name: "Heliot Ramos", position: 'OF', team: 'SF', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'zacveen', name: "Zac Veen", position: 'OF', team: 'COL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'moisesballesteros', name: "Moises Ballesteros", position: 'DH', team: 'CHC', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'bryceeldridge', name: "Bryce Eldridge", position: 'DH', team: 'SF', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'coltkeith', name: "Colt Keith", position: 'DH', team: 'DET', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jesusmade', name: "Jesus Made", position: 'DH', team: 'MIL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'andrewabbott', name: "Andrew Abbott", position: 'SP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'bubbachandler', name: "Bubba Chandler", position: 'SP', team: 'PIT', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'mackenziegore', name: "MacKenzie Gore", position: 'SP', team: 'TEX', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'caseymize', name: "Casey Mize", position: 'SP', team: 'DET', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'frambervaldez', name: "Framber Valdez", position: 'SP', team: 'DET', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'edwindiaz', name: "Edwin Diaz", position: 'RP', team: 'LAD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'chrisbassitt', name: "Chris Bassitt", position: 'SP', team: 'BAL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'kylebradish', name: "Kyle Bradish", position: 'SP', team: 'BAL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'benbrown', name: "Ben Brown", position: 'SP', team: 'CHC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'noahcameron', name: "Noah Cameron", position: 'SP', team: 'KC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'sladececconi', name: "Slade Cecconi", position: 'SP', team: 'CLE', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'nathaneovaldi', name: "Nathan Eovaldi", position: 'SP', team: 'TEX', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'brodyhopkins', name: "Brody Hopkins", position: 'SP', team: 'TB', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'quinnpriester', name: "Quinn Priester", position: 'SP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jrritchie', name: "JR Ritchie", position: 'SP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'graysonrodriguez', name: "Grayson Rodriguez", position: 'SP', team: 'LAA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'riverryan', name: "River Ryan", position: 'SP', team: 'LAD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jeffreysprings', name: "Jeffrey Springs", position: 'SP', team: 'ATH', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'brandonnimmo', name: "Brandon Nimmo", position: 'OF', team: 'TEX', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'bryanreynolds', name: "Bryan Reynolds", position: 'OF', team: 'PIT', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'mattwallner', name: "Matt Wallner", position: 'OF', team: 'MIN', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'chandlersimpson', name: "Chandler Simpson", position: 'DH', team: 'TB', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'dominiccanzone', name: "Dominic Canzone", position: 'DH', team: 'SEA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ethanholliday', name: "Ethan Holliday", position: 'DH', team: 'Unaffiliated', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'noahmiller', name: "Noah Miller", position: 'SS', team: 'LAD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'jassondominguez', name: "Jasson Dominguez", position: 'OF', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'maxmeyer', name: "Max Meyer", position: 'SP', team: 'MIA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'drewrasmussen', name: "Drew Rasmussen", position: 'SP', team: 'TB', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'cameronschlittler', name: "Cameron Schlittler", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'luisseverino', name: "Luis Severino", position: 'SP', team: 'ATH', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'brandonwoodruff', name: "Brandon Woodruff", position: 'SP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'cadesmith', name: "Cade Smith", position: 'RP', team: 'CLE', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'angelbastardo', name: "Angel Bastardo", position: 'SP', team: 'TOR', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'luiscastillo', name: "Luis Castillo", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'brandonpfaadt', name: "Brandon Pfaadt", position: 'SP', team: 'ARI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'brandonsproat', name: "Brandon Sproat", position: 'SP', team: 'MIL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'bryanwoo', name: "Bryan Woo", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'bryanabreu', name: "Bryan Abreu", position: 'RP', team: 'HOU', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'griffinjax', name: "Griffin Jax", position: 'RP', team: 'TB', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'devinwilliams', name: "Devin Williams", position: 'RP', team: 'NYM', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'clarkeschmidt', name: "Clarke Schmidt", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'shanesmith', name: "Shane Smith", position: 'SP', team: 'CHW', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'jeremypena', name: "Jeremy Pena", position: 'SS', team: 'HOU', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'joadell', name: "Jo Adell", position: 'OF', team: 'LAA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ianhapp', name: "Ian Happ", position: 'OF', team: 'CHC', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'stevenkwan', name: "Steven Kwan", position: 'OF', team: 'CLE', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'yandydiaz', name: "Yandy Diaz", position: 'DH', team: 'TB', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'mickeymoniak', name: "Mickey Moniak", position: 'OF', team: 'COL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'tyleroneill', name: "Tyler O'Neill", position: 'OF', team: 'BAL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'camsmith', name: "Cam Smith", position: 'OF', team: 'HOU', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'anthonyvolpe', name: "Anthony Volpe", position: 'SS', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'brentrooker', name: "Brent Rooker", position: 'DH', team: 'ATH', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'georgelombard', name: "George Lombard", position: 'SS', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'carsonwilliams', name: "Carson Williams", position: 'SS', team: 'TB', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ryanwaldschmidt', name: "Ryan Waldschmidt", position: 'OF', team: 'ARI', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'bryceelder', name: "Bryce Elder", position: 'SP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'zacgallen', name: "Zac Gallen", position: 'SP', team: 'ARI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'cadecavalli', name: "Cade Cavalli", position: 'SP', team: 'WAS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'matthewliberatore', name: "Matthew Liberatore", position: 'SP', team: 'STL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'rokisasaki', name: "Roki Sasaki", position: 'SP', team: 'LAD', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'rangersuarez', name: "Ranger Suarez", position: 'SP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'cadehorton', name: "Cade Horton", position: 'SP', team: 'CHC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'brycemiller', name: "Bryce Miller", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'spencerschwellenbach', name: "Spencer Schwellenbach", position: 'SP', team: 'ATL', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'justinsteele', name: "Justin Steele", position: 'SP', team: 'CHC', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'robbysnelling', name: "Robby Snelling", position: 'SP', team: 'MIA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },

{ id: 'kevinmcgonigle', name: "Kevin McGonigle", position: 'SS', team: 'DET', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'romananthony', name: "Roman Anthony", position: 'OF', team: 'BOS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'owencaissie', name: "Owen Caissie", position: 'OF', team: 'MIA', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'joshbell', name: "Josh Bell", position: 'DH', team: 'MIN', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'giancarlostanton', name: "Giancarlo Stanton", position: 'DH', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'colsonmontgomery', name: "Colson Montgomery", position: 'SS', team: 'CHW', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'luispena', name: "Luis Pena", position: 'SS', team: 'MIL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'josuedepaula', name: "Josue De Paula", position: 'OF', team: 'LAD', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'dylancrews', name: "Dylan Crews", position: 'DH', team: 'WAS', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'ezequieltovar', name: "Ezequiel Tovar", position: 'DH', team: 'COL', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'spencerjones', name: "Spencer Jones", position: 'OF', team: 'NYY', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'emmanuelrodriguez', name: "Emmanuel Rodriguez", position: 'OF', team: 'MIN', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'maxclark', name: "Max Clark", position: 'DH', team: 'DET', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'walkerjenkins', name: "Walker Jenkins", position: 'DH', team: 'MIN', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'sebastianwalcott', name: "Sebastian Walcott", position: 'DH', team: 'TEX', age: 25, stats: { singles: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, k: 0, sb: 0 } },
  { id: 'emersonhancock', name: "Emerson Hancock", position: 'SP', team: 'SEA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'rhettlowder', name: "Rhett Lowder", position: 'SP', team: 'CIN', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'nolanmclean', name: "Nolan McLean", position: 'SP', team: 'NYM', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'andrewpainter', name: "Andrew Painter", position: 'SP', team: 'PHI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'eduardorodriguez', name: "Eduardo Rodriguez", position: 'SP', team: 'ARI', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'aroldischapman', name: "Aroldis Chapman", position: 'RP', team: 'BOS', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'aaroncivale', name: "Aaron Civale", position: 'SP', team: 'ATH', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'sethhernandez', name: "Seth Hernandez", position: 'SP', team: 'PIT', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'carloslagrange', name: "Carlos Lagrange", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'elmerrodriguezcruz', name: "Elmer Rodriguez-Cruz", position: 'SP', team: 'NYY', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'noahschultz', name: "Noah Schultz", position: 'SP', team: 'CHW', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'jonahtong', name: "Jonah Tong", position: 'SP', team: 'NYM', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
  { id: 'thomaswhite', name: "Thomas White", position: 'SP', team: 'MIA', age: 25, stats: { w: 0, sv: 0, cg: 0, so: 0, qs: 0, inn: 0, k: 0, er: 0, l: 0, bs: 0 } },
];
