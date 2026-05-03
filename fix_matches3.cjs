const fs = require('fs');
let content = fs.readFileSync('src/data/matches.ts', 'utf8');

// Fix Enshi
content = content.replace(/\[30\.313, 109\.5074\]/g, '[30.297, 109.497]');

// Fix Huangshi Olympic Center
content = content.replace(/\[30\.1718, 114\.9567\]/g, '[30.169, 115.011]');

fs.writeFileSync('src/data/matches.ts', content);
console.log("Fixed even more matches.ts");
