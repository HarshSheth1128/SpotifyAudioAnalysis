import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() { 
  const [,setIsError] = useState(false);
  const {isAuth, setIsAuth} = useAuth();
  const [,setCookie] = useCookies(['Authorization', 'Refresh']);
  const [code, setCode] = useState('');
  const history = useHistory();

  useEffect(()=> {
    if (code !== '') {
      const params = new URLSearchParams();
      params.append('client_id', process.env.REACT_APP_CLIENT_ID!);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', process.env.REACT_APP_REDIRECT_URI!);
      params.append('code_verifier', process.env.REACT_APP_CODE_VERIFIER!);

      axios.post('https://accounts.spotify.com/api/token', params, { headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }}).then((res)=> {
        localStorage.setItem('Authorization', res.data.access_token);
        localStorage.setItem('Refresh', res.data.refresh_token);
        setIsAuth(true);
        history.push("/app/search");
      }).catch(()=> {
        history.push("/");
      });
    }
  }, [code, isAuth, setCookie, setIsAuth, history])

  const search = window.location.hash;
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
