# Changelog

## 1.0.0 (2026-10-10)

Major release for the 2026-10-08 estate uplift (RU1, RU10). It also carries the
fail-closed visibility hardening that was prepared as 0.4.0 (TIN-2651, PR #15)
but never released, and the EventContent fields from the tinyland.dev
`packages/` copy (PR #22). Every 0.3.1 export (`.`, `./visibility`,
`./activitypub`, `./scheduling`) keeps its name.

### Changed (behaviour, TIN-2651)

- `migrateVisibility` accepts `unknown` and maps any non-string input to
  `private` with a warning, instead of throwing or widening.
- `getAddressingForVisibility` addresses unknown runtime visibility values to
  the author only; the previous default branch returned public addressing.
- `noteToDisplay`, `videoToDisplay` and `galleryItemToDisplay` route raw
  frontmatter visibility through `migrateVisibility`; the raw `|| public`
  fallbacks are removed. Content without a recognized explicit visibility now
  renders `private`.

### Added

- `EventContent` gains the optional `collection`, `contactPhone`,
  `currentAttendees` and `eventType` fields that the tinyland.dev app reads
  (ported from its `packages/` copy, RU7).

### Toolchain and distribution

- TypeScript 7.0.2, vitest 5.0.3 and vite 8.3.3 are pinned exactly (RU1, RU5,
  RU13); fast-check, @fast-check/vitest and publint move to their current
  lines. No TypeScript 7 patch is needed for this package.
- tsconfig uses `module`/`moduleResolution` `NodeNext` (the sources already
  carry `.js` specifiers), `lib` `ES2022` only, and lists `"types": ["node"]`,
  which TypeScript 6+ no longer infers.
- Bazel: aspect_rules_ts 3.10.1 with the `typescript` extension at 7.0.2
  (`ts_project` keeps `transpiler = "tsc"`), a `//:typecheck` target, and
  `package.json` in the `vitest_test` data. vitest excludes Bazel runfiles so
  tests no longer run twice under `bazel test`.
- Distribution is Bazel only (RU6, RU8): the package is `private`, and the
  publish workflow, `publishConfig` and `prepublishOnly` are removed.
- Repository, homepage and bugs URLs point at xoxd-ai.

### Migration

1. Stop installing `@tummycrypt/tinyland-content-types` from npmjs or GitHub
   Packages; 0.3.x there is frozen and will be marked deprecated.
2. Re-pin: `bazel_dep(name = "tummycrypt_tinyland_content_types", version = "1.0.0")`
   from xoxd-ai/bazel-registry, and link it with
   `npm_link_package(name = "node_modules/@tummycrypt/tinyland-content-types", src = "@tummycrypt_tinyland_content_types//:pkg")`.
3. Imports are unchanged. Callers that relied on missing or unknown
   visibility rendering or federating as `public` must set an explicit
   `visibility: public` in frontmatter.

## 0.3.1

- `migrateVisibility` maps `undefined`, `null`, and the empty string to
  `private` instead of `public` (PR #12); version authorities synchronized at
  0.3.1 (PR #13).

## 0.3.0

- `migrateVisibility` fails closed: unknown or misspelled visibility values
  warn and return `private` instead of `public` (PR #11).
