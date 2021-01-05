import React from 'react';
// import axios from 'axios';
import "../styles/common.css";
import codeChallenge from '../codeChallgenge';
import './Home.css';
import SpotifyLogo from '../images/spotifyLogo.png';
import BackgroundImage from '../images/collage.jpg';
import {Button, Carousel, Typography} from 'antd';
import Report from '../images/report.png';
import BarGraph from '../images/barGraph.png';
import Scatter from '../images/scatter.png';

function Home(props: any) {

  

  const authorize = () => {
    console.log(codeChallenge);
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent('0132ec2527844f11a38d2534ba740119');
    url += '&code_challenge_method=' + encodeURIComponent('S256');
    url += '&redirect_uri=' + encodeURIComponent('http://localhost:3000/login');
    url += '&code_challenge=' + encodeURIComponent(codeChallenge);
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
                  <img width={'80%'} alt="report" className="reportImage" src={Report}/>
                </div>
                <div className="carouselContentDiv">
                <Typography.Title level={4}>Sort the data in a bar graph and find outliers</Typography.Title>
                  <img width={'80%'} alt="report" className="reportImage" src={BarGraph}/>
                </div>
                <div className="carouselContentDiv">
                <Typography.Title level={4}>Compare the data with other playlists</Typography.Title>
                  <img width={'80%'} alt="report" className="reportImage" src={Scatter}/>
                </div>
              </Carousel>
        </div>

      </div>
    </div>

  )
}

export default Home;
