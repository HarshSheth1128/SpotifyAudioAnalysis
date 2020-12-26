import axios from 'axios';

export async function getPlaylists(cookies: {[key:string]: string}) {
  const {Authorization} = cookies;
  const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      'Authorization': `Bearer ${Authorization}`
    }
  });
  return res;
}

export async function getTracksForPlaylist(playlistId: string, cookies: {[key:string]: string} ){
  const {Authorization} = cookies;
  const res = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${Authorization}`
    }
  });
  return res;
}

export async function getAudioFeaturesForTracks(trackIds:string, cookies: {[key:string]: string}) {
  const {Authorization} = cookies;
  const res = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
    headers: {
      'Authorization': `Bearer ${Authorization}`
    }
  });
  return res;
}
