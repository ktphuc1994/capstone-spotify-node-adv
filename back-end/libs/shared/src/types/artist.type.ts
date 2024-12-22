type ShortenArtist = {
  artist_id: number;
  artist_name: string;
};

type Artist = ShortenArtist & {
  monthly_listener: number;
  is_verified: boolean;
};

export { ShortenArtist, Artist };
