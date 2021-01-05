import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { isEmpty, round, truncate } from "lodash";
import { Playlist, TrackObject} from "../constants/types";

// TODO handle refresh tokoen.
// https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da

axios.interceptors.response.use(
  res => res,
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      localStorage.setItem('isAuth', 'false');
      originalRequest._retry = true;
      console.log(localStorage.getItem('Refresh'));
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', localStorage.getItem('Refresh') || '');
      params.append('client_id', '0132ec2527844f11a38d2534ba740119');
      axios.post('https://accounts.spotify.com/api/token', params, { headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }}).then((res)=> {
        localStorage.setItem('Authorization', res.data.access_token);
        localStorage.setItem('Refresh', res.data.refresh_token);
      }).then(()=> {
        window.location.reload();
      });
          
    }
  }
)

interface AudioAnalysis {
  [key:string]: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    loudness: number;
  }
}

// interface SpotifyAudioAnalysis {
//   danceability: number;
//   energy: number;
//   valence: number;
//   tempo: number;
//   loudness: number;
// }

interface GraphData {
  name?: string;
  danceability?: number;
  energy?: number;
  valence?: number;
  tempo?: number;
  loudness?: number;
}

interface Image {
  height: number,
  url: string,
  width: number
}

interface Track {
  track: {
    name: string
  }
}

