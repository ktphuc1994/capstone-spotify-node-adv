const AUTH_PATTERN = {
  REGISTER: 'SPOTIFY_AUTH_REGISTER',
  LOGIN: 'SPOTIFY_AUTH_LOGIN',
  AUTHEN: 'SPOTIFY_AUTH_AUTHENTICATION',
};

const USER_PATTERN = {
  PROFILE: 'SPOTIFY_USER_PROFILE',
  GET_FRIEND_LIST: 'SPOTIFY_USER_GET_FRIEND_LIST',
  GET_REQUESTED_FRIEND_LIST: 'SPOTIFY_USER_GET_REQUESTED_FRIEND',
  GET_RECEIVED_FRIEND_LIST: 'SPOTIFY_USER_GET_RECEIVED_FRIEND',
  SEND_FRIEND_REQUEST: 'SPOTIFY_USER_SEND_FRIEND_REQUEST',
  ACCEPT_FRIEND_REQUEST: 'SPOTIFY_USER_ACCEPT_FRIEND_REQUEST',
  REMOVE_FRIEND: 'SPOTIFY_USER_REMOVE_FRIEND',
};

const SONG_PATTERN = {
  SEARCH_SONG: 'SPOTIFY_SEARCH_SONG',
  SEARCH_GENRE: 'SPOTIFY_SEARCH_GENRE',
  GET_BY_GENRE_ID: 'SPOTIFY_SONG_GET_BY_GENRE_ID',
  GET_SONG_DETAIL: 'SPOTIFY_SONG_GET_SONG_DETAIL',
};

const ARTIST_PATTERN = {
  SEARCH_ARTIST: 'SPOTIFY_SEARCH_ARTIST',
  GET_ARTIST_DETAIL: 'SPOTIFY_GET_ARTIST_DETAIL',
  GET_ALBUM_LIST: 'SPOTIFY_GET_ALBUM_LIST',
  GET_ALBUM_DETAIL: 'SPOTIFY_SONG_ALBUM_DETAIL',
  FOLLOW_ARTIST: 'SPOTIFY_FOLLOW_ARTIST',
  UNFOLLOW_ARTIST: 'SPOTIFY_UNFOLLOW_ARTIST',
};

const PLAYLIST_PATTERN = {
  PLAYLIST_GET: 'SPOTIFY_PLAYLIST_GET',
  PLAYLIST_GET_DETAIL: 'SPOTIFY_PLAYLIST_GET_DETAIL',
  PLAYLIST_CREATE: 'SPOTIFY_PLAYLIST_CREATE',
  PLAYLIST_UPDATE: 'SPOTIFY_PLAYLIST_UPDATE',
  PLAYLIST_REMOVE: 'SPOTIFY_PLAYLIST_REMOVE',
  PLAYLIST_ADD_SONG: 'SPOTIFY_PLAYLIST_ADD_SONG',
  PLAYLIST_REMOVE_SONG: 'SPOTIFY_PLAYLIST_REMOVE_SONG',
};

export {
  AUTH_PATTERN,
  USER_PATTERN,
  SONG_PATTERN,
  ARTIST_PATTERN,
  PLAYLIST_PATTERN,
};
