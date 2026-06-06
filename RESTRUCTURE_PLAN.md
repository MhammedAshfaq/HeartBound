# Healthy-Relationship COE Restructure Plan

## Objective

Restructure the existing **Healthy-Relationship** project into the company's **COE (Center of Excellence) monorepo format** — a single project that properly maintains backend, admin panel, mobile app, and documentation following the same pattern as the Trovey reference project.

---

## Target Structure

```
Healthy-Relationship/
├── package.json                         # Root monorepo config (pnpm workspaces)
├── pnpm-workspace.yaml                  # Workspace package discovery
├── tsconfig.base.json                   # Shared TypeScript config
├── .editorconfig
├── .gitignore
├── .nvmrc                               # Node 20
├── .prettierrc
├── .npmrc
├── .pnpmrc
├── CLAUDE.md                            # AI assistant context
├── AGENTS.md
├── RESTRUCTURE_PLAN.md                  # This file
│
├── apps/
│   ├── backend/                         # NestJS 11 — API + Worker
│   │   ├── src/
│   │   │   ├── main.ts                  # API entry point (HTTP server)
│   │   │   ├── worker.main.ts           # Worker entry point (BullMQ consumer)
│   │   │   ├── app.module.ts            # Root module imports
│   │   │   ├── worker.module.ts         # Worker module imports
│   │   │   ├── api/
│   │   │   │   ├── health/              # Health check endpoints (Terminus)
│   │   │   │   ├── auth/                # Auth scaffold (guards, JWT strategy)
│   │   │   │   └── admin/               # Admin scaffold (role guard)
│   │   │   ├── common/                  # Shared: guards, filters, decorators
│   │   │   ├── config/                  # Joi-validated environment config
│   │   │   ├── db/                      # Prisma ORM (schema, migrations)
│   │   │   ├── redis/                   # Redis module (caching + queue backend)
│   │   │   ├── logger/                  # Winston structured logging
│   │   │   ├── otel/                    # OpenTelemetry instrumentation
│   │   │   ├── interceptors/            # HTTP logging, tracing, transform
│   │   │   ├── middlewares/             # Request context, metrics
│   │   │   └── background/              # BullMQ queues (cron, email, dead-letter)
│   │   ├── docker-compose.yml           # Full observability stack
│   │   ├── promtail-config.yml          # Log shipping to Loki
│   │   ├── views/                       # Pug templates (health UI, dev tools)
│   │   ├── tests/
│   │   │   ├── e2e/                     # Playwright E2E tests
│   │   │   └── functional/              # Functional/integration tests
│   │   ├── scripts/                     # Setup, code generation scripts
│   │   ├── assets/                      # Logos, screenshots
│   │   └── package.json
│   │
│   ├── frontend/
│   │   ├── packages/                    # Shared workspace packages
│   │   │   ├── assets/                  # Fonts, design tokens, constants
│   │   │   ├── hooks/                   # Shared React hooks (useAuth, useApi, etc.)
│   │   │   └── client-sdk/             # OpenAPI-generated client SDK
│   │   │
│   │   └── admin-web/                  # Next.js 15 Admin Panel
│   │
│   ├── mobile/
│   │   └── mobile-app/                  # Expo / React Native (existing, stripped)
│   │       ├── src/
│   │       │   ├── screens/            # Placeholder screens
│   │       │   ├── navigation/         # AppNavigator, AuthNavigator, MainTabNavigator
│   │       │   ├── components/         # Reusable UI components
│   │       │   ├── store/              # Zustand/Redux store shells
│   │       │   ├── services/           # API service stubs
│   │       │   ├── hooks/              # Custom hook stubs
│   │       │   ├── config/             # Environment config
│   │       │   ├── context/            # ThemeContext
│   │       │   ├── types/              # TypeScript type definitions
│   │       │   └── utils/              # Helper utilities
│   │       ├── assets/                 # Images, fonts, icons
│   │       ├── App.tsx                 # Root app with providers
│   │       ├── app.json               # Expo config
│   │       ├── android/                # Android native shell
│   │       ├── ios/                    # iOS native shell
│   │       └── package.json
│   │       ├── src/
│   │       │   ├── app/                # Next.js App Router pages
│   │       │   │   ├── page.tsx        # Dashboard
│   │       │   │   ├── login/page.tsx
│   │       │   │   ├── layout.tsx      # Root layout with sidebar
│   │       │   │   └── ... (Users, Settings)
│   │       │   ├── components/ui/      # shadcn components
│   │       │   └── lib/                # Utilities
│   │       ├── public/                 # Static assets
│   │       ├── next.config.ts
│   │       ├── tailwind.config.ts
│   │       ├── tsconfig.json
│   │       ├── docker-compose.yml
│   │       └── package.json
│   │
│   └── documentation/                  # Docusaurus 3
│       ├── docs/                       # Markdown documentation
│       ├── src/pages/                  # Custom pages
│       ├── docusaurus.config.js
│       └── package.json
│
├── libs/                               # Future shared libraries (empty)
│
└── k3s/                                # Kubernetes deployment manifests
    ├── apps/
    │   ├── backend/manifest.yml         # Backend Deployment + Service
    │   └── admin-web/manifest.yml       # Admin Deployment + Service
    └── monitoring-logging-stack/
        ├── namespace/                   # monitoring namespace
        ├── storage-class/               # Local path storage
        ├── pv/                          # Persistent Volumes (Loki, Prometheus, Grafana)
        ├── prometheus/                  # Config, alerts, RBAC, PVC
        ├── grafana/                     # Datasources (Prometheus, Loki), dashboards, PVC
        ├── loki/                        # Config, PVC
        ├── promtail/                    # DaemonSet, RBAC
        ├── alert-manager/               # Slack alert routing
        ├── node-exporter/               # Host metrics
        ├── blackbox-exporter/           # External health probing
        └── deploy/                      # Deployment automation scripts
```

