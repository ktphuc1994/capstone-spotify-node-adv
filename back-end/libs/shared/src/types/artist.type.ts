import { SongInfo } from '../schema/song.schema';

type ShortenArtist = {
  artist_id: number;
  artist_name: string;
};

type Artist = ShortenArtist & {
  artist_cover: string | null;
};

type FullArtist = Artist & {
  artist_about: string | null;
  monthly_listener: number;
  is_verified: boolean;
};

type ShortenAlbum = {
  album_id: number;
  album_name: string;
};
type Album = ShortenAlbum & {
  album_cover: string | null;
  artist_id: number;
  release_date: Date | null;
};
type AlBumArtistSong = Omit<Album, 'artist_id'> & {
  artist: ShortenArtist;
  song: Pick<SongInfo, 'song_id' | 'song_name' | 'duration'>[];
};

export {
  ShortenArtist,
  Artist,
  FullArtist,
  ShortenAlbum,
  Album,
  AlBumArtistSong,
};
