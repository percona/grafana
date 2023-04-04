# Intro

This guide will help you run core grafana components:

- Grafana Server (optional)
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
PMM_CONTAINER=ritbl/pmm-x:v2.36.0-3
```

In project root, configure pmm-ui location, create file `.env`, add location of pmm-ui (that will be running locally):

```dotenv
fd_pmm=http://localhost:3001
```

# 2: Run core components

If you are using IntelliJ IDEA. You need to open `apps` directory as project, so that modules resolved correctly.
You can add parent `grafana`, if you want to work with it in one project. But only apps dependency modules will be resolved
correctly. If you want to work in both of them you need to open them separatly.

## 2.1: FrontEnd Components

### 2.1.1: Grafana UI

You can run new devcontainer and grafana ui build (with watch) by running in `apps` directory

Use grafana server in devcontainer:

```shell
make dev
```

Use local grafana server:

```shell
make dev-local-gs
```

### 2.1.2: PMM-UI

In separate window, navigate to `apps/pmm-ui` and execute:

```shell
npm run dev:federation
```

## 2.2: BackEnd Components

### 2.2.1: Grafana Server

Following needs to be executed after frontend components (`make dev` configures configs used by server components):

Run `grafana-server` run configuration from IntelliJ Idea.

### 2.2.2: Add PMM Managed

To mount pmm managed source code to the running container you have to override `PMM_MANAGED_DIR`.
Value of this variable should be equal to path where is pmm manged is located on your local machine (see .env.example).

### 2.3: navigate to Grafana UI in browser

After running 2.1.1, 2.1.2, 2.2.1 navigate to grafana `http:localhost:1080/`

## 3: Troubleshooting

### 3.1: "Grafana has failed"

Often happens when running grafana server in devcontainer.

Usually, it can be fixed by restarting grafana server:

```shell
cd ./grafana/apps
make env
supervisorctl restart grafana
```
