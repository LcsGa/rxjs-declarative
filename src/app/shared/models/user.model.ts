import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(1).max(100)
});

export const UsersSchema = z.array(UserSchema).length(10);

export type User = z.infer<typeof UserSchema>;
