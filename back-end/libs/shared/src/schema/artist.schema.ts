import { z } from 'zod';
import { stringIntegerSchema } from './common.schema';

const albumListRequestSchema = z.object({
  artistId: stringIntegerSchema.optional(),
  albumName: z.string().optional(),
});
type AlbumListRequest = z.infer<typeof albumListRequestSchema>;

const artistRequestSchema = z.object({
  artistId: stringIntegerSchema.optional(),
  artistName: z.string().optional(),
});
type ArtistRequest = z.infer<typeof artistRequestSchema>;

export {
  albumListRequestSchema,
  artistRequestSchema,
  type AlbumListRequest,
  type ArtistRequest,
};
