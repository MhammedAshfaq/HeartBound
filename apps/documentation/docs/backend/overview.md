# Backend Overview

NestJS 11 backend with dual-process architecture (API + Worker).

## Tech Stack

- NestJS 11
- Prisma ORM (PostgreSQL)
- Redis (caching + BullMQ)
- OpenTelemetry + Jaeger
- Prometheus metrics
- Winston logging → Loki
- Terminus health checks

## Getting Started

```bash
cd apps/backend
pnpm install
pnpm local:up
```
