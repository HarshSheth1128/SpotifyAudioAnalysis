import React, {useEffect, useState} from 'react';
import './Playlist.css';
import SideBar from '../components/Sidebar';
import {ContentTypes} from '../constants/types';
import { lastIndexOf, startCase } from 'lodash';
import {useLocation} from 'react-router-dom';
import {PageHeader} from 'antd';
import BarGraph from './BarGraph';
import ScatterGraph from './ScatterGraph';
import InfoPage from './InfoPage';
import Report from './Report';
import decodeUriComponent from 'decode-uri-component';

function Playlist() {
  const [contentType, setContentType] = useState(ContentTypes.None);
  const search = window.location.hash;
  const playlistName = decodeUriComponent(search.match(/playlistName=(.*)&/)![1]);
  const pathName = useLocation().pathname;

  useEffect(()=> {
    setContentType(pathName.substring(lastIndexOf(pathName, '/') + 1) as ContentTypes);
  }, [pathName]);

  function getContent() {
    if (contentType === ContentTypes.BarGraph) {
      return <BarGraph/>
    } else if (contentType === ContentTypes.Info) {
      return <InfoPage/>
    } else if (contentType === ContentTypes.None) {

    } else if (contentType === ContentTypes.Report) {
      return <Report/>
    } else if (contentType === ContentTypes.ScatterGraph) {
      return <ScatterGraph/>
    }
  }

  
  return (
    <div className="playlistRoot">
      <SideBar contentType={contentType} setContentType={setContentType}></SideBar>
      <div className="contentDiv">
        <PageHeader className="pageHeader" title={`${startCase(contentType)} Graph`} subTitle={`Analysis for ${playlistName}`}></PageHeader>
        {getContent()}
      </div>
    </div>
  )
}

export default Playlist;
