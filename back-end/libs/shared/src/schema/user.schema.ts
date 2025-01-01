import { z } from 'zod';
import { queryPaginationRequestSchema } from './common.schema';

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type LoginRequest = z.infer<typeof loginRequestSchema>;

const createUserRequestSchema = z.object({
  user_name: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string().email(),
  password: z.string(),
});
type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

const userSchema = createUserRequestSchema.omit({ password: true }).extend({
  user_id: z.number(),
});
type User = z.infer<typeof userSchema>;

const friendListRequestSchema = queryPaginationRequestSchema.extend({
  userId: z.number(),
});
type FriendListRequest = z.input<typeof friendListRequestSchema>;
type FriendList = {
  friendListId: number;
  friendInfo: Omit<User, 'email'>;
};

const createFriendRequestSchema = z.object({
  userId: z.number(),
  friendId: z.number(),
});
type CreateFriendRequest = z.infer<typeof createFriendRequestSchema>;

const updateFriendRequestSchema = z.object({
  userId: z.number(),
  friendListId: z.number(),
});
type UpdateFriendRequest = z.infer<typeof updateFriendRequestSchema>;

export {
  loginRequestSchema,
  createUserRequestSchema,
  userSchema,
  friendListRequestSchema,
  createFriendRequestSchema,
  updateFriendRequestSchema,
  type LoginRequest,
  type CreateUserRequest,
  type User,
  type FriendListRequest,
  type FriendList,
  type CreateFriendRequest,
  type UpdateFriendRequest,
};
