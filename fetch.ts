import https from 'https';

const stadiums = [
  { city: '神农架', name: '神农架实验初级中学', coords: [31.7431, 110.672] },
  { city: '孝感', name: '孝感市体育中心', coords: [30.9317, 113.9317] },
  { city: '武汉', name: '武汉五环体育中心', coords: [30.6253, 114.1206] },
  { city: '荆门', name: '荆门市生态运动公园', coords: [31.0252, 112.1973] },
  { city: '十堰', name: '十堰市体育中心', coords: [32.6511, 110.7716] },
  { city: '仙桃', name: '仙桃市荣怀学校南广场', coords: [30.3387, 113.4357] },
  { city: '黄冈', name: '黄冈市体育中心', coords: [30.4437, 114.9392] },
  { city: '宜昌', name: '宜昌市体育场', coords: [30.6868, 111.2917] },
  { city: '咸宁', name: '咸宁崇阳县文体中心', coords: [29.5398, 114.0326] },
  { city: '天门', name: '天门市实验高中', coords: [30.6558, 113.1541] },
  { city: '襄阳', name: '襄阳市体育运动中心', coords: [32.062, 112.1158] },
  { city: '潜江', name: '潜江中学体育场', coords: [30.4073, 112.871] },
  { city: '黄石', name: '黄石奥体中心', coords: [30.1718, 114.9567] },
  { city: '恩施', name: '恩施市体育中心', coords: [30.313, 109.5074] },
  { city: '随州', name: '随州滨湖体育场', coords: [31.7001, 113.3705] },
  { city: '鄂州', name: '鄂州中等专业学校', coords: [30.38, 114.88] },
  { city: '荆州', name: '荆州奥林匹克体育中心', coords: [30.3541, 112.2465] }
];

async function geocode(query) {
  return new Promise((resolve) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'NodeApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json[0] ? [parseFloat(json[0].lat), parseFloat(json[0].lon)] : null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  for (const s of stadiums) {
    const res = await geocode(s.name);
    const resCity = await geocode(s.city + '市, 中国'); // try city center
    console.log(`\nLocation: ${s.name} (${s.city})`);
    console.log(`Current: ${s.coords}`);
    if (res) {
      console.log(`OSM found stadium: [${res[0]}, ${res[1]}]`);
    } else if (resCity) {
      console.log(`OSM found city center: [${resCity[0]}, ${resCity[1]}]`);
    } else {
      console.log(`OSM not found`);
    }
  }
}
run();
