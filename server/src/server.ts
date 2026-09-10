import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import { config } from "./config.js";
import { userRoutes } from "./routes/userRoutes.js";
const app = Fastify({ logger: true });

await app.register(fastifyPostgres, {
  connectionString: config.databaseUrl,
});

app.get("/health", async (_request, reply) => {
  try {
    await app.pg.query("SELECT 1");
    return { status: "ok", database: "ok" };
  } catch (error) {
    app.log.error(error, "Database health check failed");
    return reply.code(503).send({ status: "degraded", database: "unavailable" });
  }
});

app.register(userRoutes);

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
