import React, {useEffect, useState} from 'react';
import {getTracksForPlaylist, getAudioFeaturesForTracks} from '../api';
import { useCookies } from 'react-cookie';
import { BarChart, Legend, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import "./BarGraph.css";
import {isEmpty, round, truncate} from 'lodash';
import CustomizedAxisTick from '../components/CustomizedTick';
import { Typography, Checkbox, Radio} from 'antd';

interface GraphData {
  name?: string;
  danceability?: number;
  energy?: number;
  valence?: number;
  tempo?: number;
  loudness?: number;
}

enum GraphFeatures {
  danceability = 'danceability',
  energy = 'energy',
  valence = 'valence',
  tempo = 'tempo',
  loudness = 'loudness',
}

enum SortOrder {
  ascending = 'ascending',
  descending = 'descending',
}

export function BarGraph() {
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const playlistName = search.match(/playlistName=(.*)&/)![1];
  const [activeFeatures, setActiveFeatures] = useState({
    danceability: false,
    energy: false,
    valence: false,
    tempo: false,
    loudness: false
  })
  const [sortBy, setSortBy] = useState<GraphFeatures | 'none'>('none');
  const [cookies] = useCookies(['Authorization']);
  const [tracks, setTracks] = useState([]);
  const [audioAnalysis, setAudioAnalysis] = useState<{
    [key:string]: {
      danceability: number;
      energy: number;
      valence: number;
      tempo: number;
      loudness: number;
    }
  }>({});
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [paginatedData, setPaginatedData] = useState<GraphData[]>([]);
  const [page, setPage] = useState(0);

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
    let graphData = tracks
      .map((trackObj: {track: {id: string, name:string}}) => {
        console.log(trackObj);
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
    setPaginatedData(graphData.slice(0, 20));
  }, [tracks, audioAnalysis])

  useEffect(() => {
    console.log(sortBy);
    if (sortBy !== 'none') {
      setGraphData(graphData.sort((a, b) => a[sortBy]! - b[sortBy]! ));
      setPaginatedData(graphData.slice(0, 20));
    }
  }, [sortBy, graphData]);

  const toggleFeature = (feature: "danceability" | "energy" | "valence" | "tempo" | "loudness") => [
    setActiveFeatures({...activeFeatures, [feature]: !activeFeatures[feature]})
  ]

  console.log(activeFeatures);
  return (
    <div className="pageRoot">
      <div className="graphContainer">
        <div className="graph">

        </div>
        <Typography.Title className="playlistTitle">{`Playlist analysis for ${playlistName}`}</Typography.Title>
        <BarChart barCategoryGap={'15%'} className="barChart" layout="vertical" width={730} height={1200} data={paginatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          {/* @ts-expect-error */}
          <YAxis tick={<CustomizedAxisTick/>}type="category" width={100} interval={0} dataKey="name" />
          <Tooltip />
          <Legend />
          {activeFeatures.danceability && <Bar dataKey="danceability" fill="#8884d8" />}
          {activeFeatures.energy && <Bar dataKey="energy" fill="#84d89d" />}
          {activeFeatures.valence && <Bar dataKey="valence" fill="#bd84d8" />}
          {activeFeatures.tempo && <Bar dataKey="tempo" fill="#d88492" />}
          {activeFeatures.loudness && <Bar dataKey="loudness" fill="#d8d284" />}
        </BarChart>
      </div>
      <div className="settingsContainer">
        <div className="checkboxContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Features</Typography.Text>
          <div><Checkbox onChange={() => toggleFeature('danceability')}/><span className="graphCheckboxText">Danceability</span></div>
          <div><Checkbox onChange={() => toggleFeature('energy')}/><span className="graphCheckboxText">Energy</span></div>
          <div><Checkbox onChange={() => toggleFeature('valence')}/><span className="graphCheckboxText">Valence</span></div>
          <div><Checkbox onChange={() => toggleFeature('tempo')}/><span className="graphCheckboxText">Tempo</span></div>
          <div><Checkbox onChange={() => toggleFeature('loudness')}/><span className="graphCheckboxText">Loudness</span></div>
        </div>
        <div className="sortContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Sort By</Typography.Text>
          <Radio.Group style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <Radio value={1} onChange={() => setSortBy('none')}><span className="graphCheckboxText">None</span></Radio>
            <Radio value={2} disabled={!activeFeatures.danceability} onChange={() => setSortBy(GraphFeatures.danceability)}><span className="graphCheckboxText">Danceability</span></Radio>
            <Radio value={3} disabled={!activeFeatures.energy} onChange={() => setSortBy(GraphFeatures.energy)}><span className="graphCheckboxText">Energy</span></Radio>
            <Radio value={4} disabled={!activeFeatures.valence} onChange={() => setSortBy(GraphFeatures.valence)}><span className="graphCheckboxText">Valence</span></Radio>
            <Radio value={5} disabled={!activeFeatures.tempo} onChange={() => setSortBy(GraphFeatures.tempo)}><span className="graphCheckboxText">Tempo</span></Radio>
            <Radio value={6} disabled={!activeFeatures.loudness} onChange={() => setSortBy(GraphFeatures.loudness)}><span className="graphCheckboxText">Loudness</span></Radio>
          </Radio.Group>
        </div>

        <div className="sortContainer">
          <Typography.Text style={{fontSize: '1rem', fontWeight: 'bold'}}>Sort Order</Typography.Text>
          <Radio.Group style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <Radio value={1} onChange={() => setSortBy('none')}><span className="graphCheckboxText">Ascending</span></Radio>
            <Radio value={2} disabled={!activeFeatures.danceability} onChange={() => setSortBy(GraphFeatures.danceability)}><span className="graphCheckboxText">Descending</span></Radio>
          </Radio.Group>
        </div>

      </div>
      
    </div>
  );
}

export default BarGraph;
