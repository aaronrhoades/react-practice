import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import { RPCHandler } from "@orpc/server/fastify";
import { CORSPlugin } from "@orpc/server/plugins";
import type { FastifyReply, FastifyRequest } from "fastify";
import { config } from "./config.js";
import { userRouter } from "./orpc/userRouter.js";
import { userRoutes } from "./routes/userRoutes.js";
const app = Fastify({ logger: true });

const rpcHandler = new RPCHandler(
  { users: userRouter },
  {
    plugins: [
      new CORSPlugin({
        origin: ["http://localhost:5173", "http://localhost:8081", "http://localhost:19006"],
        allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
      }),
    ],
  },
);

await app.register(fastifyPostgres, {
  connectionString: config.databaseUrl,
});

async function ensureUsersTable() {
  await app.pg.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

await ensureUsersTable();

app.get("/health", async (_request, reply) => {
  try {
    await app.pg.query("SELECT 1");
    return { status: "ok", database: "ok" };
  } catch (error) {
    app.log.error(error, "Database health check failed");
    return reply.code(503).send({ status: "degraded", database: "unavailable" });
  }
});

async function handleRpc(request: FastifyRequest, reply: FastifyReply) {
  return rpcHandler.handle(request, reply, { prefix: "/rpc", context: { app } });
}

app.all("/rpc", handleRpc);
app.all("/rpc/*", handleRpc);

app.register(userRoutes); // TODO: Remove this and related routes once the web client is updated to use oRPC instead of REST.

const close = async (signal: string) => {
  app.log.info({ signal }, "Shutting down");
  await app.close();
  process.exit(0);
};

process.once("SIGINT", () => void close("SIGINT"));
process.once("SIGTERM", () => void close("SIGTERM"));

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
