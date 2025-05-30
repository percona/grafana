---
aliases:
  - ../../../auth/jwt/
description: Grafana JWT Authentication
title: Configure JWT Authentication
weight: 500
---

# Configure JWT authentication

You can configure Grafana to accept a JWT token provided in the HTTP header. The token is verified using any of the following:

- PEM-encoded key file
- JSON Web Key Set (JWKS) in a local file
- JWKS provided by the configured JWKS endpoint

This method of authentication is useful for integrating with other systems that
use JWKS but can't directly integrate with Grafana or if you want to use pass-through
authentication in an app embedding Grafana.

## Enable JWT

To use JWT authentication:

1. Enable JWT in the [main config file]({{< relref "../../configure-grafana/" >}}).
1. Specify the header name that contains a token.

```ini
[auth.jwt]
# By default, auth.jwt is disabled.
enabled = true

# HTTP header to look into to get a JWT token.
header_name = X-JWT-Assertion
```

## Configure login claim

To identify the user, some of the claims needs to be selected as a login info. You could specify a claim that contains either a username or an email of the Grafana user.

Typically, the subject claim called `"sub"` would be used as a login but it might also be set to some application specific claim.

```ini
# [auth.jwt]
# ...

# Specify a claim to use as a username to sign in.
username_claim = sub

# Specify a claim to use as an email to sign in.
email_claim = sub

# auto-create users if they are not already matched
# auto_sign_up = true
```

If `auto_sign_up` is enabled, then the `sub` claim is used as the "external Auth ID". The `name` claim is used as the user's full name if it is present.

## Iframe Embedding

If you want to embed Grafana in an iframe while maintaning user identity and role checks,
you can use JWT authentication to authenticate the iframe.

> **Note**: For Grafana Cloud, or scenarios where verifying viewer identity is not required,
> embed [public dashboards]({{< relref "../../../dashboards/dashboard-public" >}}).

In this scenario, you will need to configure Grafana to accept a JWT
provided in the HTTP header and a reverse proxy should rewrite requests to the
Grafana instance to include the JWT in the request's headers.

> **Note**: For embedding to work, you must enable `allow_embedding` in the [security section]({{< relref "../../configure-grafana#allow_embedding" >}}). This setting is not available in Grafana Cloud.

In a scenario where it is not possible to rewrite the request headers you
can use URL login instead.

### URL login

`url_login` allows grafana to search for a JWT in the URL query parameter
`auth_token` and use it as the authentication token.

> **Warning**: this can lead to JWTs being exposed in logs and possible session hijacking if the server is not
> using HTTP over TLS.

```ini
# [auth.jwt]
# ...
url_login = true # enable JWT authentication in the URL
```

An example of an URL for accessing grafana with JWT URL authentication is:

```
http://env.grafana.local/d/RciOKLR4z/board-identifier?orgId=1&kiosk&auth_token=eyJhbxxxxxxxxxxxxx
```

A sample repository using this authentication method is available
at [grafana-iframe-oauth-sample](https://github.com/grafana/grafana-iframe-oauth-sample).

## Signature verification

JSON web token integrity needs to be verified so cryptographic signature is used for this purpose. So we expect that every token must be signed with some known cryptographic key.

You have a variety of options on how to specify where the keys are located.

### Verify token using a JSON Web Key Set loaded from https endpoint

For more information on JWKS endpoints, refer to [Auth0 docs](https://auth0.com/docs/tokens/json-web-tokens/json-web-key-sets).

```ini
# [auth.jwt]
# ...

jwk_set_url = https://your-auth-provider.example.com/.well-known/jwks.json

# Cache TTL for data loaded from http endpoint.
cache_ttl = 60m
```

### Verify token using a JSON Web Key Set loaded from JSON file

Key set in the same format as in JWKS endpoint but located on disk.

```ini
jwk_set_file = /path/to/jwks.json
```

### Verify token using a single key loaded from PEM-encoded file

PEM-encoded key file in PKIX, PKCS #1, PKCS #8 or SEC 1 format.

```ini
key_file = /path/to/key.pem
```

## Validate claims

By default, only `"exp"`, `"nbf"` and `"iat"` claims are validated.

You might also want to validate that other claims are really what you expect them to be.

```ini
# This can be seen as a required "subset" of a JWT Claims Set.
expect_claims = {"iss": "https://your-token-issuer", "your-custom-claim": "foo"}
```

## Roles

Grafana checks for the presence of a role using the [JMESPath](http://jmespath.org/examples.html) specified via the `role_attribute_path` configuration option. The JMESPath is applied to JWT token claims. The result after evaluation of the `role_attribute_path` JMESPath expression should be a valid Grafana role, for example, `Viewer`, `Editor` or `Admin`.

The organization that the role is assigned to can be configured using the `X-Grafana-Org-Id` header.

### JMESPath examples

To ease configuration of a proper JMESPath expression, you can test/evaluate expressions with custom payloads at http://jmespath.org/.

### Role mapping

If the `role_attribute_path` property does not return a role, then the user is assigned the `Viewer` role by default. You can disable the role assignment by setting `role_attribute_strict = true`. It denies user access if no role or an invalid role is returned.

**Basic example:**

In the following example user will get `Editor` as role when authenticating. The value of the property `role` will be the resulting role if the role is a proper Grafana role, i.e. `Viewer`, `Editor` or `Admin`.

Payload:

```json
{
    ...
    "role": "Editor",
    ...
}
```

Config:

```bash
role_attribute_path = role
```

**Advanced example:**

In the following example user will get `Admin` as role when authenticating since it has a role `admin`. If a user has a role `editor` it will get `Editor` as role, otherwise `Viewer`.

Payload:

```json
{
    ...
    "info": {
        ...
        "roles": [
            "engineer",
            "admin",
        ],
        ...
    },
    ...
}
```

Config:

```bash
role_attribute_path = contains(info.roles[*], 'admin') && 'Admin' || contains(info.roles[*], 'editor') && 'Editor' || 'Viewer'
```

### Grafana Admin Role

If the `role_attribute_path` property returns a `GrafanaAdmin` role, Grafana Admin is not assigned by default, instead the `Admin` role is assigned. To allow `Grafana Admin` role to be assigned set `allow_assign_grafana_admin = true`.
