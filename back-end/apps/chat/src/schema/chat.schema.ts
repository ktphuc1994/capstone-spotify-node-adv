import { z } from 'zod';

const messageRequestSchema = z.object({
  conversationId: z.number().int(),
  message: z.string().max(1000),
});
type MessageRequest = z.infer<typeof messageRequestSchema>;

const messageByFriendRequestSchema = z.object({
  userId: z.number().int(),
  friendId: z.number().int(),
});
type MessageByFriendRequest = z.infer<typeof messageByFriendRequestSchema>;

export {
  messageRequestSchema,
  messageByFriendRequestSchema,
  type MessageRequest,
  type MessageByFriendRequest,
};
