# Percona Grafana Fork — AI Agent Development Guide

<!-- SINGLE ENTRY POINT for all AI coding assistants (Claude Code, Cursor, GitHub Copilot, etc.)
     Compatibility shims that point here:
       - CLAUDE.md              (Claude Code auto-discovery)
       - .cursorrules           (Cursor auto-discovery)
       - .github/copilot-instructions.md  (GitHub Copilot auto-discovery) -->

> **Last reviewed**: 2026-04 — Agents must update this date whenever they modify this document.

## Keeping This Document Current

AI agents **must** review and update this file (`AGENTS.md`) whenever their work causes a significant change to the Percona/PMM delta in this repository. This keeps future agent sessions accurate and avoids stale context.

### When to Update

Update this file when you:

- **Add or remove a feature area** under `public/app/percona/` (e.g., a new top-level directory)
- **Add, remove, or rename a bundled PMM plugin** in `public/app/plugins/`
- **Add or change a backend API route** in `pkg/api/percona_api.go` or new Go files
- **Add or change a Redux slice** in `public/app/percona/shared/core/reducers/`
- **Add or change an API service** in `public/app/percona/shared/services/`
- **Modify an integration point** (`routes.tsx`, `root.ts`, `built_in_plugins.ts`, `http_server.go`, etc.)
- **Change CI workflows, test configs, or npm scripts** related to Percona
- **Add new environment variables or configuration knobs** consumed by PMM code
- **Change the communication pattern** with pmm-managed, qan-api2, or other PMM components

### What to Update

- Architecture tables (Frontend, Backend, Testing & CI)
- Directory structure tree
- State Management slice list
- API Layer examples
- Key Files to Reference lists
- File/directory counts if they have materially changed
- The `Last reviewed` date in the blockquote above

### How to Update

1. After completing the feature work, re-read this file
2. Identify which sections are now stale
3. Edit them to reflect the new state — keep the same concise tabular/list style
4. Update the `Last reviewed` date at the top of this file
5. If you are in a read-only mode and cannot edit, flag the needed updates to the user before ending the session

## PMM Context

