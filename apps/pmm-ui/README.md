# Setup

Install dependencies:

```shell
npm install
```

# Run

You can run app in development mode or development with module federation.

When running with Module Federation, it can break hot reloading when developing isolation. But hot reload will work when embedded into
other application (e.g. Grafana).

To run with webpack module federation use:

```shell
npm run dev:federation
```

To run without webpack module federation use:

```shell
npm run dev
```

## Testing with locally running Portal

In `.env` of  `grafana/apps/pmm-ui` please make sure you have:

```dotenv
PMM_UI_PORTAL_BASE_URL=https://check.localhost
```
