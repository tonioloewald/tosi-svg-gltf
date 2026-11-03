/*#
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
*/
/*{ "order": 30 }*/

import { sizeSvg } from './size-svg.js'

/** Decode SVG text into an image element sized `width` × `height`. */
export async function decodeSvg(
  svg: string,
  width: number,
  height: number
): Promise<HTMLImageElement> {
  const blob = new Blob([sizeSvg(svg, width, height)], {
    type: 'image/svg+xml',
  })
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image(width, height)
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Rasterize SVG text onto a new `width` × `height` canvas. */
export async function svgToCanvas(
  svg: string,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const img = await decodeSvg(svg, width, height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx == null) throw new Error('svgToCanvas: no 2d context')
  ctx.drawImage(img, 0, 0, width, height)
  return canvas
}
