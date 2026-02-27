# Release Process

## Prerequisites

- You have npm publish access to `@ignaciocabeza/bitface`
- You are on the `main` branch with a clean working tree
- All changes for the release are merged

## Steps

### 1. Update the changelog

Edit `CHANGELOG.md`: move items from `[Unreleased]` into a new version heading.

```md
## [X.Y.Z] - YYYY-MM-DD
```

### 2. Verify the build

The `prepublishOnly` script runs tests and builds automatically, but verify manually before bumping:

```bash
npm test
npm run build
```

### 3. Bump the version

```bash
npm version patch   # bug fixes (1.0.1 → 1.0.2)
npm version minor   # new features (1.0.1 → 1.1.0)
npm version major   # breaking changes (1.0.1 → 2.0.0)
```

This updates `package.json` and `package-lock.json` and creates a git tag.

### 4. Check the package contents

```bash
npm pack --dry-run
```

Confirm only `dist/` and `src/svelte/` are included (per the `files` field in `package.json`).

### 5. Log in to npm (if needed)

```bash
npm login
```

This opens a browser to authenticate. You only need to do this once per machine, or when your token expires.

### 6. Publish to npm

```bash
npm publish --access public
```

### 7. Push the release

```bash
git push origin main --tags
```

### 8. Create a GitHub release (optional)

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "See [CHANGELOG.md](CHANGELOG.md) for details."
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **Patch** — bug fixes, docs corrections
- **Minor** — new features, new parts/animations, non-breaking additions
- **Major** — breaking API changes (FaceConfig shape, removed exports, renamed functions)
