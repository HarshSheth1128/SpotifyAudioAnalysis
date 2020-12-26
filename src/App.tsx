import React, {useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
// import Application from './pages/Application';
import Login from './pages/Login';
import { setAuthContext } from './context/auth';
import {CookiesProvider} from 'react-cookie';
import Search from './pages/Search';
import Playlist from './pages/Playlist';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const AuthContext = setAuthContext({isAuth, setIsAuth});

  return (
    <div className="App">
      <AuthContext.Provider value={{isAuth, setIsAuth}}>
        <CookiesProvider>
        <Router>
          <Switch>
            <PrivateRoute path="/app/playlist">
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
        </CookiesProvider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
