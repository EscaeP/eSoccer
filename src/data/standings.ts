export interface TeamStanding {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export const STANDINGS: TeamStanding[] = [
  { rank: 1, team: "咸宁", played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 9, goalsAgainst: 0, goalDifference: 9, points: 6 },
  { rank: 2, team: "襄阳", played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 7, goalsAgainst: 0, goalDifference: 7, points: 6 },
  { rank: 3, team: "鄂州", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 6 },
  { rank: 4, team: "黄石", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 5, goalsAgainst: 2, goalDifference: 3, points: 5 },
  { rank: 5, team: "荆州", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 2, goalsAgainst: 1, goalDifference: 1, points: 5 },
  { rank: 6, team: "黄冈", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 7, goalsAgainst: 2, goalDifference: 5, points: 4 },
  { rank: 7, team: "武汉", played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 4, goalsAgainst: 1, goalDifference: 3, points: 4 },
  { rank: 8, team: "荆门", played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 4 },
  { rank: 9, team: "宜昌", played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 2, goalsAgainst: 0, goalDifference: 2, points: 4 },
  { rank: 10, team: "孝感", played: 2, won: 1, drawn: 0, lost: 1, goalsFor: 3, goalsAgainst: 2, goalDifference: 1, points: 3 },
  { rank: 11, team: "潜江", played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 1, goalsAgainst: 0, goalDifference: 1, points: 3 },
  { rank: 12, team: "十堰", played: 3, won: 0, drawn: 2, lost: 1, goalsFor: 1, goalsAgainst: 4, goalDifference: -3, points: 2 },
  { rank: 13, team: "恩施", played: 2, won: 0, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 7, goalDifference: -5, points: 0 },
  { rank: 14, team: "天门", played: 2, won: 0, drawn: 0, lost: 2, goalsFor: 0, goalsAgainst: 5, goalDifference: -5, points: 0 },
  { rank: 15, team: "仙桃", played: 2, won: 0, drawn: 0, lost: 2, goalsFor: 0, goalsAgainst: 6, goalDifference: -6, points: 0 },
  { rank: 16, team: "随州", played: 2, won: 0, drawn: 0, lost: 2, goalsFor: 0, goalsAgainst: 7, goalDifference: -7, points: 0 },
  { rank: 17, team: "神农架", played: 2, won: 0, drawn: 0, lost: 2, goalsFor: 0, goalsAgainst: 11, goalDifference: -11, points: 0 },
];
