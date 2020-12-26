import React, {useState} from 'react';
import './Sidebar.css';
import arrowRight from '../icons/arrow-right-solid.svg';
import arrowLeft from '../icons/arrow-left-solid.svg';
import { Typography } from 'antd';

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getSidebarName = () => (sidebarOpen) ? 'sidebarRoot': 'sidebarRoot sidebarClosed';
  const openCloseSidebar = () => setSidebarOpen(!sidebarOpen);
  const getSidebarOpenButtonIcon = () => sidebarOpen ? arrowLeft: arrowRight;

  return (
    <div className={getSidebarName()}>
      <button onClick={openCloseSidebar} className="sidebarOpenCloseButton">
        <img alt="arrow" src={getSidebarOpenButtonIcon()}></img>
      </button>
      <Typography.Title className="sidebarTitle"> Modes</Typography.Title>
      <button>bar graph</button>
      <button>chart graph</button>
    </div>
  );
}

export default Sidebar;
