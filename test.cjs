const https = require('https');
const qs = [
  "孝感市体育中心",
  "咸宁市体育中心"
];
qs.forEach(q => {
  const url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(q) + "&format=json";
  https.get(url, { headers: { 'User-Agent': 'NodeApp/1.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(q, data));
  });
});
