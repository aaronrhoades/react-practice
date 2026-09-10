import type { FastifyInstance } from 'fastify';
import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController.js';

// JSON Schema validations for safety and performance serialization
const userBodySchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
  },
};

const userParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
  },
};

export async function userRoutes(fastify: FastifyInstance) {
  // READ ALL
  fastify.get('/users', getUsersHandler);

  // READ BY ID
  fastify.get('/users/:id', { schema: { params: userParamSchema } }, getUserByIdHandler);

  // CREATE
  fastify.post('/users', { schema: { body: userBodySchema } }, createUserHandler);

  // UPDATE
  fastify.put('/users/:id', { schema: { params: userParamSchema, body: userBodySchema } }, updateUserHandler);

  // DELETE
  fastify.delete('/users/:id', { schema: { params: userParamSchema } }, deleteUserHandler);
}
