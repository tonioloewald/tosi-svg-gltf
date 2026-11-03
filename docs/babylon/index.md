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
