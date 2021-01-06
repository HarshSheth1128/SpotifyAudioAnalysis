import React from 'react';
import "../styles/common.css";
import './Home.css';
import BackgroundImage from '../images/collage.jpg';
import {Button, Carousel, Typography} from 'antd';
import Report from '../images/report.png';
import BarGraph from '../images/barGraph.png';
import Scatter from '../images/scatter.png';

function Home(props: any) {

  const authorize = () => {
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent(process.env.REACT_APP_CLIENT_ID!);
    url += '&code_challenge_method=' + encodeURIComponent('S256');
    url += '&redirect_uri=' + encodeURIComponent(process.env.REACT_APP_REDIRECT_URI!);
    url += '&code_challenge=' + encodeURIComponent(process.env.REACT_APP_CODE_CHALLENGE!);
    window.location = url as unknown as Location;
  }

  return (
    <div className="rootContainer">
      <div className="imageContainer">
        <img alt="background" className="titleImage" src={BackgroundImage}/>
      </div>
      <div className="contentContainer">
        <div className="leftContainer">
          <div className="wrapper">
            <Typography.Title>Trumendous Tracks</Typography.Title>
            <Typography.Text>Make the most fire playlist ever</Typography.Text>
            <Button style={{marginTop: 20}} onClick={authorize}>Get Started</Button>
          </div>
        </div>
        <div className="rightContainer">
          <Carousel autoplay>
            <div className="carouselContentDiv">
              <Typography.Title level={4}>Generate a playlist report</Typography.Title>
              <img width={'700px'} alt="report" className="reportImage" src={Report}/>
            </div>
            <div className="carouselContentDiv">
            <Typography.Title level={4}>Sort the data in a bar graph and find outliers</Typography.Title>
              <img width={'700px'} alt="report" className="reportImage" src={BarGraph}/>
            </div>
            <div className="carouselContentDiv">
            <Typography.Title level={4}>Compare the data with other playlists</Typography.Title>
              <img width={'700px'} alt="report" className="reportImage" src={Scatter}/>
            </div>
          </Carousel>
        </div>

      </div>
    </div>

  )
}

export default Home;
