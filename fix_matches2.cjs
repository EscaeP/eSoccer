const fs = require('fs');
let content = fs.readFileSync('src/data/matches.ts', 'utf8');

// Fix Xiangyang
content = content.replace(/\[32\.062, 112\.1158\]/g, '[32.030, 112.155]');

// Fix Shennongjia
content = content.replace(/\[31\.7431, 110\.672\]/g, '[31.758, 110.632]');

fs.writeFileSync('src/data/matches.ts', content);
console.log("Fixed more matches.ts");
