import { z } from 'zod';

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

const userSchema = createUserRequestSchema.extend({
  user_id: z.number(),
});
type User = z.infer<typeof userSchema>;

const userProfileSchema = userSchema.omit({ password: true });
type UserProfile = z.infer<typeof userProfileSchema>;

export {
  loginRequestSchema,
  createUserRequestSchema,
  userProfileSchema,
  type LoginRequest,
  type CreateUserRequest,
  type User,
  type UserProfile,
};
