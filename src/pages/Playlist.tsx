import React, {useEffect, useState} from 'react';
import './Playlist.css';
import SideBar from '../components/Sidebar';
import GraphContent from './GraphContent';
import {ChartTypes} from '../constants/types';
import { lastIndexOf, startCase } from 'lodash';
import {useLocation} from 'react-router-dom';
import {PageHeader} from 'antd';


function Playlist() {
  const [chartType, setChartType] = useState(ChartTypes.None);
  const search = window.location.search;
  const playlistId = search.match(/playlistId=(.*)/)![1];
  const playlistName = search.match(/playlistName=(.*)&/)![1];
  const pathName = useLocation().pathname;
  useEffect(()=> {
    setChartType(pathName.substring(lastIndexOf(pathName, '/') + 1) as ChartTypes);
  }, [pathName]);
  
  return (
    <div className="playlistRoot">
      <SideBar></SideBar>
      <div className="contentDiv">
        <PageHeader className="pageHeader" title={`${startCase(chartType)} Graph`} subTitle={`Analysis for ${playlistName}`}></PageHeader>
        <GraphContent chartType={chartType}></GraphContent>
      </div>
    </div>
  )
}

export default Playlist;
