# EmitKit Documentation

Official documentation for EmitKit - an event streaming and notification platform focused on awareness, not analysis.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Mintlify CLI

### Installation

```bash
# Install Mintlify CLI globally
npm i -g mint

# Or use the npm script
npm run install-mintlify
```

### Local Development

```bash
# Start local development server
mint dev

# Or use the npm script
npm run dev
```

Visit `http://localhost:3000` to preview the documentation.

## 📚 Documentation Structure

- `/` - Getting started and overview
- `/quickstart` - Quick start guide
- `/sdk/*` - TypeScript SDK documentation
- `/concepts/*` - Core concepts and architecture
- `/self-hosting/*` - Self-hosting guides
- `/api-reference/*` - API reference (auto-generated from OpenAPI)

## 🔄 Syncing OpenAPI Spec

To update the API reference with the latest production spec:

```bash
npm run sync-openapi
```

This will:
1. Fetch the latest OpenAPI spec from `https://api.emitkit.com/api/openapi.json`
2. Preserve custom SDK examples (`x-codeSamples`)
3. Save the merged result to `api-reference/openapi.json`

See [scripts/README.md](./scripts/README.md) for more details.

## 🚢 Deployment

Changes are automatically deployed to production when pushed to the default branch.

Preview changes using pull requests, which generate a preview link.

## 🛠️ Troubleshooting

- **Mintlify dev isn't running**: Run `mint update` to ensure you have the latest CLI
- **Page loads as 404**: Make sure you're running in the folder with `docs.json`
- **OpenAPI sync fails**: Check that `https://api.emitkit.com/api/openapi.json` is accessible

## 📝 Contributing

When updating documentation:

1. Make changes to `.mdx` files
2. Run `mint dev` to preview locally
3. If API changes, run `npm run sync-openapi`
4. Commit and push changes

## 🔗 Links

- [EmitKit Website](https://emitkit.com)
- [GitHub Repository](https://github.com/emitkit)
- [Community Discussions](https://github.com/emitkithq/emitkit/discussions)
