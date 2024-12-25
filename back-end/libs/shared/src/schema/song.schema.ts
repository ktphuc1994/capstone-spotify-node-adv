import { z } from 'zod';
import { stringIntegerSchema } from './common.schema';

const songSchema = z.object({
  song_id: z.number(),
  artist_id: z.number(),
  album_id: z.number().nullable(),
  song_name: z.string(),
  cover: z.string().nullable(),
  release_date: z.date().nullable(),
  total_view: z.number().nullable(),
  lyric: z.string().nullable(),
  duration: z.number().int().nullable(),
  description: z.string().nullable(),
  file_path: z.string().nullable(),
});
type SongInfo = z.infer<typeof songSchema>;

const songRequestSchema = z.object({
  songId: stringIntegerSchema.optional(),
  songName: z.string().optional(),
  artistId: stringIntegerSchema.optional(),
  albumId: stringIntegerSchema.optional(),
  genreId: stringIntegerSchema.optional(),
});
type SongRequest = z.infer<typeof songRequestSchema>;

export { songSchema, songRequestSchema, type SongInfo, type SongRequest };
