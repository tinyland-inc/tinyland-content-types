# @tummycrypt/tinyland-content-types

Shared content type definitions for content management and ActivityPub federation.

## Consuming (Bazel only)

This package is not published to npm. Consume it from
[xoxd-ai/bazel-registry](https://github.com/xoxd-ai/bazel-registry):

```starlark
bazel_dep(name = "tummycrypt_tinyland_content_types", version = "1.0.0")
```

```starlark
load("@aspect_rules_js//npm:defs.bzl", "npm_link_package")

npm_link_package(
    name = "node_modules/@tummycrypt/tinyland-content-types",
    src = "@tummycrypt_tinyland_content_types//:pkg",
)
```

## Exports

- `.` — core content types
- `./visibility` — visibility and access control types
- `./activitypub` — ActivityPub federation types
- `./scheduling` — scheduling reference types and helpers

## Visibility semantics

`migrateVisibility(legacy: unknown)` is fail-closed (TIN-2651): only a
recognized legacy string can widen visibility, and nothing maps to `public`
except the explicit `public`/`published` aliases. Matching is case-insensitive
and never trims whitespace.

| Input | Result |
| --- | --- |
| `public`, `published` | `public` |
| `unlisted` | `unlisted` |
| `members`, `followers` | `followers` |
| `admin`, `private`, `draft` | `private` |
| `direct` | `direct` |
| `undefined`, `null`, `''` | `private` (silent) |
| any other string | `private` (warns) |
| any non-string value | `private` (warns) |

The same contract holds at the other runtime edges:

- `noteToDisplay`, `videoToDisplay`, and `galleryItemToDisplay` route raw
  frontmatter visibility through `migrateVisibility` — content without an
  explicit recognized visibility renders `private`, never `public`.
- `getAddressingForVisibility` addresses unknown runtime visibility values to
  the author only, never to the ActivityPub Public collection.

`tests/visibility.test.ts` carries the mapping table as the executable
specification.

## Development

```sh
pnpm install
pnpm typecheck
pnpm test
bazel build //:pkg && bazel test //...
```

TypeScript 7.0.2, vitest 5.0.3 and vite 8.3.3 are pinned exactly. See CHANGELOG.md.
