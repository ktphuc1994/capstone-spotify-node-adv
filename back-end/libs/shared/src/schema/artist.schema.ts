import { z } from 'zod';
import { stringIntegerSchema } from './common.schema';

const albumListRequestSchema = z.object({
  artistId: stringIntegerSchema.optional(),
  albumName: z.string().optional(),
});
type AlbumListRequest = z.infer<typeof albumListRequestSchema>;

export { albumListRequestSchema, type AlbumListRequest };
