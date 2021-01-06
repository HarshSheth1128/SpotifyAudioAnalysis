import React, { useEffect, useState } from 'react';
import './App.css';
import { Switch, Route, useHistory, Redirect, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import { useCreateAuthContext } from './context/auth';
import {CookiesProvider, useCookies} from 'react-cookie';
import Search from './pages/Search';
import Playlist from './pages/Playlist';
import axios from 'axios';
import { useAuth } from './context/auth';

function App() {
  const [AuthContext, AuthContextDefault] = useCreateAuthContext();
  const [,setCookie] = useCookies(['Authorization', 'Refresh']);
  const [code, setCode] = useState('');
  const history = useHistory();
  const location = useLocation();
  const {isAuth, setIsAuth} = useAuth();

  // I have to use this digusting hack because gh-pages requires a hash router
  // and the PKE exchange protocol doesn't support the # character :)  
  const search = window.location.search;
  let index;
  if (code === '' && (index = search.indexOf('code=')) !== -1) {
    setCode(search.substring(index + 5));
  }

  useEffect(()=> {
    if (code !== '' && !isAuth) {
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
      }).catch(()=> {
        history.push("/");
      });
    }
  }, [code, isAuth, location, setCookie, setIsAuth, history])

  function getComponent() {
    return (isAuth) ? <Redirect to="/app/search"/> : Home
  }

  return (
    <div className="App">
      <CookiesProvider>
          <AuthContext.Provider value={AuthContextDefault}>
              <Switch>
                <PrivateRoute path="/app/playlist/">
                  <Playlist/>
                </PrivateRoute>
                <PrivateRoute path="/app/search" >
                  <Search/>
                </PrivateRoute>
                <Route path="/login" >
                  <Login/>
                </Route>
                <Route path="/">
                  {getComponent()}
                </Route>
              </Switch>
          </AuthContext.Provider>
        </CookiesProvider>
    </div>
  );
}

export default App;
