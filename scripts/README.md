# Documentation Scripts

## sync-openapi.js

Automatically fetches the latest OpenAPI specification from production and merges it with our custom SDK examples.

### Usage

```bash
pnpm run sync-openapi
```

### What it does

1. Fetches the latest OpenAPI spec from `https://api.emitkit.com/api/openapi.json`
2. Preserves the custom `x-codeSamples` we've added for SDK examples
3. Merges the production spec with our enhancements
4. Saves the result to `api-reference/openapi.json`

### SDK Examples

The script preserves SDK examples for:
- `POST /v1/events` - 4 examples (JavaScript with variations + cURL)
- `POST /v1/identify` - 4 examples (JavaScript with variations + cURL)

These examples are manually maintained in the script and will be preserved across syncs.

### When to run

Run this script:
- After API changes are deployed to production
- To ensure documentation stays in sync with the live API
- Before publishing documentation updates

### Notes

The script will exit with an error if:
- The production API is unreachable
- The OpenAPI spec is invalid JSON
- File write permissions are insufficient
