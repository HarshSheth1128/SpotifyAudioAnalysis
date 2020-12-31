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
  UserOutlined
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useHistory } from 'react-router-dom';
import { toInteger } from 'lodash';
import { useGetUserObject } from '../common/api';

enum MenuItems {
  Search,
  BarChart,
  ScatterChart,
  Report,
  Extras
}

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userObject = useGetUserObject();
  const history = useHistory();

  const getSidebarName = () => (sidebarOpen) ? 'sidebarRoot sidebarOpen': 'sidebarRoot';
  const hasImage = () => (userObject.images && userObject.images.length > 0);

  const handleMenuClick = (item: React.Key) => {
    const changedItem = toInteger(item) as unknown as MenuItems;
    const search = window.location.search;
    switch(changedItem) {
      case MenuItems.Search:
        return history.push('/app/search');
      case MenuItems.BarChart:
        return history.push(`/app/playlist/bar${search}`)
      case MenuItems.ScatterChart:
        return history.push(`/app/playlist/scatter${search}`)
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
        inlineCollapsed={!sidebarOpen}
        className="sidebarMenu"
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[MenuItems.BarChart.toString()]}
        onClick={(e)=>handleMenuClick(e.key)}
      >
        <SubMenu title="Charts" icon={<BarChartOutlined />}>
          <Menu.Item key={MenuItems.BarChart}>Bar Chart</Menu.Item>
          <Menu.Item key={MenuItems.ScatterChart}>Scatter Chart</Menu.Item>
        </SubMenu>
        <Menu.Item key={MenuItems.Report} icon={<PaperClipOutlined />}>
          Report
        </Menu.Item>
        <Menu.Item key={MenuItems.Extras} icon={<GiftOutlined />}>
          Extras
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
