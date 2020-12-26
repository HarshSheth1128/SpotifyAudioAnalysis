import React, {useEffect, useState} from 'react';
import {getTracksForPlaylist, getAudioFeaturesForTracks} from '../api';
import { useCookies } from 'react-cookie';
import { BarChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import "./BarGraph.css";
import {isEmpty, truncate} from 'lodash';
import CustomizedAxisTick from '../components/CustomizedTick';

export function BarGraph() {
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const [cookies] = useCookies(['Authorization']);
  const [tracks, setTracks] = useState([]);
  const [audioAnalysis, setAudioAnalysis] = useState<{[key:string]: {danceability: number}}>({});
  const [graphData, setGraphData] = useState<{
    name?: string;
    danceability?: number;
  }[]>([]);

  useEffect(() => {
    getTracksForPlaylist(playlistId, cookies).then((res) => {
      setTracks(res.data.items);
    });
  }, [playlistId, cookies]);

  useEffect(()=> {
    if (isEmpty(tracks)) return;
    const queryString = tracks.map((trackObj: {track: {id:string}})=> trackObj.track.id).join(',');
    getAudioFeaturesForTracks(queryString, cookies).then((res)=> {
      const audioFeatures = res.data.audio_features;
      const audioFeatureObjects = audioFeatures
        .map((audioFeature: {id: string})=> {return {[audioFeature.id]: audioFeature}})
        .reduce((acc: any, obj: any) => {return {...acc, ...obj}}, {});
      setAudioAnalysis(audioFeatureObjects);
    });
  }, [tracks, cookies]);

  useEffect(() => {
    if (isEmpty(tracks) || isEmpty(audioAnalysis)) return;
    console.log(tracks);
    console.log(audioAnalysis);
    const graphData = tracks
      .map((trackObj: {track: {id: string, name:string}}) => {
        console.log(trackObj);
        return {
          name: truncate(trackObj.track.name, {length: 20}),
          danceability: audioAnalysis[trackObj.track.id].danceability
        }
      });
    console.log(graphData)
    setGraphData(graphData);
  }, [tracks, audioAnalysis])

  return (
    <div className="pageRoot">
      <div className="graphContainer">
        <BarChart barCategoryGap={'15%'} className="barChart" layout="vertical" width={730} height={1200} data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          {/* @ts-expect-error */}
          <YAxis tick={<CustomizedAxisTick/>}type="category" width={150} interval={0} dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="danceability" fill="#8884d8" />      
        </BarChart>
      </div>
      
    </div>
  );
}

export default BarGraph;
