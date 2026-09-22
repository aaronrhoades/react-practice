import { FastifyReply, FastifyRequest } from 'fastify';
import type { Pool } from 'pg';

interface UserBody {
  name: string;
  email: string;
}

interface UserParams {
  id: string;
}

export type UserDatabase = Pick<Pool, 'query'>;

export async function listUsers(db: UserDatabase) {
  const { rows } = await db.query('SELECT id, name, email, created_at FROM users ORDER BY id ASC');
  return rows;
}

export async function registerUser(db: UserDatabase, body: UserBody) {
  const { rows } = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
    [body.name, body.email],
  );
  return rows[0];
}

// GET /api/users
export async function getUsersHandler(this: any, request: FastifyRequest, reply: FastifyReply) {
  return listUsers(this.pg);
}

// GET /api/users/:id
export async function getUserByIdHandler(this: any, request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  const { rows } = await this.pg.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);

  if (rows.length === 0) {
    return reply.status(404).send({ error: 'User not found' });
  }
  return rows[0];
}

// POST /api/users
export async function createUserHandler(this: any, request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  try {
    return reply.status(201).send(await registerUser(this.pg, request.body));
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation error code in Postgres
      return reply.status(400).send({ error: 'Email already exists' });
    }
    throw error;
  }
}

// PUT /api/users/:id
export async function updateUserHandler(this: any, request: FastifyRequest<{ Params: UserParams; Body: UserBody }>, reply: FastifyReply) {
  const { id } = request.params;
  const { name, email } = request.body;

  try {
    const { rows } = await this.pg.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, id]
    );

    if (rows.length === 0) {
      return reply.status(404).send({ error: 'User not found' });
    }
    return rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      return reply.status(400).send({ error: 'Email conflict with an existing profile' });
    }
    throw error;
  }
}

// DELETE /api/users/:id
export async function deleteUserHandler(this: any, request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  const { rowCount } = await this.pg.query('DELETE FROM users WHERE id = $1', [id]);

  if (rowCount === 0) {
    return reply.status(404).send({ error: 'User not found' });
  }
  return reply.status(200).send({ message: 'User deleted successfully' });
}
