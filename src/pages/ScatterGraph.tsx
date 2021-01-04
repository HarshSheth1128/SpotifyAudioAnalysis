import { CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import React, { useEffect, useState } from 'react';
import { getGraphDataFromId, useGetGraphDataFromRawData, useGetPlaylists } from "../common/api";
import {Dropdown, Typography, Tooltip as AntTooltip, Tag, Menu, Button, Select, AutoComplete, Input, Checkbox} from "antd";
import { GraphData, GraphFeatures, Playlist, PlaylistGraphData } from '../constants/types';
import { DownOutlined, PlusOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import { featureDomains } from '../constants/graphdata';
import './ScatterGraph.css';
import { filter, find, get, remove, startCase, truncate } from "lodash";
import searchSolid from '../icons/search-solid.svg';
import { useCookies } from "react-cookie";

function ScatterGraph() {
  const [cookies] = useCookies(['Authorization']);
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const playlistName = search.match(/playlistName=(.*)&/)![1];
  const [features, setFeatures] = useState({X: GraphFeatures.danceability, Y: GraphFeatures.energy, Z: GraphFeatures.loudness});

  const hexFills = [
    '#1791db',
    '#84d89d',
    '#bd84d8',
    '#d88492',
    '#d8d284'
  ];

  // Get the graph data from raw data
  const [graphData, setGraphData] = useGetGraphDataFromRawData(playlistId);

  const [playlists] = useGetPlaylists();
  const [selectedPlaylists, setSelectedPlaylists] = useState<PlaylistGraphData[]>([]);

  const [extraGraphData, setExtraGraphData] = useState<GraphData[][]>([]);

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

  console.log(selectedPlaylists);

  const onSubmit = (evt: any) => {
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
      {selectedPlaylists.length < 5 && <div className="settingsContainer">
        <div className="formContainer">
          Add more playlists to compare
          <form className="searchForm" onSubmit={onSubmit}>

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
              <Scatter name={playlistName} data={graphData} fill="#8884d8" />
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
