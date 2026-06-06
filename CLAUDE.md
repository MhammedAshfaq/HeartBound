# Healthy-Relationship COE Monorepo

## Project Overview

This is a **Monorepo** containing multiple applications and shared libraries managed with **pnpm** workspaces for the Healthy-Relationship project.

## Directory Structure

```
/
├── apps/
│   ├── backend/              # NestJS 11 API + Worker
│   ├── frontend/
│   │   ├── admin-web/        # Next.js 15 Admin Panel
│   │   └── packages/         # Shared packages (assets, hooks, client-sdk)
│   ├── mobile/
│   │                         # Expo / React Native mobile application
│   └── documentation/        # Docusaurus documentation site
├── libs/                     # For shared libraries and utilities
├── k3s/                      # Kubernetes deployment manifests
├── package.json              # Root package.json (use pnpm only)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .prettierrc
├── .editorconfig
└── .gitignore
```

## Documentation Hub
- All mobile documentation: `apps/documentation/docs/mobile/`
- Screen specs: `apps/documentation/docs/mobile/screens/`
- Feature inventory: `apps/documentation/docs/mobile/features.md`

## Development Guidelines

- **Package Management:** Use `pnpm` for all package management.
- **Application-Specific Rules:** Each application has its own AI/development rules defined in `/apps/{APP_NAME}/AGENTS.md`.
- **Documentation-First:** Before implementing any change, read `apps/mobile/AGENTS.md` — it requires documenting changes in `apps/documentation/docs/mobile/` first.
- **Getting Started:** Refer to `apps/documentation/docs/mobile/getting-started.md` for mobile setup.
