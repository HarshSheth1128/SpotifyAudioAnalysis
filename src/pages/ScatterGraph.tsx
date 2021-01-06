import { CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import React, { useState } from 'react';
import { getGraphDataFromId, useGetGraphDataFromRawData, useGetPlaylists } from "../common/api";
import {Dropdown, Typography, Menu, Button, AutoComplete, Input, Checkbox} from "antd";
import { GraphFeatures, Playlist, PlaylistGraphData } from '../constants/types';
import { DownOutlined, PlusOutlined} from "@ant-design/icons";
import './ScatterGraph.css';
import { find, startCase } from "lodash";
import { useCookies } from "react-cookie";
import decodeUriComponent from 'decode-uri-component';
import { AxisDomain } from 'recharts';

const hexFills = [
  '#1791db',
  '#84d89d',
  '#bd84d8',
  '#d88492',
  '#d8d284'
];

const featureDomains: {
  [key: string]: [AxisDomain, AxisDomain]
} = {
  [GraphFeatures.danceability]: [0,1],
  [GraphFeatures.energy]: [0,1],
  [GraphFeatures.loudness]: [0, 1],
  [GraphFeatures.valence]: [0, 1],  
  [GraphFeatures.tempo]: [0, 250]
}


function ScatterGraph() {
  const [cookies] = useCookies(['Authorization']);
  const search = window.location.hash;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const playlistName = search.match(/playlistName=(.*)&/)![1];
  const [features, setFeatures] = useState({X: GraphFeatures.danceability, Y: GraphFeatures.energy, Z: GraphFeatures.loudness});
  const [graphData] = useGetGraphDataFromRawData(playlistId);
  const [playlists] = useGetPlaylists();
  const [selectedPlaylists, setSelectedPlaylists] = useState<PlaylistGraphData[]>([]);

  const getDropdownPlaylists = () => {
    return playlists.map((res: Playlist)=> {return {'value': res.name}})
  }

  const handleMenuClick = (e: any, side:string) => {
    setFeatures({...features, [side]: e.key})
  }

  const FeatureMenu = (side: string) => (
    <Menu onClick={(e) => handleMenuClick(e, side)}>
      <Menu.Item key={GraphFeatures.danceability}>
        Danceability
      </Menu.Item>
      <Menu.Item key={GraphFeatures.energy}>
        Energy
      </Menu.Item>
      <Menu.Item key={GraphFeatures.valence}>
        Valence
      </Menu.Item>
      <Menu.Item key={GraphFeatures.tempo}>
        Tempo
      </Menu.Item>
      <Menu.Item key={GraphFeatures.loudness}>
        Loudness
      </Menu.Item>
    </Menu>
  );

  const searchBarSubmit = (evt: any) => {
    evt.preventDefault();
    const selectedPlaylistName = evt.target[0].value;
    const playlist = find(playlists, (playlist: {name: string, id: string}) => {return playlist.name === selectedPlaylistName});
    getGraphDataFromId(playlist!.id, cookies).then((res)=> {
      setSelectedPlaylists([...selectedPlaylists, {playlist: playlist!, graphData: res, visible: true}]);
    });
  }

  const removePlaylist = (playlistId: string) => {
    for (let i = 0; i < selectedPlaylists.length; i++){
      if (selectedPlaylists[i].playlist.id === playlistId) {
        selectedPlaylists[i].visible = !selectedPlaylists[i].visible;
      }
    }
    setSelectedPlaylists([...selectedPlaylists]);
  } 

  return (
    <div className="pageRoot">
      {/* Search bar that disappears after 5 items have been selected */}
      {selectedPlaylists.length < 5 && <div className="settingsContainer">
        <div className="formContainer">
          Add more playlists to compare
          <form className="searchForm" onSubmit={searchBarSubmit}>

            <Input.Group className="searchInput">
              <AutoComplete
                placeholder=""
                options={getDropdownPlaylists()}
              />
            </Input.Group>

            <Button htmlType="submit"><PlusOutlined/></Button>

          </form>
        </div>
      </div>}

      {/* Graph */}
      <div className="graphContainer">
        <div className="container">
          <div className="xAxisFeature">{startCase(features.X)}</div>
          <div className="graph">
            <ScatterChart width={730} height={730}
              margin={{ top: 20, right: 0, bottom: 10, left: 0 }}>
              <XAxis dataKey={features.X} type="number" domain={featureDomains[features.X]}name="danceability"/>
              <YAxis dataKey={features.Y} type="number" domain={featureDomains[features.Y]}name="energy" />
              <ZAxis dataKey={features.Z} type="number" range={[0, 300]} name="valence" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <CartesianGrid strokeDasharray="5 5" />
              <Scatter name={decodeUriComponent(playlistName)} data={graphData} fill="#8884d8" />
              {selectedPlaylists.map((playlistGraphData, index)=> (
                (playlistGraphData.visible && 
                <Scatter 
                name={playlistGraphData.playlist.name} 
                data={playlistGraphData.graphData} 
                fill={hexFills[index]} />)
              ))}
            </ScatterChart>
            <div>{startCase(features.Y)}</div>
          </div>
          <div className="selectedPlaylists">
              {selectedPlaylists.length > 0 && <span>Visible Playlists</span>}
              {selectedPlaylists.map((playlist, index) => (
                <div>
                  <Checkbox 
                    checked={playlist.visible}
                    onClick={()=> removePlaylist(playlist.playlist.id)}
                    key={playlist.playlist.id}
                    className="selectedPlaylistCheckbox">
                      {playlist.playlist.name}
                  </Checkbox>
                </div>
                )
              )}
          </div>
          </div>
      </div>

      {/* Holds the controller for the scatter chart */}
      <div className="settingsContainer">
        <div className="dropdownLabelContainer">
          <Typography.Text>X-Axis Feature</Typography.Text>
          <Dropdown overlay={FeatureMenu("X")}>
            <Button>
              {startCase(features.X)} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="dropdownLabelContainer">
          <Typography.Text>Y-Axis Feature</Typography.Text>
          <Dropdown overlay={FeatureMenu("Y")}>
            <Button>
              {startCase(features.Y)} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
        <div className="dropdownLabelContainer">
          <Typography.Text>Z-Axis Feature</Typography.Text>
          <Dropdown overlay={FeatureMenu("Z")}>
            <Button>
              {startCase(features.Z)} <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default ScatterGraph;
