package httpclientprovider

import (
	"net/http"

	"github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
)

const ForwardedPerconaTokenMiddlewareName = "forwarded-x-percona-token"

func ForwardedPerconaTokenMiddleware(token string) httpclient.Middleware {
	return httpclient.NamedMiddlewareFunc(ForwardedPerconaTokenMiddlewareName, func(opts httpclient.Options, next http.RoundTripper) http.RoundTripper {
		if token == "" {
			return next
		}
		return httpclient.RoundTripperFunc(func(req *http.Request) (*http.Response, error) {
			req.Header.Set("X-Percona-Token", token)

			return next.RoundTrip(req)
		})
	})
}
