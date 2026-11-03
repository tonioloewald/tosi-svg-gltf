# The format

<!--{"pin":"bottom","order":1}-->

**Version 1.** This is the contract between an exporter (the
[Blender add-on](/blender/)) and a viewer ([this package](/babylon/)). It is
small on purpose, so other exporters and viewers can implement it.

## Where the SVG goes

On a glTF `image`, under `extras.tosi_svg`:

```json
{
  "images": [
    {
      "name": "label",
      "mimeType": "image/png",
      "bufferView": 4,
      "extras": {
        "tosi_svg": {
          "version": 1,
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 256\">…</svg>",
          "width": 1024,
          "height": 512
        }
      }
    }
  ]
}
```

| field | type | meaning |
| --- | --- | --- |
| `version` | integer | `1`. A reader ignores a payload whose version it does not know. |
| `svg` | string | The complete SVG document. |
| `width`, `height` | integer ≥ 1 | The **authored resolution**: the raster size the author previewed it at, and the texture's aspect ratio. |

The image's `uri` or `bufferView` holds a **placeholder** PNG: a small
thumbnail of the SVG, or a 1 × 1 transparent pixel. It exists so the file is
valid glTF 2.0 and so viewers without support show something.

## Why `image.extras`, and not a vendor extension

- **On the image, not the texture or textureInfo:** several textures and
  materials can share one image, so the SVG is stored once. The original
  plan put it on `textureInfo`, which repeats it per material slot.
- **`extras`, not `extensions`:** `extras` needs no `extensionsUsed` entry,
  draws no "unsupported extension" notice from validators, and Blender's
  exporter can write it from any image hook without registering an extension.
  The cost is that nothing declares the file uses it, so a reader has to look
  at each image. That's cheap.

If this is ever proposed as a `KHR_`/`EXT_` extension, the payload moves to
`images[i].extensions.<NAME>` unchanged.

## Reading it

1. For each image, read `extras.tosi_svg`. Treat it as absent unless
   `version` is known, `svg` is a string containing an `<svg` element, and
   `width`/`height` are finite numbers ≥ 1.
2. Choose a raster size. Keep the aspect ratio `width : height`, because the
   model's UVs were laid out against it. Scaling the authored size by a
   device- or quality-dependent factor and capping it at the GPU's maximum
   texture size is the expected policy.
3. Rasterize the SVG so its **viewport fills the raster exactly**: UV (0, 0)
   to (1, 1) covers the SVG's viewport, the way it would cover a PNG export of
   the same SVG at that size.
4. Use the raster wherever the glTF image is used, with the texture's own
   sampler, `texCoord` and texture transform, exactly as for a PNG.
5. Ignore the placeholder.

When rasterizing in a browser, set the root `<svg>`'s `width`/`height` to the
raster size first (adding a `viewBox` from the original size if it has
none). A browser uploads an SVG image to WebGL at its intrinsic size, not
the size you draw it. [`sizeSvg`](/size-svg/) does this.

## Security

Treat `svg` as untrusted input, as you would any image in a file you did not
author. Rasterized as an image (`<img>`, `createImageBitmap`, resvg), an SVG
cannot run script or load external resources. **Never insert it into the
DOM as markup.**

## Writing it

1. Store the SVG text verbatim.
2. `width`/`height`: the size the author chose, aspect ratio matching the
   SVG's viewport.
3. Replace the image's pixels with a placeholder PNG, set `mimeType` to
   `image/png`, and keep everything else about the image, texture and
   sampler unchanged.
