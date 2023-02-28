include Makefile.include

init:								## Prepares local development environment.
	cd ../ && make build-go; \
	yarn install --immutable; \
	cd ./apps/pmm-ui && npm install

dev:								## Starts local development.
	make env-down; \
	make env-up; \
	find ./.config/grafana/plugins ! -name '.gitkeep' -type f -exec rm -f {} +; \
	docker cp pmm-grafana-dev:/srv/grafana/plugins/. ./.config/grafana/plugins/; \
	find ./.config/grafana/percona-dashboards ! -name '.gitkeep' -type f -exec rm -f {} +; \
	docker cp pmm-grafana-dev:/usr/share/percona-dashboards/. ./.config/grafana/percona-dashboards/; \
	yarn start

env-up:								## Starts devcontainer.
	docker-compose -f docker-compose.dev.yaml build --no-cache; \
	docker-compose -f docker-compose.dev.yaml up -d

ui-up:
	cd pmm-ui && npm run dev:federation

env-down:							## Stops devcontainer.
	docker-compose -f docker-compose.dev.yaml down --remove-orphans

TARGET ?= _bash
DEV_CONTAINER ?= pmm-grafana-dev
DEV_WORKSPACE_LOCATION ?= /workspace

.PHONY: env
env:								## Runs `make TARGET` in devcontainer (`make env TARGET=help`); TARGET defaults to bash.
	docker exec -it --workdir=$(DEV_WORKSPACE_LOCATION) $(DEV_CONTAINER) make $(TARGET)

.PHONY: help
default: help

help:                           ## Displays help.
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | \
		awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'
