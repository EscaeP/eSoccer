export interface Match {
  id: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  city: string;
  coordinates: [number, number]; // [lat, lng]
}
