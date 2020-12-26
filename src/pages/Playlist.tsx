import React, {useState} from 'react';
import './Playlist.css';
import SideBar from '../components/Sidebar';
import GraphContent from './GraphContent';
import {ChartTypes} from '../constants/types';



function Playlist() {
  const [chartType, setChartType] = useState(ChartTypes.BarGraph);
  
  return (
    <div className="playlistRoot">
      <SideBar></SideBar>
      <GraphContent setChartType={setChartType} chartType={chartType}></GraphContent>
    </div>
  )
}

export default Playlist;
