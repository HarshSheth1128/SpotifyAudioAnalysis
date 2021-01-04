import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {useAuth} from '../context/auth';
import { useCookies } from 'react-cookie';
import axios from 'axios';

function Login() { 
  const [isError, setIsError] = useState(false);
  const {isAuth, setIsAuth} = useAuth();
  const [,setCookie] = useCookies(['Authorization', 'Refresh']);
  const [code, setCode] = useState('');

  useEffect(()=> {
    if (code !== '') {
      const params = new URLSearchParams();
      params.append('client_id', '0132ec2527844f11a38d2534ba740119');
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', 'http://localhost:3000/login');
      params.append('code_verifier', 'ANz2ppxOjupHIlUeegvCuBMmsaxKxrIqTV25wZHBLRX0m');

      axios.post('https://accounts.spotify.com/api/token', params, { headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }}).then((res)=> {
        // setCookie('Authorization', res.data.access_token);
        // setCookie('Refresh', res.data.refresh_token);
        localStorage.setItem('Authorization', res.data.access_token);
        localStorage.setItem('Refresh', res.data.refresh_token);
        setIsAuth(true);
        setCode('');
      });
    }
  }, [code, isAuth, setCookie, setIsAuth])

  if (isAuth) {
    localStorage.setItem('isAuth', JSON.stringify(true));
    return <Redirect to="/app/search"/>
  }

  if (isError) {
    return <Redirect to="/"/>
  }


  const search = window.location.search;
  let index;

  if (search.includes('error')){
    setIsError(true);
  }

  if (code === '' && (index = search.indexOf('code=')) !== -1) {
    setCode(search.substring(index + 5));
  }


 
  return (<div></div>);
}

export default Login;
