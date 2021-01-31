package gtime

import (
	"fmt"
	"regexp"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestParseInterval(t *testing.T) {
	now := time.Now()

	tcs := []struct {
		inp      string
		duration time.Duration
		err      *regexp.Regexp
	}{
		{inp: "1d", duration: now.Sub(now.AddDate(0, 0, -1))},
		{inp: "1w", duration: now.Sub(now.AddDate(0, 0, -7))},
		{inp: "2w", duration: now.Sub(now.AddDate(0, 0, -14))},
		{inp: "1M", duration: now.Sub(now.AddDate(0, -1, 0))},
		{inp: "1y", duration: now.Sub(now.AddDate(-1, 0, 0))},
		{inp: "5y", duration: now.Sub(now.AddDate(-5, 0, 0))},
		{inp: "invalid-duration", err: regexp.MustCompile(`^time: invalid duration "?invalid-duration"?$`)},
	}
	for i, tc := range tcs {
		t.Run(fmt.Sprintf("testcase %d", i), func(t *testing.T) {
			res, err := ParseInterval(tc.inp)
			if tc.err == nil {
				require.NoError(t, err, "input %q", tc.inp)
				require.Equal(t, tc.duration, res, "input %q", tc.inp)
			} else {
				require.Error(t, err, "input %q", tc.inp)
				require.Regexp(t, tc.err, err.Error())
			}
		})
	}
}
