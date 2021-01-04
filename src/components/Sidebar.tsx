import React, {useState} from 'react';
import './Sidebar.css';
import arrowRight from '../icons/arrow-right-solid.svg';
import arrowLeft from '../icons/arrow-left-solid.svg';
import searchSolid from '../icons/search-solid.svg';
import { Typography, Button, Menu } from 'antd';
import {
  SearchOutlined,
  CaretRightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BarChartOutlined,
  PaperClipOutlined,
  GiftOutlined,
  UserOutlined,
  DotChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useHistory } from 'react-router-dom';
import { toInteger } from 'lodash';
import { useGetUserObject } from '../common/api';
import {ContentTypes} from '../constants/types';


enum MenuItems {
  Search = "Search",
  BarChart = "BarChart",
  ScatterChart = "ScatterChart",
  Report = "Report",
  Extras = "Extras",
  Info = "Info"
}

function Sidebar({contentType, setContentType}: {
    contentType: ContentTypes, 
    setContentType: React.Dispatch<React.SetStateAction<ContentTypes>>
  }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userObject = useGetUserObject();
  const history = useHistory();

  const getSidebarName = () => (sidebarOpen) ? 'sidebarRoot sidebarOpen': 'sidebarRoot';
  const hasImage = () => (userObject.images && userObject.images.length > 0);

  const handleMenuClick = (item: React.Key) => {
    const changedItem = item as ContentTypes;
    const search = window.location.search;
    setContentType(changedItem);
    if (changedItem === ContentTypes.Search) {
      return history.push(`/app/search`)
    } else if (changedItem === ContentTypes.BarGraph){
      return history.push(`/app/playlist/bar${search}`)
    } else if (changedItem === ContentTypes.ScatterGraph){
      return history.push(`/app/playlist/scatter${search}`)
    } else if (changedItem === ContentTypes.Report) {
      return history.push(`/app/playlist/report${search}`)
    } else if (changedItem === ContentTypes.Info) {
      return history.push(`/app/playlist/info${search}`)
    }
  }

  return (
    <div className={getSidebarName()}>
      <div className="userInfoCard">
        {!hasImage() && <UserOutlined className="userIcon"/>}
        {hasImage() && <img className="profileImage" alt="userImage" src={userObject.images[0].url}></img>}
        {sidebarOpen && <Typography.Text className="profileText">{userObject.display_name}</Typography.Text>}
      </div>
      <Button onClick={()=> setSidebarOpen(!sidebarOpen)} type="primary" style={{ marginBottom: 16 }}>
          {React.createElement(!sidebarOpen ? MenuUnfoldOutlined : MenuFoldOutlined)}
      </Button>
      <Menu
        selectedKeys={[contentType]}
        inlineCollapsed={!sidebarOpen}
        className="sidebarMenu"
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[MenuItems.Report.toString()]}
        onClick={(e)=>handleMenuClick(e.key)}
      >
        <Menu.Item key={ContentTypes.Search} icon={<SearchOutlined />}>Search</Menu.Item>
        <Menu.Item key={ContentTypes.Report} icon={<PaperClipOutlined />}>Report</Menu.Item>
        <Menu.Item icon={<BarChartOutlined />} key={ContentTypes.BarGraph}>Bar Chart</Menu.Item>
        <Menu.Item icon={<DotChartOutlined />} key={ContentTypes.ScatterGraph}>Scatter Chart</Menu.Item>
        <Menu.Item icon={<InfoCircleOutlined />} key={ContentTypes.Info}>Info</Menu.Item>
        
      </Menu>
    </div>
  );
}

export default Sidebar;
