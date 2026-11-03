# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Shared engineering practices** live at
> **https://github.com/tonioloewald/tosijs-coding-practices**, checked out beside this repo at
> [`../tosijs-coding-practices`](../tosijs-coding-practices/README.md). Read that index first
> (and `git pull --no-rebase` it). This file records only what is **specific to or divergent
> from** those defaults; when they conflict, this file wins.

## What this is

SVG textures inside glTF/GLB, rasterized by the viewer. Two halves, one contract:

- **`blender/tosi_svg/`**: a Blender 4.2+ *extension* (manifest + bundled wheels, not a legacy
  `bl_info` add-on). Imports an SVG as an Image datablock whose pixels are a resvg-rendered
  proxy; on glTF export it writes the SVG into the image's `extras` and swaps the proxy for a
  placeholder PNG.
- **`src/`**: the npm package `tosi-svg-gltf`. Root export = dependency-free core
  (`payload.ts`, `size-svg.ts`, `hydrate.ts`); `tosi-svg-gltf/babylon` = Babylon.js 9 loader
  extension.
- **`format.md`** is the contract (`images[i].extras.tosi_svg = {version, svg, width, height}`).
  Change it only together with both halves, and bump `version` for anything a v1 reader would
  misread.

**First consumer: tosijs-3d.** Design decisions favour how tosijs-3d loads models (ESM
`@babylonjs/*` 9.x, `b3dLoader`, `LoadAssetContainerAsync`), so `/babylon` imports Babylon's
loader registry directly rather than taking a `BABYLON` global.

## Commands

```sh
bun install
bun start                 # bun format, then the doc site dev server (https://localhost:8034)
bun run build             # doc site → docs/ AND library → dist/ (emitLibrary)
bun test                  # unit + repo-consistency tests
bun test src/size-svg     # one file (path substring)
bun run check             # tsc + prettier --check + bun test
bun blender               # wheels → build zip → install in isolated Blender → end-to-end test
bun blender test --stub   # Blender test from source with a pure-Python rasterizer (no wheels)
```

`bun blender test` also **rewrites `static/samples/svg-plane.glb`**, the model the
`/babylon/` live example loads. After `--stub` it carries a solid-colour fallback thumbnail;
run the full `bun blender` before committing it. Blender is found at
`/Applications/Blender.app` (or `$BLENDER`); every run uses a temp `BLENDER_USER_RESOURCES`
and `--factory-startup`, so it never touches the user's own Blender setup.

## How the Babylon side works (read before changing `src/babylon.ts`)

It does **not** create textures. `onLoading()` runs before any material loads; for each image
with a payload it sets `image.mimeType = 'image/svg+xml'` and pre-seeds `image._data` with the
SVG bytes (root `width`/`height` rewritten to the target size by `sizeSvg`). Babylon's
`loadImageAsync` returns `_data` when set, so the placeholder is never read, and Babylon's own
`_createTextureAsync` handles sampler, mipmaps, `invertY: false`, sRGB, `texCoord`,
`KHR_texture_transform` and container ownership exactly as for a PNG. Keep it that way:
replacing the texture (`DynamicTexture`, `loadTextureInfoAsync`) means re-implementing all of
that and getting UV orientation wrong. Registered with `isGLTFExtension: false` because the
payload is in `extras`, not `extensionsUsed`.

Verified facts this rests on (re-verify if you touch them):
- Chromium, Firefox and WebKit all **reject** SVG blobs in `createImageBitmap`, so decoding
  goes through `<img>` (Babylon's `LoadImage` does the same).
- A browser uploads an SVG `<img>` to WebGL at its **intrinsic** size, which is why
  `sizeSvg` rewrites the root size (adding a `viewBox` when absent so it scales, not crops).
- Orientation: the sample plane's text reads correctly from the front (+Z camera) in
  tosijs-3d. A mirrored result means you are looking at the back of a double-sided plane.

`"sideEffects": false` is correct **only because nothing registers at import time**.
Registration is the explicit `registerSvgExtension()` call. Keep it that way, or drop the flag
(model-priors #4).

## How the Blender side works (read before changing `blender/`)

- The glTF exporter finds user extensions by walking `bpy.context.preferences.addons` and
  reading `glTF2ExportUserExtension` **off the add-on package module**, so `__init__.py`
  must import it. `--addons` on the command line loads a module without listing it in
  preferences; tests call `addon_enable` for that reason.
- `gather_image_hook` arguments vary across Blender releases; `export_hook.py` finds the
  Blender images by shape (`ExportImage.fills`, `.original`, socket tuples), not position.
  GLB: replace `buffer_view` with a new `BinaryData`. `.gltf`+files: mutate the existing
  `ImageData` in place. Its `uri` was already assigned by `set_real_uri`, and a new one
  crashes `finalize_images`.
- Proxy pixels: `image.pack(data=png)` + `reload()`. Re-packing replaces the packed file.
  Don't `unpack()` first: with no file on disk it logs an ERROR the user sees.
- `rasterize.backend` is the single resvg seam; the `--stub` test swaps it.
- Wheels: `resvg-py` (abi3, cp310+), **not** `resvg-python` (no wheels past cp312; Blender 5
  ships Python 3.13). `blender_manifest.toml` lists them; `blender/wheels.lock.json` pins
  url + sha256 from PyPI; `bun blender wheels` refuses on any mismatch. To bump: edit both,
  regenerate the lock from PyPI's JSON API.
- Only tested on Blender 5.2. `blender_version_min = "4.2.0"` is the extension-format floor,
  not a tested floor; the 4.2 import-path fallbacks in `export_hook.py` are untested.

## Docs and downloads

tosijs-ui doc system (`site.config.ts`, `bin/site.ts`, `demo/site.ts`). Pages come from
`/*# */` blocks in `src/` plus `README.md` (home), `blender.md` (the **artist-facing** page:
download, install, use, limits, and written for Blender users rather than developers),
`format.md`, `CHANGELOG.md`.

- Root doc filenames are **lowercase on purpose**: the slug is the filename, and GitHub Pages
  is case-sensitive (`BLENDER.md` → `/BLENDER/`, and a `/blender/` link 404s).
- A ` ```test ` fence must sit **directly after** the example it tests: `waitFor` searches
  only that example's preview, and prose between fences splits them into two examples.
- The download is `static/downloads/tosi_svg-<version>.zip` (committed, served by Pages),
  with `latest.json` (sha256). `tests/repo.test.ts` fails if the npm version, manifest
  version, `blender.md`'s link/version/size and the zip disagree. One version number covers
  both halves.
- Site domain `svg-gltf.tosijs.net` is set in `site.config.ts` (writes `docs/CNAME`); DNS is
  the owner's to set up.

## Divergences from the shared practices

- **Python in the repo** (the Blender extension), outside Bun/TS. Not linted; tested
  end-to-end in a real Blender by `bun blender`. CI cannot run that lane (no Blender).
- **No tosijs state, no components:** a loader extension and a format, nothing observant.
- **Prettier style is explicit** in `.prettierrc` (single quotes, no semicolons, matching
  tosijs-3d), and markdown is excluded via `requirePragma` (rollout).
- `PLAN.md` is the original spec, kept for its reasoning; where it and the code differ, the
  code and `format.md` win (see its header).
