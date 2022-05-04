# Development

This integration focuses on Netskope and is using
[Netskope API](https://docs.netskope.com/en/rest-api.html) for interacting with
the Netskope resources.

## Provider account setup

### In Netskope

1. [Generate an API V1 Token](https://docs.netskope.com/en/rest-api-v1-overview.html)

### In Netskope

1. [Generate an API V1 Token](https://docs.netskope.com/en/rest-api-v1-overview.html).
   You can also request this from the tenant admin.

## Authentication

Provide the generated `API_V1_TOKEN` and `TENANT_NAME` to the `.env`. You can
use [`.env.example`](../.env.example) as a reference.

The Access token will be used to authorize requests.
