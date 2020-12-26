import React from 'react';
// import axios from 'axios';
import "../styles/common.css";
import codeChallenge from '../codeChallgenge';

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
    <div className="background">
      <button onClick={authorize}>Authenticate</button>
    </div>

  )
}

export default Home;
