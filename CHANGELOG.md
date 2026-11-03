# Changelog

<!--{"pin":"bottom","order":2}-->

All notable changes to this project are documented here, in
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. The npm
package and the Blender extension share one version number.

## Unreleased

## 0.1.0

First version.

### Added

- **Format v1:** `images[i].extras.tosi_svg = { version, svg, width, height }`
  plus a placeholder PNG ([the format](/format/)).
- **`tosi-svg-gltf/babylon`:** `registerSvgExtension({ scale, maxResolution, resolve })`,
  a Babylon.js 9 glTF loader extension that rasterizes SVG images at the
  chosen size through Babylon's own texture path.
- **`tosi-svg-gltf`:** the dependency-free core: `readSvgPayload`,
  `textureSize`, `sizeSvg`, `svgToCanvas`.
- **Blender extension `tosi_svg` (Blender 4.2+):** import SVG as texture,
  resolution and fallback controls, reload, and glTF export of the SVG
  with a 64 px placeholder. Bundles resvg-py 0.5.0 wheels for Windows,
  macOS and Linux (x64 and arm64).
