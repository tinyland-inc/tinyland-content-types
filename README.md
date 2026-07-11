# @tummycrypt/tinyland-content-types

Shared content type definitions for content management and ActivityPub federation.

## Install

```sh
pnpm add @tummycrypt/tinyland-content-types
```

## Exports

- `.` — core content types
- `./visibility` — visibility and access control types
- `./activitypub` — ActivityPub federation types

## Visibility migration

`migrateVisibility` preserves the legacy mappings used by the package. Missing
(`undefined` or `null`) and empty-string inputs fail closed to `private`.
