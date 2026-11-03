# hydrate

`svgToCanvas(svg, width, height)` rasterizes SVG text onto a new canvas of
exactly that size. It is the engine-agnostic half of the library: anything
that can make a texture from a canvas (three.js `CanvasTexture`, a raw WebGL
`texImage2D`, a 2D game) can use it. The [Babylon adapter](/babylon/) does
**not** go through it: it hands the sized SVG to Babylon's own image loader,
which keeps the glTF sampler, mipmaps and orientation exactly as for a PNG.

```js
import { svgToCanvas } from 'tosi-svg-gltf'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <circle cx="5" cy="5" r="4" fill="#2f9e8f"/>
  <path d="M3 5h4M5 3v4" stroke="white" stroke-width="0.6"/>
</svg>`

const small = await svgToCanvas(svg, 16, 16)
const large = await svgToCanvas(svg, 256, 256)
small.style.width = large.style.width = '128px'
small.style.imageRendering = 'pixelated'
preview.append(small, large)
```

The left canvas is the same SVG drawn at 16 px, the right at 256 px. A
texture made from an SVG is only as sharp as the size you rasterize it at.
That size is what the [Babylon adapter](/babylon/) chooses per device.

## How it decodes

The SVG goes into a `Blob`, then an `<img>`, and `img.decode()` resolves
once the browser has it ready to draw. `createImageBitmap(blob)` would be
the obvious off-thread route, but browsers refuse SVG blobs there (they
reject with "the source image could not be decoded"), so this library does
not try it.

An SVG drawn as an image **cannot run script or fetch anything**: browsers
treat it as an isolated, static document. That is the security model for
loading an SVG from a model file you did not author, and it is also why a
web font the page has loaded does not reach the texture. Use system fonts,
or convert text to paths before export.
