const fs = require('fs');
let content = fs.readFileSync('src/data/matches.ts', 'utf8');

// Fix Xiaogan Sports Center
content = content.replace(/\[30\.9317, 113\.9317\]/g, '[30.923, 113.922]');

// Fix Xianning Sports Center (Match 87)
content = content.replace(
  /homeTeam: '咸宁', awayTeam: '恩施', stadium: '咸宁市体育中心', city: '咸宁', coordinates: \[29\.5398, 114\.0326\]/,
  "homeTeam: '咸宁', awayTeam: '恩施', stadium: '咸宁市体育中心', city: '咸宁', coordinates: [29.842, 114.326]"
);

// Fix Ezhou school
content = content.replace(/\[30\.38, 114\.88\]/g, '[30.468, 114.872]');

// Fix Jingmen Ecological Sports Park coordinates
content = content.replace(/生态运动公园', city: '荆门', coordinates: \[31\.0252, 112\.1973\]/g, "生态运动公园', city: '荆门', coordinates: [30.981, 112.182]");

fs.writeFileSync('src/data/matches.ts', content);
console.log("Fixed matches.ts");