---

## Infrastructure Stack (docker-compose)

| Service | Purpose | Port |
|---------|---------|------|
| **PostgreSQL 17** | Primary database | 5432 |
| **Redis** | Caching + BullMQ backend | 6379 |
| **Prometheus** | Metrics collection | 9090 |
| **Grafana** | Dashboards & visualization | 3001 |
| **Loki** | Log aggregation | 3100 |
| **Promtail** | Log shipping | 9080 |
| **Node Exporter** | Host metrics | 9100 |
| **Push Gateway** | Job/batch metrics | 9091 |
| **Jaeger** | Distributed tracing | 16686 |

---

## What Changes for Each App

### Backend (NEW — NestJS 11)
- Full NestJS 11 scaffold with dual-process (API + Worker)
- Prisma ORM with PostgreSQL
- Redis caching + BullMQ queue system
- OpenTelemetry + Jaeger tracing
- Prometheus metrics endpoint
- Winston structured logging → Loki via Promtail
- Health checks via Terminus
- **Zero business logic** — modules are empty scaffolds

### Mobile App (EXISTING — stripped of business logic)
- Navigation, theme, types, UI components preserved
- Screen content replaced with placeholders
- Redux slice reducers cleared (initial state only)
- Service implementations emptied (API stubs remain)
- Hook implementations return defaults
- Business-specific components removed

### Admin Panel (NEW — Next.js 15)
- Next.js 15 App Router with shadcn/ui
- Dashboard, Login, Users List, Settings pages
- All pages are simple placeholders

### Documentation (NEW — Docusaurus 3)
- Basic Docusaurus site setup
- Placeholder documentation pages

### K3s Manifests (NEW)
- Full monitoring stack manifests (Prometheus, Grafana, Loki, Promtail, AlertManager, etc.)
- Backend deployment manifest
- Admin web deployment manifest

---

## Execution Order

1. Create root monorepo configuration files
2. Move existing mobile code into `apps/mobile/mobile-app/`
3. Strip business logic from mobile app
4. Create NestJS backend with full infra scaffolding
5. Create Next.js admin panel
6. Create Docusaurus documentation site
7. Create shared packages
8. Create K3s Kubernetes manifests
9. Clean up old root-level files
