# Into

This guide is a step-by-step instruction that helps you with local development environment.

## "Standard" flow

This is a typical flow FE are using. In this case you are developing components within Grafana codebase. There is no
good isolation between upstream and our code.

Follow these steps:

1: compile pmm-ui:
```shell
make pmm-ui
```

2: run docker images with PMM and MySQL (in foreground mode):
```shell
docker-compose up
```

3: in separate terminal: 
```shell
yarn start
```

4: make modification in the frondend `./public/app`, once recompilation has finished refresh page with grafana

## Alternative flow with "Microfrontends" (MFE)

This is an alternative and experimental flow intended to make developers more productive and isolate our changes from 
the upstream.

With this approach you run 4 components:
 - devcontainer with PMM
 - grafana server on host
 - grafana ui rebuild/watch task on host 
 - pmm-ui microfrontend on host

Follow [this guide](./apps/DEVELOPMENT.md)