export async function getGraphDataFromId(playlistId: string, cookies: { [name:string]: any}) {
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');
  const tracks = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${Authorization}`
    }
  }).then((res)=> {
    return res.data.items;
  });

  const trackIds = tracks.map((trackObj: {track: {id:string}})=> trackObj.track.id).join(',');

  const audioAnalysis = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
    headers: {
      'Authorization': `Bearer ${Authorization}`
    }
  }).then((res)=> {
    const audioFeatures = res.data.audio_features;
    const audioFeatureObjects = audioFeatures
        .map((audioFeature: {id: string})=> {return {[audioFeature.id]: audioFeature}})
        .reduce((acc: any, obj: any) => {return {...acc, ...obj}}, {});
    return audioFeatureObjects;
  });

  return tracks
    .map((trackObj: {track: {id: string, name:string}}) => {
      return {
        name: truncate(trackObj.track.name, {length: 18}),
        danceability: audioAnalysis[trackObj.track.id].danceability,
        energy: audioAnalysis[trackObj.track.id].energy,
        valence: audioAnalysis[trackObj.track.id].valence,
        tempo: audioAnalysis[trackObj.track.id].tempo,
        loudness: round((audioAnalysis[trackObj.track.id].loudness + 60) / 60, 3)
      }
    });

}

export function useGetRadarChartDataFromId(playlistId: string, playlistName: string) {
  const [data, setData] = useState([
    {name: 'danceability', [playlistName]: 0},
    {name: 'energy', [playlistName]: 0},
    {name: 'valence', [playlistName]: 0},
  ]);
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');

  useEffect(()=> {
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=> {
      const tracks = res.data.items.map((playlist: Track)=> {return {[playlist.track.name]: {...playlist}}});
      return tracks;
    }).then((tracks)=> {
      const trackIds = tracks.map((trackObj: {[key: string]: {track:{id:string}}})=> trackObj[Object.keys(trackObj)[0]].track.id).join(',');
      return trackIds;
    }).then((trackIds)=> {
      return axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
        headers: {
          'Authorization': `Bearer ${Authorization}`
        }
      });    
    }).then((res)=> {
      if (!res) return [];
      const audioFeatures = res.data.audio_features;
      return audioFeatures;
    }).then((audioAnalysis)=> {
      const averages = audioAnalysis.reduce((acc: any, obj: any) => {return {
        danceability: acc.danceability + obj.danceability/audioAnalysis.length,
        energy: acc.energy + obj.energy/audioAnalysis.length,
        valence: acc.valence + obj.valence/audioAnalysis.length,
        tempo: acc.tempo + obj.tempo/audioAnalysis.length,
        loudness: acc.loudness + obj.loudness/audioAnalysis.length,
      }}, {
        danceability: 0,
        energy: 0,
        valence: 0,
        tempo: 0,
        loudness: 0
      });
      return averages;
    }).then((averages)=> {
      const data = {
        danceability: {name: 'danceability', [playlistName]: averages.danceability},
        energy: {name: 'energy', [playlistName]: averages.energy},
        valence: {name: 'valence', [playlistName]: averages.valence},
      };
      setData(Object.values(data));
    });
  }, [Authorization, playlistId, playlistName]);

  return [data, setData] as [typeof data, typeof setData];
}


export function useGetPlaylistById(playlistId: string) {
  const [playlist, setPlaylists] = useState<Playlist>({
    name: '',
    id: '',
    description: '',
    owner: { display_name: ''},
    tracks: {items: []},
    followers: {total: 0}
  });
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');
  useEffect(()=> {
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=> {
      setPlaylists(res.data);
    });
  }, [Authorization, playlistId]);

  return [playlist, setPlaylists] as [Playlist, typeof setPlaylists]
}

export function useGetPlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');  
  useEffect(()=> {
    axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=> {
      setPlaylists(res.data.items);
    });
  }, [Authorization]);

  return [playlists, setPlaylists] as [Playlist[], typeof setPlaylists];
}

export function useGetUserObject() {
  const [userObject, setUserObject] = useState<{
    display_name: string,
    images: {url:string}[]
  }>({display_name: 'Harsh', images: []});
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');
  useEffect(() => {
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=>{
      setUserObject(res.data);
    });
  }, [Authorization]);

  return userObject;
}


export function useGetTracksForPlaylist(playlistId: string) {
  const [tracks, setTracks] = useState([]);
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');  
  useEffect(() => {
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=> {
      setTracks(res.data.items);
    });
  }, [Authorization, playlistId]);

  return tracks;
}

export function useGetAudioFeaturesForTracks(tracks: {track:{id:string}}[]) {
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis>({});
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');  const trackIds = tracks.map((trackObj: {track: {id:string}})=> trackObj.track.id).join(',');

  useEffect(()=> {
    if (tracks.length === 0) return;
    axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=> {
      const audioFeatures = res.data.audio_features;
      const audioFeatureObjects = audioFeatures
          .map((audioFeature: {id: string})=> {return {[audioFeature.id]: audioFeature}})
          .reduce((acc: any, obj: any) => {return {...acc, ...obj}}, {});
      setAudioAnalysis(audioFeatureObjects);
    });
  }, [Authorization, trackIds, tracks]);

  return audioAnalysis;
}

export function getGraphDataFromRawData(tracks: TrackObject[], audioAnalysis: AudioAnalysis) {
  return tracks
    .map((trackObj: {track: {id: string, name:string}}) => {
      return {
        name: truncate(trackObj.track.name, {length: 18}),
        danceability: audioAnalysis[trackObj.track.id].danceability,
        energy: audioAnalysis[trackObj.track.id].energy,
        valence: audioAnalysis[trackObj.track.id].valence,
        tempo: audioAnalysis[trackObj.track.id].tempo,
        loudness: round((audioAnalysis[trackObj.track.id].loudness + 60) / 60, 3)
      }
    });
}

export function useGetGraphDataFromRawData(playlistId: string) {
  const tracks = useGetTracksForPlaylist(playlistId);
  const audioAnalysis = useGetAudioFeaturesForTracks(tracks);
  let [graphData, setGraphData] = useState<GraphData[]>([]);
  
  // When the tracks and audio analysis is fetched map the graphdata
  useEffect(() => {
   if (isEmpty(tracks) || isEmpty(audioAnalysis)) return;
   let graphData: GraphData[] = getGraphDataFromRawData(tracks, audioAnalysis);
   
   setGraphData(graphData);
 }, [tracks, audioAnalysis]);

 return [graphData, setGraphData] as [GraphData[], typeof setGraphData];
}


export function useGetPlaylistCoverImage(playlistId: string) {
  const [playlistCoverImage, setPlaylistCoverImage] = useState<string>('');
  const [cookies] = useCookies(['Authorization']);
  // const {Authorization} = cookies;
  const Authorization = localStorage.getItem('Authorization');
  useEffect(() => {
    axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
      headers: {
        'Authorization': `Bearer ${Authorization}`
      }
    }).then((res)=> {
      setPlaylistCoverImage(res.data[0].url);
    })
  })

  return [playlistCoverImage, setPlaylistCoverImage] as [string, typeof setPlaylistCoverImage]
}
