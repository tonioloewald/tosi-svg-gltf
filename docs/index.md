# tosi-svg-gltf

<!--{"pin":"top","order":1}-->

**SVG textures inside glTF/GLB, rasterized by the viewer at the resolution it needs.**

A 2048 × 2048 texture is 16 MB of GPU memory and, as a PNG, often a megabyte
or more of download. The SVG it was drawn from is usually a few kilobytes.
This project ships the SVG in the model and draws it on the device: as sharp
as that device can show it, no larger than it can afford.

It has two halves that share one small [format](/format/):

| | |
| --- | --- |
| **[Blender add-on](/blender/)** | Import an SVG as an image texture. Blender shows a rasterized preview, and glTF export writes the SVG itself plus a tiny placeholder PNG. [**Download**](/blender/) |
| **This package** (`tosi-svg-gltf`) | A Babylon.js glTF loader extension that finds those SVGs and rasterizes them at the size you choose, plus an engine-agnostic core for anything else. |

A file written this way is still **valid glTF 2.0**. A viewer that has never
heard of it shows the placeholder, a 64 px thumbnail by default.

## Use it with tosijs-3d or Babylon.js

```sh
bun add tosi-svg-gltf
```

```ts:static
import { registerSvgExtension } from 'tosi-svg-gltf/babylon'

// Once, before loading models. Every glTF loader path picks it up,
// including tosijs-3d's b3dLoader and LoadAssetContainerAsync.
registerSvgExtension({
  scale: 1, // × the size the author chose in Blender
  maxResolution: 2048, // and never more than this per side
})
```

That's all. A live example is on the [babylon](/babylon/) page.

`@babylonjs/core` and `@babylonjs/loaders` 9.x are peer dependencies of the
`/babylon` entry only. The package root (`tosi-svg-gltf`) has no dependencies
and does not import Babylon.

## Anything else

The root export is the engine-agnostic part:

- [`readSvgPayload(image)`](/payload/): the SVG payload on a glTF image, or `null`;
- [`textureSize(payload, { scale, maxResolution })`](/payload/): the size to draw it at;
- [`sizeSvg(svg, width, height)`](/size-svg/): set an SVG's pixel size, scaling its content;
- [`svgToCanvas(svg, width, height)`](/hydrate/): rasterize onto a canvas, e.g. for a three.js `CanvasTexture`.

## Why not just export a big PNG?

- **Size on the wire.** Line art, UI panels, labels, diagrams and decals are
  tiny as SVG and large as bitmaps.
- **Memory on the device.** The viewer chooses: 512 px on a phone, 4096 on
  a desktop, the same file for both.
- **Sharpness.** Text and hairlines stay crisp at whatever size you draw them.

It is the wrong tool for photographs, painted textures and noise: anything
that isn't already vector art.

## Develop

```sh
bun install
bun start            # doc site + dev server on https://localhost:8034
bun test             # unit tests
bun blender          # Blender extension: fetch wheels, build the zip, test in Blender
```

See [CLAUDE.md](https://github.com/tonioloewald/tosi-svg-gltf/blob/main/CLAUDE.md)
for how the pieces fit together.
