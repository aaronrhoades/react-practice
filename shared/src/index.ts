import { oc } from '@orpc/contract';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  email: z.email(),
  created_at: z.union([z.string(), z.date()]),
});

export const registerInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
});

export const deleteOutputSchema = z.object({
  success: z.boolean(),
});

export const usersContract = {
  users: {
    list: oc.output(z.array(userSchema)),
    register: oc.input(registerInputSchema).output(userSchema),
    delete: oc.input(z.object({ id: z.union([z.number(), z.string()]) })).output(deleteOutputSchema),
  },
};

export type User = z.infer<typeof userSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;