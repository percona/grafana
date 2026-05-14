package models

import (
	"testing"

	alertingNotify "github.com/grafana/alerting/notify"
	"github.com/grafana/alerting/notify/notifytest"
	"github.com/grafana/alerting/receivers/schema"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/grafana/grafana/pkg/util/testutil"
)

func TestReceiver_Clone(t *testing.T) {
	testCases := []struct {
		name     string
		receiver Receiver
	}{
		{name: "empty receiver", receiver: Receiver{}},
		{name: "empty integration", receiver: Receiver{Integrations: []*Integration{{Config: schema.IntegrationSchemaVersion{}}}}},
		{name: "random receiver", receiver: ReceiverGen()()},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			receiverClone := tc.receiver.Clone()
			assert.Equal(t, tc.receiver, receiverClone)

			for _, integration := range tc.receiver.Integrations {
				integrationClone := integration.Clone()
				assert.Equal(t, *integration, integrationClone)
			}
		})
	}
}

func TestReceiver_EncryptDecrypt(t *testing.T) {
	encryptFn := Base64Enrypt
	decryptnFn := Base64Decrypt
	// Test that all known integration types encrypt and decrypt their secrets.
	for integrationType := range notifytest.AllKnownV1ConfigsForTesting {
		t.Run(string(integrationType), func(t *testing.T) {
			decrypedIntegration := IntegrationGen(IntegrationMuts.WithValidConfig(integrationType))()
			encrypted := decrypedIntegration.Clone()
			typeVersion, ok := alertingNotify.GetSchemaVersionForIntegration(integrationType, schema.V1)
			require.True(t, ok)
			for _, key := range typeVersion.GetSecretFieldsPaths() {
				val, ok, err := extractField(encrypted.Settings, key)
				assert.NoError(t, err)
				if ok {
					encryptedVal, err := encryptFn(val)
					assert.NoError(t, err)
					encrypted.SecureSettings[key.String()] = encryptedVal
				}
			}

			testIntegration := decrypedIntegration.Clone()
			err := testIntegration.Encrypt(encryptFn)
			assert.NoError(t, err)
			require.Equal(t, encrypted, testIntegration)

			err = testIntegration.Decrypt(decryptnFn)
			assert.NoError(t, err)
			assert.Equal(t, decrypedIntegration, testIntegration)
		})
	}
}

func TestIntegration_Redact(t *testing.T) {
	testutil.SkipIntegrationTestInShortMode(t)

	redactFn := func(key string) string {
		return "TESTREDACTED"
	}
	// Test that all known integration types redact their secrets.
	for integrationType := range notifytest.AllKnownV1ConfigsForTesting {
		t.Run(string(integrationType), func(t *testing.T) {
			validIntegration := IntegrationGen(IntegrationMuts.WithValidConfig(integrationType))()

			expected := validIntegration.Clone()
			version, ok := alertingNotify.GetSchemaVersionForIntegration(integrationType, schema.V1)
			require.True(t, ok)
			for _, key := range version.GetSecretFieldsPaths() {
				err := setField(expected.Settings, key, func(current any) any {
					if s, isString := current.(string); isString && s != "" {
						delete(expected.SecureSettings, key.String())
						return redactFn(s)
					}
					return current
				}, true)
				require.NoError(t, err)
			}

			validIntegration.Redact(redactFn)

			assert.Equal(t, expected, validIntegration)
		})
	}
}

func TestIntegration_Validate(t *testing.T) {
	testutil.SkipIntegrationTestInShortMode(t)

	// Test that all known integration types are valid.
	for integrationType := range notifytest.AllKnownV1ConfigsForTesting {
		t.Run(string(integrationType), func(t *testing.T) {
			validIntegration := IntegrationGen(IntegrationMuts.WithValidConfig(integrationType))()
			assert.NoError(t, validIntegration.Encrypt(Base64Enrypt))
			assert.NoErrorf(t, validIntegration.Validate(Base64Decrypt), "integration should be valid")

			invalidIntegration := IntegrationGen(IntegrationMuts.WithInvalidConfig(integrationType))()
			assert.NoError(t, invalidIntegration.Encrypt(Base64Enrypt))
			assert.Errorf(t, invalidIntegration.Validate(Base64Decrypt), "integration should be invalid")
		})
	}
}

