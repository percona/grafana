# Intro

This guide will help you run core grafana components:

- Grafana Server
- Grafana FrontendEnd
- PMM-UI micro-frontend
- PMM devcontainer for the rest of components

## 1: Preparation

Clone repository and prepare environment, execute in `apps` directory:

```shell
make init
cp .env.example .env
```

For optimized ARM64 image, in `.env`, uncomment `PMM_CONTAINER`, use latest available image.

Example:

```dotenv
PMM_CONTAINER=ritbl/pmm-x:v2.33.0-3
```

# 2: Run core components

If you are using IntelliJ IDEA. You need to open `apps` directory as project, so that modules resolved correctly.
You can add parent `grafana`, if you want to work with it in one project. But only apps dependency modules will be resolved
correctly. If you want to work in both of them you need to open them separatly.

## 2.1: FrontEnd Components

### 2.1.1: Grafana

You can run new devcontainer and grafana build (with watch) by running in `apps` directory:

```shell
make dev
```

### 2.1.2: PMM-UI

In separate window, navigate to `apps/pmm-ui` and execute:

```shell
npm run dev:federation
```

### 2.1.3: open grafana

Navigate to grafana `http:localhost/`

## 2.2: BackEnd Components

### 2.2.1: Grafana Server

Following needs to be executed after frontend components (`make dev` configures configs used by server components):

Run `grafana-server` run configuration from IntelliJ Idea.
