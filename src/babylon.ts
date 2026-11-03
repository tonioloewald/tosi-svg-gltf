/*#
# babylon

`registerSvgExtension(options?)` teaches Babylon's glTF loader to read SVG
textures. Call it once, before loading: every glTF/GLB loaded afterwards,
by any API (`LoadAssetContainerAsync`, `ImportMeshAsync`, tosijs-3d's
`b3dLoader`, …), gets its SVG images rasterized at the size you choose.

```js
import { b3d, b3dLight, b3dLoader } from 'tosijs-3d'
import { orbitCam } from 'tosijs-3d/demo-utils'
import { registerSvgExtension } from 'tosi-svg-gltf/babylon'

registerSvgExtension({ scale: 2 })

preview.append(
  b3d(
    {
      sceneCreated(el) {
        orbitCam(el, { alpha: Math.PI / 2, beta: Math.PI / 2.4, radius: 3.2, target: [0, 0, 0] })
      },
    },
    b3dLight({ intensity: 1.2 }),
    b3dLoader({ url: '/samples/svg-plane.glb' }),
  )
)
```
```css
tosi-b3d { width: 100%; height: 100%; }
```
```test
// LINE COMMENTS ONLY in a fence: a block comment would end the doc comment.
// This fence must stay ADJACENT to the example above: waitFor searches that
// example's preview, and prose between the fences makes them two examples.
const el = await waitFor('tosi-b3d', 30000)
for (let i = 0; i < 600 && !el.scene; i++) await waitMs(50)
let texture = null
for (let i = 0; i < 600 && !texture; i++) {
  texture = el.scene.textures.find((t) => t.name.startsWith('tosi-svg-sample') && t.isReady())
  if (!texture) await waitMs(50)
}

test('the SVG texture loaded at the requested size, not the placeholder', () => {
  expect(Boolean(texture)).toBe(true)
  // authored at 1024 × 1024, registered with scale: 2
  expect(texture.getSize()).toEqual({ width: 2048, height: 2048 })
})
```

That model was exported from Blender by this repo's own test (see
[Blender](/blender/)). Its image holds about 1.4 KB of SVG and a 64 px
placeholder PNG. Zoom in: the edges stay sharp at the 2048 px it was
rasterized at, which is twice what the author set.

## Options

| option | default | what it does |
| --- | --- | --- |
| `scale` | `1` | Multiplies each image's authored size. `0.5` on a phone, `2` for a close-up. |
| `maxResolution` | `4096` | No side exceeds this, or the GPU's own limit if lower. |
| `resolve` | — | `(payload, image) => ({ width, height })` to choose per image; overrides both. |

`scale` and `maxResolution` can also be functions of nothing, read at each
load, so one registration can follow a quality setting.

## How it works

The extension's `onLoading` hook runs before any material loads. For each
image carrying a [payload](/payload/), it:

1. computes the target size,
2. sets the SVG root's `width`/`height` to it ([sizeSvg](/size-svg/)),
3. sets the image's `mimeType` to `image/svg+xml` and pre-seeds its data
   with the SVG bytes, so the placeholder PNG is never read.

Babylon then loads the texture exactly as it would a PNG. The sampler (wrap,
filtering, mipmaps), `texCoord`, `KHR_texture_transform`, sRGB handling,
naming and asset-container ownership are all Babylon's own code path. There
is no `DynamicTexture` and no second copy of the loader's logic.

Images without a payload are untouched. An SVG the browser cannot decode
fails the load, exactly as a corrupt PNG would.

`unregisterSvgExtension()` removes it.
*/
/*{ "order": 40 }*/

import type { GLTFLoader } from '@babylonjs/loaders/glTF/2.0/glTFLoader.js'
import type { IGLTFLoaderExtension } from '@babylonjs/loaders/glTF/2.0/glTFLoaderExtension.js'
import type { IImage } from '@babylonjs/loaders/glTF/2.0/glTFLoaderInterfaces.js'
import {
  registerGLTFExtension,
  unregisterGLTFExtension,
} from '@babylonjs/loaders/glTF/2.0/glTFLoaderExtensionRegistry.js'
import { readSvgPayload, textureSize, type SvgPayload } from './payload.js'
import { sizeSvg } from './size-svg.js'

/** The name the extension registers under with Babylon's glTF loader. */
export const EXTENSION_NAME = 'TOSI_svg_texture'

type Dial = number | (() => number)
const read = (d: Dial | undefined, fallback: number) =>
  d === undefined ? fallback : typeof d === 'function' ? d() : d

export interface SvgExtensionOptions {
  /** Multiplies each image's authored size. Default 1. */
  scale?: Dial
  /** No side exceeds this (nor the GPU's max texture size). Default 4096. */
  maxResolution?: Dial
  /** Choose the size per image; overrides `scale` and `maxResolution`. */
  resolve?: (
    payload: SvgPayload,
    image: IImage
  ) => { width: number; height: number }
}

/** Babylon's loader extension. Exported for tests; use `registerSvgExtension`. */
export class SvgTextureLoaderExtension implements IGLTFLoaderExtension {
  readonly name = EXTENSION_NAME
  enabled = true

  constructor(
    private loader: Pick<GLTFLoader, 'gltf' | 'babylonScene'>,
    private options: SvgExtensionOptions = {}
  ) {}

  onLoading(): void {
    const images = this.loader.gltf.images
    if (images == null) return
    const gpuMax =
      this.loader.babylonScene.getEngine().getCaps().maxTextureSize || 4096
    const maxResolution = Math.min(
      read(this.options.maxResolution, 4096),
      gpuMax
    )
    const scale = read(this.options.scale, 1)
    const encoder = new TextEncoder()
    for (const image of images) {
      const payload = readSvgPayload(image)
      if (payload == null) continue
      const { width, height } = this.options.resolve
        ? this.options.resolve(payload, image)
        : textureSize(payload, { scale, maxResolution })
      // Not one of glTF's declared image types, which is the point.
      ;(image as { mimeType?: string }).mimeType = 'image/svg+xml'
      // `loadImageAsync` returns `_data` when it is set, so the placeholder
      // PNG (uri or bufferView) is never fetched or decoded.
      image._data = Promise.resolve(
        encoder.encode(sizeSvg(payload.svg, width, height))
      )
    }
  }

  dispose(): void {}
}

/**
 * Register the SVG texture extension with Babylon's glTF loader. Calling it
 * again replaces the previous registration (and its options).
 */
export function registerSvgExtension(options: SvgExtensionOptions = {}): void {
  unregisterGLTFExtension(EXTENSION_NAME)
  // `false`: the payload lives in `extras`, not `extensionsUsed`, so the
  // extension is active for every file rather than only files that declare it.
  registerGLTFExtension(
    EXTENSION_NAME,
    false,
    (loader) => new SvgTextureLoaderExtension(loader, options)
  )
}

/** Remove the extension. Returns whether it was registered. */
export function unregisterSvgExtension(): boolean {
  return unregisterGLTFExtension(EXTENSION_NAME)
}
