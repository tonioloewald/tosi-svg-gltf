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
