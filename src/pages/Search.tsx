import React from 'react';
import './Search.css';
import searchSolid from '../icons/search-solid.svg';
import {Input, AutoComplete, Button, Typography} from 'antd';
import {find} from 'lodash';
import { useHistory } from 'react-router-dom';
import { Playlist } from '../constants/types';
import { useGetPlaylists } from '../common/api';

function Application(props: any) { 
  const [playlists] = useGetPlaylists();
  const history = useHistory();
  const searchInputTest = 'Search Here';

  console.log('hello');

  const getDropdownPlaylists = () => {
    return playlists.map((res: Playlist)=> {return {'value': res.name}})
  }

  const onSubmit = (evt: any) => {
    evt.preventDefault();
    const selectedPlaylistName = evt.target[0].value;
    const playlist = find(playlists, (playlist: {name:string, id:string})=>{ return playlist.name === selectedPlaylistName})!;
    return history.push(`/app/playlist/report?playlistName=${playlist.name}&playlistId=${playlist.id}`);
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
