import { SongInfo } from '../schema/song.schema';
import { ShortenAlbum, ShortenArtist } from './artist.type';

type Playlist = {
  playlist_id: number;
  user_id: number;
  playlist_name: string;
  playlist_cover: string | null;
};
type PlaylistSong = Pick<
  SongInfo,
  'song_id' | 'song_name' | 'cover' | 'duration'
> & {
  artist: ShortenArtist;
  album: ShortenAlbum | null;
  added_at: Date | null;
};
type PlaylistInfo = Omit<Playlist, 'user_id'> & {
  songList: PlaylistSong[];
};

type Genre = {
  genre_id: number;
  genre_name: string;
};

type SongAndArtist = Pick<SongInfo, 'song_id' | 'song_name'> & {
  artist: ShortenArtist;
};

type FullSongInfo = SongInfo & {
  artist: ShortenArtist;
  album: ShortenAlbum | null;
  genre: Genre[];
};

type GenreWithSong = Genre & {
  songList: SongAndArtist[];
};

export { Playlist, PlaylistInfo, Genre, FullSongInfo, GenreWithSong };
