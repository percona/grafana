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

# 2: Development

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

Following needs to be executed only once, container recreated (e.g. if you executed `make dev` or after clean container start):

```shell
make build-go
```

To recompile Grafana Server and run:

```shell
make env # enter container
make grafana-update #recompile, replace and start as grafana service
```

To debug Grafana Server, it has to be first compiled with debug symbols (e.g. by running `make grafana-update`).

For ARM architecture (Apple M1/M2 CPUs), you should run native image, when running AMD64 in emulation debugging will not work. 

```shell
make grafana-debug
```

Next, connect to debugger with `go remote` debug session in IDE, connect to port `2350`.
