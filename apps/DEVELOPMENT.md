## 1: Preparation

Clone repository and prepare environment:

```shell
cd ./apps/
make init
cp .env.example .env
```

For optimized ARM64 image, in `.env`, uncomment `PMM_CONTAINER`, use latest available image.

Example:

```dotenv
PMM_CONTAINER=ritbl/pmm-x:v2.33.0-3
```

## 2: Development

### 2.1: Grafana

You can run new devcontainer and grafana build (with watch) by running:

```shell
cd ./apps/pmm-ui
make dev
```

### 2.2: PMM-UI

In separate window:

```shell
cd ./apps/pmm-ui
npm run dev:federation
```

### 2.3: open grafana

Navigate to grafana `http:localhost/`
