import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { isEmpty, round, truncate } from "lodash";

// TODO handle refresh tokoen.
// https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da

// axios.interceptors.response.use(
//   res => res,
//   (err) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//     }
//   }
// )

interface AudioAnalysis {
  [key:string]: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    loudness: number;
  }
}


interface GraphData {
  name?: string;
  danceability?: number;
  energy?: number;
  valence?: number;
  tempo?: number;
  loudness?: number;
}

export function useGetUserObject() {
  const [userObject, setUserObject] = useState<{
    display_name: string,
    images: {url:string}[]
  }>({display_name: 'Harsh', images: []});
  const [cookies] = useCookies(['Authorization']);
  const {Authorization} = cookies;

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
  const {Authorization} = cookies;
  
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
  const {Authorization} = cookies;
  const trackIds = tracks.map((trackObj: {track: {id:string}})=> trackObj.track.id).join(',');

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

export function useGetGraphDataFromRawData(playlistId: string) {
  const tracks = useGetTracksForPlaylist(playlistId);
  const audioAnalysis = useGetAudioFeaturesForTracks(tracks);
  let [graphData, setGraphData] = useState<GraphData[]>([]);
  
  // When the tracks and audio analysis is fetched map the graphdata
  useEffect(() => {
   if (isEmpty(tracks) || isEmpty(audioAnalysis)) return;
   console.log(tracks);
   console.log(audioAnalysis);
   let graphData: GraphData[] = tracks
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
   
   setGraphData(graphData);
 }, [tracks, audioAnalysis]);

 return [graphData, setGraphData] as [GraphData[], typeof setGraphData];
}

