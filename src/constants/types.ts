export enum ContentTypes {
  None = "none",
  BarGraph = "bar",
  ScatterGraph = "scatter",
  Info = "info",
  Report = "report",
  Search = "search"
}

export interface Playlist{
  name: string;
  id: string;
  description: string;
  owner: {
    display_name: string;
  };
  tracks: {items: []};
  followers: {total: number}
}

export enum GraphFeatures {
  danceability = 'danceability',
  energy = 'energy',
  valence = 'valence',
  tempo = 'tempo',
  loudness = 'loudness',
}

export interface AudioAnalysis {
  [key:string]: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    loudness: number;
  }
}

export interface GraphData {
  name?: string;
  danceability?: number;
  energy?: number;
  valence?: number;
  tempo?: number;
  loudness?: number;
}

export interface PlaylistGraphData {
  playlist: Playlist,
  graphData: GraphData[],
  visible: boolean
}

export interface TrackObject {
  track: {
    id: string,
    name: string
  }
}

export interface Track {
  track: {
    name: string
  }
}
