import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Match } from '../types';
import { getRelativeDateColor } from '../lib/utils';

interface LeagueMapProps {
  selectedMatchId: string | null;
  onSelectMatch: (id: string) => void;
  matches: Match[];
}

// Controller to handle map flying to selected marker
function MapController({ selectedMatchId, matches }: { selectedMatchId: string | null, matches: Match[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedMatchId) {
      const match = matches.find(m => m.id === selectedMatchId);
      if (match) {
        map.flyTo(match.coordinates, 12, { animate: true, duration: 1 });
      }
    }
  }, [selectedMatchId, matches, map]);

  return null;
}

// Custom DivIcon for markers
const createCustomIcon = (isSelected: boolean, colorHex: string) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative flex items-center justify-center w-8 h-8">
             <div class="absolute w-full h-full rounded-full opacity-40 animate-ping" style="background-color: ${colorHex}"></div>
             <div class="relative flex items-center justify-center rounded-full border-2 border-slate-900 shadow-md transition-all duration-300 ${isSelected ? 'z-10 w-6 h-6' : 'w-4 h-4'}" style="background-color: ${colorHex}"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export function LeagueMap({ selectedMatchId, onSelectMatch, matches }: LeagueMapProps) {
  // Center of Hubei approximately
  const hubeiCenter: [number, number] = [31.0, 112.5];
  const hubeiBounds: L.LatLngBoundsExpression = [
    [28.5, 108.0], // SW
    [33.5, 117.0]  // NE
  ];
  
  const markerRefs = useRef<Record<string, L.Marker | null>>({});
  const [hubeiGeoJson, setHubeiGeoJson] = useState<any>(null);

  useEffect(() => {
    // Fetch Hubei Province Map GeoJSON for highlighting
    // Using a reliable CDN for China GeoJSON
    fetch('https://cdn.jsdelivr.net/gh/longwosion/geojson-map-china@master/geometryProvince/42.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          return res.json();
        } else {
          return res.text().then(text => {
            // attempt to parse just in case it is json served as text
            try {
              return JSON.parse(text);
            } catch (e) {
              throw new Error('Response is not valid JSON');
            }
          });
        }
      })
      .then(data => setHubeiGeoJson(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  useEffect(() => {
    if (selectedMatchId) {
      const marker = markerRefs.current[selectedMatchId];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedMatchId]);

  return (
    <div className="w-full h-full relative z-0 md:rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-xl flex flex-col gap-2 pointer-events-auto">
          <h2 className="text-xs font-bold text-slate-400 uppercase">时间先后指示</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-red-500 font-bold">近期</span>
            <div className="w-32 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            <span className="text-[10px] text-green-500 font-bold">远期</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 text-right z-10 pointer-events-none drop-shadow-lg hidden md:block">
        <p className="text-4xl font-black text-slate-100 leading-none tracking-widest">湖北</p>
        <p className="text-xl font-bold text-slate-300 tracking-widest mt-1">足球赛事地图</p>
      </div>

      <MapContainer 
        center={hubeiCenter} 
        zoom={7} 
        minZoom={6}
        maxBounds={hubeiBounds}
        maxBoundsViscosity={1.0}
        className="w-full h-full z-0 font-sans bg-slate-950"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-tiles"
        />

        {hubeiGeoJson && (
          <GeoJSON 
            data={hubeiGeoJson} 
            interactive={false}
            style={{
              fillColor: '#ffffff',
              fillOpacity: 0.1,
              color: '#475569',
              weight: 2,
              dashArray: '5, 5'
            }} 
          />
        )}
        
        {(() => {
          const uniqueDates = Array.from(new Set(matches.map(m => m.date))).sort();
          
          return matches.map((match) => {
            const isSelected = selectedMatchId === match.id;
            const colorConfig = getRelativeDateColor(match.date, uniqueDates);
            
            // 设置z-index，让时间更近（更早）的比赛显示在上面
            const timestamp = new Date(match.date).getTime();
            // We negate the timestamp to make earlier dates get higher z-indexes
            // 2B minus timestamp/(large number) creates a valid layering strategy
            const dateZIndex = Math.floor(2000000000 - timestamp / 1000);
            const markerZIndex = isSelected ? 3000000000 : dateZIndex;
            
            return (
              <Marker
                key={match.id}
                position={match.coordinates}
                zIndexOffset={markerZIndex}
                // Pass dynamic color to custom icon HTML
                icon={createCustomIcon(isSelected, colorConfig.color)}
                ref={(ref) => markerRefs.current[match.id] = ref}
                eventHandlers={{
                  click: () => onSelectMatch(match.id),
                }}
              >
                <Popup className="custom-popup" closeButton={false}>
                  <div className="p-1 min-w-[180px] font-sans">
                    <div className="font-bold text-sm mb-2 text-slate-100 border-b border-slate-700 pb-2 flex justify-between items-center uppercase">
                      <span>{match.homeTeam} vs {match.awayTeam}</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-1 font-mono">
                      {match.date} &bull; {match.time}
                    </div>
                    <div className="text-xs font-bold" style={colorConfig.textStyle}>
                      {match.stadium}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          });
        })()}
        
        <MapController selectedMatchId={selectedMatchId} matches={matches} />
      </MapContainer>
    </div>
  );
}
