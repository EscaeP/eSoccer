import { MATCHES } from './matches';

const playedMatches = [
    { source: '黄石', target: '荆州', label: '1:1', type: 'draw' },
    { source: '鄂州', target: '天门', label: '2:0', type: 'win' },
    { source: '荆门', target: '恩施', label: '3:1', type: 'win' },
    { source: '黄冈', target: '神农架', label: '6:0', type: 'win' },
    { source: '宜昌', target: '孝感', label: '2:0', type: 'win' },
    { source: '咸宁', target: '随州', label: '4:0', type: 'win' },
    { source: '襄阳', target: '仙桃', label: '4:0', type: 'win' },
    { source: '武汉', target: '十堰', label: '4:1', type: 'win' }
];

const nodes = [
    { id: '黄石', group: 'draw' }, { id: '荆州', group: 'draw' },
    { id: '天门', group: 'loss' }, { id: '鄂州', group: 'win' },
    { id: '恩施', group: 'loss' }, { id: '荆门', group: 'win' },
    { id: '黄冈', group: 'win' }, { id: '神农架', group: 'loss' },
    { id: '宜昌', group: 'win' }, { id: '孝感', group: 'loss' },
    { id: '咸宁', group: 'win' }, { id: '随州', group: 'loss' },
    { id: '襄阳', group: 'win' }, { id: '仙桃', group: 'loss' },
    { id: '十堰', group: 'loss' }, { id: '武汉', group: 'win' },
    { id: '潜江', group: 'neutral'}
];

const playedPairs = new Set(playedMatches.map(m => {
  const pair = [m.source, m.target].sort();
  return `${pair[0]}-${pair[1]}`;
}));

const futureMatches = MATCHES
  .filter(m => {
    const pair = [m.homeTeam, m.awayTeam].sort();
    return !playedPairs.has(`${pair[0]}-${pair[1]}`);
  })
  .map(m => ({
    source: m.homeTeam,
    target: m.awayTeam,
    label: '',
    type: 'future'
  }));

export const ANALYSIS_DATA = {
  nodes,
  links: [...playedMatches, ...futureMatches]
};
