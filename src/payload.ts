/*#
# payload

The wire format, as code. An image in a glTF file carries its SVG in
`images[i].extras.tosi_svg`:

```json
{
  "uri or bufferView": "a small PNG placeholder (valid glTF for any viewer)",
  "mimeType": "image/png",
  "extras": {
    "tosi_svg": { "version": 1, "svg": "<svg …>…</svg>", "width": 1024, "height": 512 }
  }
}
```

`width` × `height` is the size the author rasterized it at in Blender: the
**authored resolution**, and the aspect ratio of the texture. A viewer may
draw it larger or smaller, but keeps that aspect ratio, because the UVs were
laid out against it. [the format](/format/) is the full specification.

`readSvgPayload(image)` returns the payload or `null`. It never throws: a
malformed payload is treated as absent, so the image's placeholder loads as
an ordinary bitmap and the model still opens.

```test
import { readSvgPayload } from 'tosi-svg-gltf'

const image = { extras: { tosi_svg: { version: 1, svg: '<svg/>', width: 64, height: 32 } } }
test('a valid payload is returned', () => {
  expect(readSvgPayload(image).width).toBe(64)
})
test('a missing one is null', () => {
  expect(readSvgPayload({})).toBe(null)
})
```
*/
/*{ "order": 10 }*/

/** The key under an image's `extras`. */
export const EXTRAS_KEY = 'tosi_svg'

/** The format version this library writes and reads. */
export const PAYLOAD_VERSION = 1

export interface SvgPayload {
  /** Format version. Readers refuse a version they do not know. */
  version: number
  /** The SVG document, as text. */
  svg: string
  /** Authored raster width in pixels. */
  width: number
  /** Authored raster height in pixels. */
  height: number
}

const isSize = (n: unknown): n is number =>
  typeof n === 'number' && Number.isFinite(n) && n >= 1

/**
 * The SVG payload on a glTF image, or `null` when there is none or it is
 * malformed. Accepts any object shaped like a glTF image.
 */
export function readSvgPayload(image: unknown): SvgPayload | null {
  if (image == null || typeof image !== 'object') return null
  const extras = (image as { extras?: unknown }).extras
  if (extras == null || typeof extras !== 'object') return null
  const p = (extras as Record<string, unknown>)[EXTRAS_KEY]
  if (p == null || typeof p !== 'object') return null
  const { version, svg, width, height } = p as Record<string, unknown>
  if (version !== PAYLOAD_VERSION) return null
  if (typeof svg !== 'string' || !/<svg[\s>/]/i.test(svg)) return null
  if (!isSize(width) || !isSize(height)) return null
  return { version, svg, width, height }
}

export interface TextureSizeOptions {
  /**
   * Multiplies the authored size: `0.5` halves it on a phone, `2` doubles it
   * for a texture seen close up. Default `1`.
   */
  scale?: number
  /** No side exceeds this. Default `4096`. */
  maxResolution?: number
}

/**
 * The pixel size to rasterize a payload at: the authored size times `scale`,
 * shrunk to fit `maxResolution`, aspect ratio kept, each side at least 1.
 */
export function textureSize(
  payload: Pick<SvgPayload, 'width' | 'height'>,
  options: TextureSizeOptions = {}
): { width: number; height: number } {
  const { scale = 1, maxResolution = 4096 } = options
  const { width, height } = payload
  let factor = scale > 0 && Number.isFinite(scale) ? scale : 1
  const longest = Math.max(width, height) * factor
  if (longest > maxResolution) factor *= maxResolution / longest
  return {
    width: Math.max(1, Math.round(width * factor)),
    height: Math.max(1, Math.round(height * factor)),
  }
}
