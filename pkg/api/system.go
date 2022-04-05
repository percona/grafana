package api

import (
	"github.com/grafana/grafana/pkg/api/response"
	"github.com/grafana/grafana/pkg/util"
	"os"
	"regexp"
)

func GetPerconaSaasHost() response.Response {
	saasHost := "https://portal.percona.com"
	envHost, ok := os.LookupEnv("PERCONA_TEST_SAAS_HOST")

	if ok {
		matched, _ := regexp.MatchString(`(?m)check-dev.percona.com`, envHost)

		if matched {
			saasHost = "https://platform-dev.percona.com"
		}
	}

	return response.JSON(200, util.DynMap{
		"host": saasHost,
	})
}
