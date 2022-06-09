package api

import (
	"github.com/grafana/grafana/pkg/api/response"
	"github.com/grafana/grafana/pkg/util"
	"os"
)

func GetPerconaSaasHost() response.Response {
	saasHost := ""
	envHost, ok := os.LookupEnv("PERCONA_TEST_PLATFORM_ADDRESS")

	if ok {
		saasHost = envHost
	}

	return response.JSON(200, util.DynMap{
		"host": saasHost,
	})
}
