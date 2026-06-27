# Healthy-Relationship Backend

This is the NestJS backend application for the Healthy-Relationship project. It includes both the REST API server and a background worker processor, integrated with Drizzle ORM and a local telemetry suite.

## Tech Stack
- **Framework**: NestJS (v11)
- **Database ORM**: Drizzle ORM
- **Database Engine**: PostgreSQL
- **Key-Value Store / Queue**: Redis + BullMQ
- **Telemetry**: Prometheus, Grafana, Jaeger, Loki

---

## Setup & Running Locally

### 1. Configure Env Variables
Copy the example environment file and check the settings:
```bash
cp .env.example .env
```

### 2. Install Dependencies
Make sure you are using `pnpm` workspace installation from the root:
```bash
pnpm install
```

### 3. Start Everything
To bring up Docker containers, sync database schemas, and start both the API and Worker watch tasks concurrently:
```bash
pnpm run local:up
```

---

## Drizzle Database Tools

- **Push Schema changes to DB**:
  ```bash
  pnpm run db:push
  ```
- **Generate Migrations**:
  ```bash
  pnpm run db:generate
  ```
- **Launch Database Studio UI**:
  ```bash
  pnpm run db:studio
  ```

---

## Scripts List

- `pnpm run build` - Compile both API and Worker.
- `pnpm run start:dev` - Run API and Worker concurrently with watch mode.
- `pnpm run api:start:dev` - Run NestJS API only.
- `pnpm run worker:start:dev` - Run Worker only.
- `pnpm run test` - Run unit tests.

Refer to the main [Getting Started documentation](file:///Users/apple/Desktop/Geekyants/Relationship-app/New/Healthy-Relationship/apps/documentation/docs/backend/getting-started.md) in the Docusaurus workspace for advanced setup guides and diagnostics.

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

