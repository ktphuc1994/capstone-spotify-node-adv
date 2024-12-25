import { z } from 'zod';

const playlistRequestSchema = z.object({
  userId: z.number(),
  playlistId: z.number(),
});
type PlaylistRequest = z.infer<typeof playlistRequestSchema>;

const createPlaylistRequestSchema = z.object({
  playlistName: z.string(),
  userId: z.number(),
  playlistCover: z.string().nullable().optional(),
});
type CreatePlaylistRequest = z.infer<typeof createPlaylistRequestSchema>;

const updatePlaylistRequestSchema = createPlaylistRequestSchema
  .partial()
  .extend({
    userId: z.number(),
    playlistId: z.number(),
  });
type UpdatePlaylistRequest = z.infer<typeof updatePlaylistRequestSchema>;

const updatePlaylistSongRequestSchema = z.object({
  playlistId: z.number(),
  userId: z.number(),
  songId: z.number(),
});
type UpdatePlaylistSongRequest = z.infer<
  typeof updatePlaylistSongRequestSchema
>;

export {
  playlistRequestSchema,
  createPlaylistRequestSchema,
  updatePlaylistRequestSchema,
  updatePlaylistSongRequestSchema,
  type PlaylistRequest,
  type CreatePlaylistRequest,
  type UpdatePlaylistRequest,
  type UpdatePlaylistSongRequest,
};
