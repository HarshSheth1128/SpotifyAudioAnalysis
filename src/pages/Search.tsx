import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import './Search.css';
import searchSolid from '../icons/search-solid.svg';
import {Input, AutoComplete, Button, Typography} from 'antd';
import { getPlaylists } from '../api';
import {find} from 'lodash';
import {useAuth} from '../context/auth';
import { Redirect } from 'react-router-dom';

interface Playlist{
  name: string;
  id: string;
}

function Application(props: any) { 
  const [cookies] = useCookies(['Authorization']);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState({name: '', id: ''});
  const searchInputTest = 'Search Here';

  useEffect(() => { 
    getPlaylists(cookies).then((res)=> {
      setPlaylists(res.data.items);
    });
  }, [cookies]);

  const getDropdownPlaylists = () => {
    return playlists.map((res: Playlist)=> {return {'value': res.name}})
  }

  const onSubmit = (evt: any) => {
    evt.preventDefault();
    const selectedPlaylistName = evt.target[0].value;
    const playlist = find(playlists, (playlist: {name:string, id:string})=>{ return playlist.name === selectedPlaylistName});
    setSelectedPlaylist(playlist!);
  }

  if (selectedPlaylist.id !== '') {
    return <Redirect to={`/app/playlist?playlistId=${selectedPlaylist!.id}`}/>
  }

  return (
    
    <div className="background">
      <div className="pageContainer">
        <Typography.Title>Search for a playlist to get started</Typography.Title>
        <div className="searchBox">
          <form className="searchForm" onSubmit={onSubmit}>
            
              <Input.Group className="searchInput" compact>
                <AutoComplete
                  placeholder={searchInputTest}
                  options={getDropdownPlaylists()}
                />
              </Input.Group>

              <Button htmlType="submit"><img className="searchIcon" alt="searchIcon" src={searchSolid}></img></Button>

          </form>
        </div>
      </div>
    </div>
    );
}

export default Application;
