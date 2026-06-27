# Getting Started with the Backend

This guide walks you through setting up and running the backend API and worker services locally.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

1. **Node.js** (version `>= 20.0.0`)
2. **pnpm** (version `>= 8.0.0`)
3. **Docker & Docker Compose** (for Postgres, Redis, and telemetry services)

---

## Setup Instructions

### 1. Environment Configuration

The backend requires a `.env` file to manage environment variables. Copy the example environment file:

```bash
# Navigate to the backend directory
cd apps/backend

# Copy the example environment file
cp .env.example .env
```

Review the values in `.env` and adjust database credentials or ports if necessary. By default, it connects to PostgreSQL on `localhost:5432` and Redis on `localhost:6379`.

### 2. Install Dependencies

From the root of the workspace (monorepo), run the installation command:

```bash
# In the repository root
pnpm install
```

---

## Running the Application Locally

The simplest way to start the backend with all its required infrastructure is using the `local:up` script from the backend directory:

```bash
cd apps/backend
pnpm run local:up
```

This single command:
1. Starts the Docker Compose containers (Postgres, Redis, Prometheus, Grafana, Jaeger, Loki, etc.) in detached mode.
2. Waits 5 seconds for PostgreSQL to become ready.
3. Synchronizes the database schema using Drizzle ORM (`drizzle-kit push`).
4. Starts the API server (`nest build & watch`) and the Background Worker (`ts-node-dev`) concurrently in development watch mode.

---

## Database Management Commands

We use **Drizzle ORM** for database mapping. The following scripts are available inside `apps/backend/package.json`:

| Command | Action |
|---|---|
| `pnpm run db:push` | Directly push the Drizzle schema ([schema.ts](file:///Users/apple/Desktop/Geekyants/Relationship-app/New/Healthy-Relationship/apps/backend/src/db/schema.ts)) to the target database. |
| `pnpm run db:generate` | Generate migration SQL files based on the schema. |
| `pnpm run db:studio` | Run the Drizzle Studio database explorer GUI on `https://local.drizzle.studio`. |
| `pnpm run db:dev:rm` | Tear down the local Docker databases and clean up volumes. |

---

## Individual Services Commands

If you prefer to start components manually, you can use these individual scripts:

```bash
# Start Docker infrastructure only
pnpm run db:dev:up

# Tear down Docker infrastructure only
pnpm run db:dev:rm

# Start NestJS API only in development mode
pnpm run api:start:dev

# Start background Worker only in development mode
pnpm run worker:start:dev
```

---

## Health Check and API Documentation

Once the backend starts:
- **Swagger API Documentation**: Visit `http://localhost:3000/api-docs` to interact with the endpoints.
- **Service Health UI**: Visit `http://localhost:3000/v1/health/health-ui`.
- **Grafana Metrics Dashboard**: Visit `http://localhost:3001` (default password is `admin`).

---

## Troubleshooting Port Conflicts

If you run into database connection errors or Redis authentication (`WRONGPASS`) errors during development, check if there are other instances of PostgreSQL or Redis running natively on your host machine:

### Check Port Usage
```bash
# Check if Postgres is already running on the host
lsof -i :5432

# Check if Redis is already running on the host
lsof -i :6379
```

### Resolution
1. **Stop Host Services**: Stop any local `postgresql` or `redis` services running on your mac (e.g., using `brew services stop postgresql` / `brew services stop redis`).
2. **Restart Docker**: Run `pnpm run db:dev:rm && pnpm run local:up` to cleanly bind the Docker ports.