func TestIntegration_WithExistingSecureFields(t *testing.T) {
	testutil.SkipIntegrationTestInShortMode(t)

	// Test that WithExistingSecureFields will copy over the secure fields from the existing integration.
	testCases := []struct {
		name         string
		integration  Integration
		secureFields []string
		existing     Integration
		expected     Integration
	}{
		{
			name: "test receiver",
			integration: Integration{
				SecureSettings: map[string]string{
					"f1": "newVal1",
					"f2": "newVal2",
					"f3": "newVal3",
					"f5": "newVal5",
				},
			},
			secureFields: []string{"f2", "f4", "f5"},
			existing: Integration{
				SecureSettings: map[string]string{
					"f1": "oldVal1",
					"f2": "oldVal2",
					"f3": "oldVal3",
					"f4": "oldVal4",
				},
			},
			expected: Integration{
				SecureSettings: map[string]string{
					"f1": "newVal1",
					"f2": "oldVal2",
					"f3": "newVal3",
					"f4": "oldVal4",
				},
			},
		},
		{
			name: "Integration[exists], SecureFields[true], Existing[exists]: old value",
			integration: Integration{
				SecureSettings: map[string]string{"f1": "newVal1"},
			},
			secureFields: []string{"f1"},
			existing:     Integration{SecureSettings: map[string]string{"f1": "oldVal1"}},
			expected:     Integration{SecureSettings: map[string]string{"f1": "oldVal1"}},
		},
		{
			name: "Integration[exists], SecureFields[true], Existing[missing]: no value",
			integration: Integration{
				SecureSettings: map[string]string{"f1": "newVal1"},
			},
			secureFields: []string{"f1"},
			existing:     Integration{SecureSettings: map[string]string{}},
			expected:     Integration{SecureSettings: map[string]string{}},
		},

		{
			name: "Integration[exists], SecureFields[false], Existing[exists]: new value",
			integration: Integration{
				SecureSettings: map[string]string{"f1": "newVal1"},
			},
			existing: Integration{SecureSettings: map[string]string{"f1": "oldVal1"}},
			expected: Integration{SecureSettings: map[string]string{"f1": "newVal1"}},
		},
		{
			name: "Integration[exists], SecureFields[false], Existing[missing]: new value",
			integration: Integration{
				SecureSettings: map[string]string{"f1": "newVal1"},
			},
			existing: Integration{SecureSettings: map[string]string{}},
			expected: Integration{SecureSettings: map[string]string{"f1": "newVal1"}},
		},

		{
			name: "Integration[missing], SecureFields[true], Existing[exists]: old value",
			integration: Integration{
				SecureSettings: map[string]string{},
			},
			secureFields: []string{"f1"},
			existing:     Integration{SecureSettings: map[string]string{"f1": "oldVal1"}},
			expected:     Integration{SecureSettings: map[string]string{"f1": "oldVal1"}},
		},
		{
			name: "Integration[missing], SecureFields[true], Existing[missing]: no value",
			integration: Integration{
				SecureSettings: map[string]string{},
			},
			secureFields: []string{"f1"},
			existing:     Integration{SecureSettings: map[string]string{}},
			expected:     Integration{SecureSettings: map[string]string{}},
		},

		{
			name: "Integration[missing], SecureFields[false], Existing[exists]: no value",
			integration: Integration{
				SecureSettings: map[string]string{},
			},
			existing: Integration{SecureSettings: map[string]string{"f1": "oldVal1"}},
			expected: Integration{SecureSettings: map[string]string{}},
		},
		{
			name: "Integration[missing], SecureFields[false], Existing[missing]: no value",
			integration: Integration{
				SecureSettings: map[string]string{},
			},
			existing: Integration{SecureSettings: map[string]string{}},
			expected: Integration{SecureSettings: map[string]string{}},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tc.integration.WithExistingSecureFields(&tc.existing, tc.secureFields)
			assert.Equal(t, tc.expected, tc.integration)
		})
	}
}

func TestSecretsIntegrationConfig(t *testing.T) {
	// Test that all known integration types have a config and correctly mark their secrets as secure.
	for integrationType := range notifytest.AllKnownV1ConfigsForTesting {
		t.Run(string(integrationType), func(t *testing.T) {
			config, ok := alertingNotify.GetSchemaVersionForIntegration(integrationType, schema.V1)
			require.True(t, ok)

			secrets := config.GetSecretFieldsPaths()
			allSecrets := make(map[string]struct{}, len(secrets))
			for _, key := range secrets {
				allSecrets[key.String()] = struct{}{}
			}

			secretFields := config.GetSecretFieldsPaths()
			for _, path := range secretFields {
				_, isSecret := allSecrets[path.String()]
				assert.Equalf(t, isSecret, config.IsSecureField(path), "field '%s' is expected to be secret", path)
				delete(allSecrets, path.String())
			}
			assert.False(t, config.IsSecureField(schema.ParseIntegrationPath("__--**unknown_field**--__")))
			assert.Empty(t, allSecrets, "mismatched secret fields for integration type %s: %v", integrationType, allSecrets)
		})
	}
}

func TestIntegration_SecureFields(t *testing.T) {
	testutil.SkipIntegrationTestInShortMode(t)

	// Test that all known integration types have a config and correctly mark their secrets as secure.
	for integrationType := range notifytest.AllKnownV1ConfigsForTesting {
		t.Run(string(integrationType), func(t *testing.T) {
			t.Run("contains SecureSettings", func(t *testing.T) {
				validIntegration := IntegrationGen(IntegrationMuts.WithValidConfig(integrationType))()
				expected := make(map[string]bool, len(validIntegration.SecureSettings))
				for _, path := range validIntegration.Config.GetSecretFieldsPaths() {
					if validIntegration.Config.IsSecureField(path) {
						expected[path.String()] = true
						validIntegration.SecureSettings[path.String()] = "test"
						_, _, err := extractField(validIntegration.Settings, path)
						require.NoError(t, err)
						continue
					}
				}
				assert.Equal(t, expected, validIntegration.SecureFields())
			})

			t.Run("contains secret Settings not in SecureSettings", func(t *testing.T) {
				validIntegration := IntegrationGen(IntegrationMuts.WithValidConfig(integrationType))()
				expected := make(map[string]bool, len(validIntegration.SecureSettings))
				for _, path := range validIntegration.Config.GetSecretFieldsPaths() {
					if validIntegration.Config.IsSecureField(path) {
						expected[path.String()] = true
						assert.NoError(t, setField(validIntegration.Settings, path, func(current any) any {
							return "test"
						}, false))
						delete(validIntegration.SecureSettings, path.String())
					}
				}
				assert.Equal(t, expected, validIntegration.SecureFields())
			})
		})
	}
}

// This is a broken type that will error if marshalled.
type broken struct {
	f1 string
}

func (b broken) MarshalJSON() ([]byte, error) {
	return nil, assert.AnError
}
