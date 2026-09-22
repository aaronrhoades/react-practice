import { usersContract } from '@my-app/shared';
import { implement, ORPCError } from '@orpc/server';
import type { FastifyInstance } from 'fastify';

import { listUsers, registerUser, deleteUser } from '../controllers/userController.js';

type UserContext = {
  app: FastifyInstance;
};

const os = implement(usersContract).$context<UserContext>();

export const userRouter = {
  list: os.users.list.handler(async ({ context }) => listUsers(context.app.pg)),
  register: os.users.register.handler(async ({ context, input }) => {
    try {
      return await registerUser(context.app.pg, input);
    } catch (error) {
      if ((error as { code?: string }).code === '23505') {
        throw new ORPCError('CONFLICT', { message: 'Email already exists' });
      }
      throw error;
    }
  }),
  delete: os.users.delete.handler(async ({ context, input }) => {
    const id : number  = parseInt(input.id as string, 10);
    return await deleteUser(context.app.pg, id);
  }),
};