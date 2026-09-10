# Node.js PostgreSQL Server

A small TypeScript API using Fastify and PostgreSQL.

## Setup

```bash
npm install
Copy-Item .env.example .env
```

Start PostgreSQL with Docker if available:

```bash
docker compose up -d postgres
```

Run the API in development:

```bash
npm run dev
```

The API listens on `http://localhost:3000`. `GET /health` returns HTTP 200 when PostgreSQL is reachable and HTTP 503 otherwise.

For a production-style run:

```bash
npm run build
npm start
```
