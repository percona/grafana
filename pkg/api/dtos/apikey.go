package dtos

type NewApiKeyResult struct {
	// example: 1
	ID int64 `json:"id"`
	// example: grafana
	Name string `json:"name"`
	// example: eyJrIjoiWDZTTmtVMjZmcDNWNDA3dE43bGJoVEd2NDFmRkVpMVoiLCJuIjoidGVzdCIsImlkIjoxfQ==a
	Key string `json:"key"`
}
