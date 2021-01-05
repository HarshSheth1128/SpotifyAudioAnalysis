import { PageHeader, Typography } from 'antd';
import { find, get, round, truncate } from 'lodash';
import prettyMilliseconds from 'pretty-ms';
import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { useGetPlaylistById, useGetPlaylistCoverImage, useGetPlaylists, useGetRadarChartDataFromId } from '../common/api';
import SideBar from '../components/Sidebar';
import './Report.css';
import { useCookies } from "react-cookie";
import { TrackObject } from '../constants/types';
import decodeUriComponent from 'decode-uri-component';

function Report() {
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const playlistName = search.match(/playlistName=(.*)&/)![1];
  const pathName = useLocation().pathname;
  const [playlistCoverImage, setPlaylistCoverImage] = useGetPlaylistCoverImage(playlistId);
  const [playlist, setPlaylists] = useGetPlaylistById(playlistId);
  
  
  function getTotalTrackDuration() {
    if (playlist.tracks.items.length === 0) return 0;
    const sum = playlist.tracks.items.reduce((sum, curr)=> {
      // console.log(get(curr, ''))
      return sum += get(curr, 'track.duration_ms')
    }, 0);
    return sum;
  }

  function getAverageTrackDuration() {
    if (playlist.tracks.items.length === 0) return 0;
    const sum = playlist.tracks.items.reduce((sum, curr)=> {
      // console.log(get(curr, ''))
      return sum += get(curr, 'track.duration_ms')
    }, 0);
    return sum/playlist.tracks.items.length;
  }

  const [data, setData] = useGetRadarChartDataFromId(playlistId, playlistName);

  function getAverage(key: string) {
    const avg = find(data, (dataObj)=> dataObj.name === key)![playlistName] as number;
    return `${round(avg * 100, 0)}%`;
  }
  
  return (
    <div className="reportRoot">
          <div className="header">
            <div className="headerTitleContainer">
              <img className="playlistCoverImage" alt="playlist cover" src={playlistCoverImage}></img>
              <div className="headerTextContainer">
                <Typography.Text className="headerTitle">{`Report for ${decodeUriComponent(playlistName)}`}</Typography.Text>
                <Typography.Text className="headerSubtitle">{playlist.description}</Typography.Text>
                <Typography.Text >By: {playlist.owner.display_name}</Typography.Text>
              </div>
            </div>
          </div>
          <div className="infoContainer">
            <Typography.Text>Tracks: {get(playlist, 'tracks.items', []).length} </Typography.Text>
            <Typography.Text>Total Duration: {prettyMilliseconds(getTotalTrackDuration())} </Typography.Text>
            <Typography.Text>Average Duration: {prettyMilliseconds(getAverageTrackDuration())} </Typography.Text>
            <Typography.Text>Followers: {playlist.followers.total} </Typography.Text>
          </div>
          <Typography.Title className="radarTitle" level={5}>Radar Chart for {decodeUriComponent(playlistName)}</Typography.Title>
          <div className="radarChart">
            <RadarChart cy={'60%'} outerRadius={100} width={730} height={250} margin={{top: 20}} data={data}>
              <PolarGrid/>
              <PolarAngleAxis dataKey="name" stroke="white" />
              <PolarRadiusAxis angle={90} domain={[0, 1]} />
              <Radar name={playlistName} dataKey={playlistName} stroke="#8884d8" fill="#8884d8" fillOpacity={0.8} />
            </RadarChart>
          </div>
          <div className="radarInfo">
            <Typography.Text>Average Valence: {getAverage('valence')}</Typography.Text>
            <Typography.Text>Average Danceability: {getAverage('danceability')}</Typography.Text>
            <Typography.Text>Average Energy: {getAverage('energy')}</Typography.Text>
          </div>
         
          <Typography.Title className="radarTitle" level={5}>Tracklist</Typography.Title>
          <div className="trackList">
            {playlist.tracks.items.map((track: TrackObject, index: number) => (
              <Typography.Text style={{marginRight: 20}}>{index+1}. {truncate(track.track.name, {length: 20})}</Typography.Text>
            ))}
          </div>
    </div>
  )
}

export default Report;