This repository is a **fork of [grafana/grafana](https://github.com/grafana/grafana)** customized for [Percona Monitoring and Management (PMM)](https://github.com/percona/pmm). For the PMM product-wide overview, architecture, and domain model, see [AGENTS.md](https://github.com/percona/pmm/blob/v3/AGENTS.md) in the main PMM repo.

**Role in PMM**: Grafana is the primary visualization and UI shell for PMM. This fork adds PMM-specific pages (inventory, backups, advisors, settings, RTA, PMM dump), bundled plugins, Percona branding, backend API routes, and plugin middleware.

**Communicates with**: pmm-managed (via `/v1/*` REST APIs), qan-api2 (via `/v0/qan/*`), VictoriaMetrics (via Grafana datasource + vmproxy), pmm-agent (indirectly through pmm-managed).

**Deployed as**: `grafana-server` binary inside the PMM Server container, managed by supervisord.

## Critical Rule: This is a Fork

**Upstream Grafana is enormous** (~60k commits, Go + TypeScript). This AGENTS.md focuses exclusively on the **Percona delta** — what Percona added or modified. For general Grafana architecture, refer to [upstream contributing docs](https://github.com/grafana/grafana/blob/main/CONTRIBUTING.md).

Percona changes are tagged with **`// @PERCONA`** comments throughout the codebase. These markers identify fork-specific modifications and are critical for tracking merge conflicts when rebasing on upstream Grafana.

## Architecture: Percona Delta Overview

### Frontend (TypeScript/React)

| Area | Location | What Percona Added |
|------|----------|-------------------|
| **PMM UI module** | `public/app/percona/` | Entire PMM product UI: ~1050 files across 12 feature areas |
| **PMM plugins** | `public/app/plugins/{datasource,panel}/pmm-*` | 4 bundled plugins (pt-summary datasource, pmm-check panel, pmm-update panel, pmm-pt-summary panel) |
| **Branding** | `public/img/percona-*.svg`, `public/img/pmm-*.svg`, `public/views/` | Percona logos, PMM icons, HTML titles/favicons |
| **Routing integration** | `public/app/routes/routes.tsx` | PMM pages registered as `RouteDescriptor` entries with lazy imports |
| **Redux store** | `public/app/core/reducers/root.ts` | `perconaReducers` merged into Grafana's root store |
| **Bootstrapper** | `public/app/percona/shared/components/PerconaBootstrapper/` | Loads PMM state (settings, advisors, user, updates, HA) on app startup |
| **Navigation** | `public/app/percona/shared/components/PerconaNavigation/` | Builds PMM sidebar entries into Grafana's nav model |
| **Styles** | `public/sass/components/_pmm_tour.scss` | PMM tour styling |

### Backend (Go)

| Area | Location | What Percona Added |
|------|----------|-------------------|
| **Percona API routes** | `pkg/api/percona_api.go` | `/percona-api/saas-host`, `/percona-api/user/oauth-token` |
| **SaaS host** | `pkg/api/system.go` | `GetPerconaSaasHost()` — returns Percona Portal URL, overridable via `PMM_DEV_PORTAL_URL` |
| **Plugin middleware** | `pkg/services/pluginsintegration/clientmiddleware/forwarded_percona_token_middleware.go` | Forwards `X-Proxy-Filter` header to plugin HTTP clients for LBAC |
| **API key auth** | `pkg/api/apikey.go`, `pkg/api/dtos/apikey.go` | `GetAPIKeyCurrent` route, enhanced DTO types |
| **Service accounts** | `pkg/services/serviceaccounts/api/` | Extra `GET /api/auth/serviceaccount` route, `Force` on create form |
| **PmmAdmin middleware** | `pkg/middleware/auth.go` | `PmmAdmin` — restricts to org admin or Grafana admin |
| **Route wiring** | `pkg/api/http_server.go` | Calls `registerPerconaRoutes()` |
| **Plugin registration** | `pkg/services/pluginsintegration/pluginsintegration.go` | Registers `NewPerconaForwarderHTTPClientMiddleware()` |
| **Branding patches** | Various `@PERCONA` hunks | HTML titles, email subjects, nav tweaks, error pages |

### Testing & CI

| Area | Location | Purpose |
|------|----------|---------|
| **Jest config** | `jest.percona.config.js` | Runs tests only under `public/app/percona/` and `pmm-*` plugins |
| **CI workflow** | `.github/workflows/ci.yml` | `ci:test-percona-frontend` — Prettier, typecheck, `jest-percona-ci` |
| **E2E workflow** | `.github/workflows/ui-tests.yml` | Runs `pmm-ui-tests` Playwright suite against this fork |
| **npm scripts** | `package.json` | `jest-percona-ci`, `ci:test-percona-frontend` |

## Directory Structure: Percona-Specific Code

### Frontend: `public/app/percona/`

```
public/app/percona/
├── add-instance/              # Add monitored service/instance wizard
├── backup/                    # Backup/restore UI (inventory, schedules, locations, restore history)
├── check/                     # Advisors / failed checks UI
├── edit-instance/             # Edit monitored instance
├── integrated-alerting/       # PMM integrated alerting (templates, rules, alerts)
├── inventory/                 # Nodes, services, agents inventory tabs
├── pmm-dump/                  # PMM dump/export UI and logs modal
├── rbac/                      # Access roles (list, add/edit role)
├── settings/                  # PMM settings (metrics resolution, SSH key, communication, diagnostics)
├── tour/                      # Product and alerting onboarding tours
├── ui-events/                 # Telemetry/UI event tracking
└── shared/
    ├── components/
    │   ├── PerconaBootstrapper/   # App initialization (loads PMM state into Redux)
    │   ├── PerconaNavigation/     # Sidebar navigation builder
    │   ├── Form/                  # Shared form components
    │   ├── TabbedPage/            # Tab layout component
    │   ├── LoginFooter/           # Percona-branded login footer
    │   └── hooks/                 # Shared React hooks
    ├── core/
    │   ├── reducers/              # Redux slices: settings, user, updates, services, nodes,
    │   │                          #   backupLocations, tour, advisors, pmmDumps, roles, users, HA
    │   ├── selectors.ts           # Root selectors
    │   └── types.ts, constants.ts
    ├── helpers/
    │   ├── api.ts                 # Axios-based ApiRequest + scoped clients (apiQAN, apiManagement, etc.)
    │   ├── permissions.ts         # PMM permission helpers
    │   └── validatorsForm/        # Form validation utilities
    └── services/                  # API service modules
        ├── actions/               # Actions.service.ts (explain, PT summary)
        ├── advisors/              # Advisors.service.ts
        ├── AlertRules/            # AlertRules.service.ts
        ├── highAvailability/      # HighAvailability.service.ts
        ├── nodes/                 # Nodes.types.ts
        ├── roles/                 # Roles.service.ts
        ├── services/              # Services.service.ts
        ├── updates/               # Updates.service.ts
        └── user/                  # User.service.ts
```

### Bundled PMM Plugins

```
public/app/plugins/
├── datasource/pmm-pt-summary-datasource/    # PT Summary datasource
└── panel/
    ├── pmm-check/                           # Advisor checks panel
    ├── pmm-pt-summary-panel/                # PT Summary display panel
    └── pmm-update/                          # PMM update status panel
```

These are registered in `public/app/features/plugins/built_in_plugins.ts`.

## State Management

PMM extends Grafana's Redux store (Redux Toolkit):

- **Store integration**: `perconaReducers` are spread into Grafana's `addedReducers` in `public/app/core/reducers/root.ts`
- **Percona slice shape**: under `state.percona.*` — keys include `settings`, `user`, `templates`, `services`, `nodes`, `backupLocations`, `tour`, `telemetry`, `roles`, `users`, `advisors`, `pmmDumps`, `updates`, `highAvailability`
- **Async patterns**: `createAsyncThunk` + `createAsyncSlice` (from Grafana's unified alerting utils) + `withSerializedError` / `withAppEvents`
- **Navigation**: separate `navBarTree` reducer merges PMM nav items into Grafana's sidebar model

## API Layer

PMM frontend calls pmm-managed via Axios-based service classes:

```typescript
// Scoped API clients (from shared/helpers/api.ts)
api.get('/v1/users/me')                    // general PMM API
apiQAN.post('/v0/qan/GetReport', body)     // QAN-specific
apiManagement.post('/v1/management/...', body)
apiInventory.post('/v1/inventory/...', body)
apiSettings.post('/v1/server/settings/...', body)
```

Each feature area has a `*.service.ts` with typed methods wrapping these calls.

## Patterns and Conventions

### Do
- Tag all Percona-specific changes in shared Grafana files with `// @PERCONA` comments
- Keep PMM UI code under `public/app/percona/` — don't scatter PMM logic across Grafana feature directories
- Use Redux Toolkit (slices, thunks) for PMM state — it's merged into Grafana's store
- Register PMM routes in `public/app/routes/routes.tsx` with `SafeDynamicImport`
- Use the scoped API clients from `shared/helpers/api.ts`
- Run `ci:test-percona-frontend` to validate PMM code without running the full Grafana test suite
- When modifying upstream Grafana files, minimize the diff surface to ease rebasing
- After significant Percona/PMM feature changes, update this file (`AGENTS.md`) to reflect the new state (see "Keeping This Document Current" above)

### Don't
- Don't add PMM-specific code to upstream Grafana directories without `// @PERCONA` markers
- Don't replace Grafana's Redux store — extend it via `perconaReducers`
- Don't create separate Grafana routing mechanisms — use the existing `routes.tsx` integration
- Don't remove or modify upstream Grafana features unrelated to PMM
- Don't use `conf/defaults.ini` for PMM config — PMM settings come from pmm-managed API
- Don't add Percona-specific DB migrations to Grafana's migration system
- Don't leave `AGENTS.md` stale after adding/removing PMM features, routes, plugins, or Redux slices

### Upstream Rebase Workflow
- Periodic rebases from `grafana/grafana` upstream
- `// @PERCONA` markers help identify conflict zones
- Run `ci:test-percona-frontend` after rebase to catch regressions in PMM code
- Run the full Grafana test suite to catch regressions in upstream integration

## Configuration

PMM-specific settings are **not** in `conf/defaults.ini`. They come from:
- **pmm-managed API** (`/v1/server/settings`) — primary configuration source
- **Environment variables** in the PMM Server container:
  - `GF_DEFAULT_APP_MODE=development` — dev mode
  - `PMM_DEBUG=1` — debug logging
  - `PMM_DEV_PORTAL_URL` — override Percona Portal URL
  - `PMM_DEV_PERCONA_PLATFORM_ADDRESS` — override platform check address
  - `PMM_DEV_PERCONA_PLATFORM_PUBLIC_KEY` — platform public key

## Development Workflow

```bash
# Start PMM Server + MySQL dev environment
docker-compose up -d

# Install JS dependencies (first time only)
make deps-js

# Start frontend dev server
yarn start

# Run Percona-specific tests
yarn jest-percona-ci

# Build Go backend (inside PMM Server container)
docker exec -it pmm-server bash
cd /workspace
make build-go
cp ./bin/linux-amd64/grafana-server /usr/sbin/grafana-server
cp ./bin/linux-amd64/grafana /usr/sbin/grafana
supervisorctl restart grafana
```

## Testing

- **Unit tests**: `yarn jest-percona-ci` — runs Jest only on `public/app/percona/` and `pmm-*` plugins
- **CI pipeline**: `ci:test-percona-frontend` — Prettier + typecheck + jest-percona-ci
- **E2E tests**: `.github/workflows/ui-tests.yml` — runs [pmm-ui-tests](https://github.com/percona/pmm-ui-tests) Playwright suite
- **Test config**: `jest.percona.config.js` — extends root `jest.config.js` with Percona-only test roots

## Key Files to Reference

### Percona-Specific
- `DEVELOPMENT.PERCONA.md` — local development setup
- `jest.percona.config.js` — Percona test configuration
- `docker-compose.yml` — PMM dev environment (PMM Server + MySQL)
- `public/app/percona/shared/helpers/api.ts` — API client layer
- `public/app/percona/shared/core/reducers/index.ts` — Redux store shape
- `public/app/percona/shared/components/PerconaBootstrapper/` — app initialization
- `public/app/percona/shared/components/PerconaNavigation/` — sidebar navigation
- `pkg/api/percona_api.go` — backend Percona routes
- `pkg/services/pluginsintegration/clientmiddleware/forwarded_percona_token_middleware.go` — LBAC middleware

### Integration Points (Grafana files with `@PERCONA` modifications)
- `public/app/routes/routes.tsx` — PMM page route registration
- `public/app/core/reducers/root.ts` — Redux store integration
- `public/app/features/plugins/built_in_plugins.ts` — PMM plugin registration
- `pkg/api/http_server.go` — backend route wiring
- `pkg/services/pluginsintegration/pluginsintegration.go` — middleware registration
- `public/views/index.html` — Percona branding, titles, favicon
