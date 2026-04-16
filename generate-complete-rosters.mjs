import fs from 'fs';

const rostersRaw = JSON.parse(fs.readFileSync('./rosters-raw.json', 'utf-8'));

// Generate TypeScript code for complete rosters
let code = `// Complete rosters data from Excel - all players on all teams
export interface RosterPlayer {
  name: string;
  position: string;
  mlbTeam: string;
  capValue: number;
}

export interface TeamRoster {
  team: string;
  players: RosterPlayer[];
}

export const ROSTERS: TeamRoster[] = [
`;

// Add each team
Object.entries(rostersRaw).forEach(([teamName, players]) => {
  code += `  {\n`;
  code += `    team: "${teamName}",\n`;
  code += `    players: [\n`;

  players.forEach(p => {
    code += `      { name: "${p.name}", position: "${p.position}", mlbTeam: "${p.mlbTeam}", capValue: ${p.capValue} },\n`;
  });

  code += `    ],\n`;
  code += `  },\n`;
});

code += `];\n`;

fs.writeFileSync('./src/data/rosters.ts', code);

console.log('✓ Generated complete rosters.ts\n');
console.log('Teams:');
Object.entries(rostersRaw).forEach(([team, players]) => {
  console.log(`  ${team}: ${players.length} players`);
});
console.log(`\nTotal: ${Object.values(rostersRaw).reduce((sum, p) => sum + p.length, 0)} players`);
