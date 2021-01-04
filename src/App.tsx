import React, {useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
// import Application from './pages/Application';
import Login from './pages/Login';
import { useCreateAuthContext } from './context/auth';
import {CookiesProvider} from 'react-cookie';
import Search from './pages/Search';
import Playlist from './pages/Playlist';
import Report from './pages/Report';
import InfoPage from './pages/InfoPage';

function App() {
  const [AuthContext, AuthContextDefault] = useCreateAuthContext();

  return (
    <div className="App">
      <CookiesProvider>
        <AuthContext.Provider value={AuthContextDefault}>
          <Router>
            <Switch>
              {/* <PrivateRoute path="/app/playlist/info">
                <InfoPage/>
              </PrivateRoute> */}
              {/* <PrivateRoute path="/app/playlist/report">
                <Report/>
              </PrivateRoute> */}
              <PrivateRoute path="/app/playlist/">
                <Playlist/>
              </PrivateRoute>
              <PrivateRoute path="/app/search" >
                <Search/>
              </PrivateRoute>
              <Route path="/login" >
                <Login/>
              </Route>
              <Route path="/" component={Home}/>
            </Switch>
          </Router>
        </AuthContext.Provider>
      </CookiesProvider>
    </div>
  );
}

export default App;
