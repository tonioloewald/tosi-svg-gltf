# Blender add-on

<!--{"pin":"top","order":2}-->

**SVG Textures for glTF** lets you use an SVG file as a texture in Blender
and export it to glTF/GLB **as the SVG itself**. A viewer that supports it
draws the texture sharp at whatever size it needs. Everything else still
sees an ordinary (small) image.

## Download

<p>
  <a class="download" href="/downloads/tosi_svg-0.1.0.zip" download>
    ⬇ Download tosi_svg-0.1.0.zip
  </a>
</p>

Version 0.1.0 · 7.7 MB · Blender 4.2 or later · Windows, macOS and Linux in
one file.

The download is large because it carries the SVG renderer
([resvg](https://github.com/linebender/resvg)) for every platform. Blender
installs only the one for your computer.

## Install

1. Download the `.zip` above. **Don't unzip it.**
2. In Blender, open **Edit → Preferences → Get Extensions**.
3. Click the **⌄** menu at the top right and choose **Install from Disk…**
4. Pick the `.zip`. "SVG Textures for glTF" appears under **Add-ons**, enabled.

You can also drag the `.zip` onto Blender's window.

## Use it

### Import an SVG

**File → Import → SVG as Texture (.svg)**, or in the Image Editor,
**Image → Open SVG as Texture…**

| Option | What it does |
| --- | --- |
| **Resolution** | The longest side, in pixels. This is the size Blender previews it at, and the size a viewer draws by default. |
| **Add to Active Material** | Adds an Image Texture node to the selected object's material (making one if needed), connected to Base Color. |
| **Connect Alpha** | Also connects the texture's transparency to the material's Alpha. |

The result is a normal image texture. Paint with it, bake with it, render it
in Eevee or Cycles. The only difference is that it remembers the SVG it came
from.

> Blender's built-in **File → Import → Scalable Vector Graphics** is a
> different thing: it turns an SVG into curves (3D geometry). Use this add-on
> when you want the SVG as a *texture*.

### Change it

With the image showing in the **Image Editor**, or its Image Texture node
selected in the **Shader Editor**, press **N** for the sidebar. The **SVG
Texture** panel is under the **Image** tab (Image Editor) or the **Node** tab
(Shader Editor):

- **Resolution:** redraws the preview at a new size. This also sets the
  default size viewers draw it at.
- **Fallback Size:** the thumbnail stored for viewers that don't read SVG
  (default 64 px). Set to 0 to store a single transparent pixel instead.
- **Reload SVG:** re-reads the file after you've edited it in Illustrator,
  Inkscape, Figma…
- **Convert to Bitmap:** forgets the SVG. The image then exports as a normal
  PNG.

### Export

**File → Export → glTF 2.0** as usual, as `.glb` or `.gltf`. No options to
set. Each SVG image is written as:

- the SVG text, in the image's `extras`;
- a placeholder PNG where the pixels would have gone.

Check the console after exporting: any image the add-on could not convert is
named there, and it exports as an ordinary bitmap instead.

## What works, what doesn't

**Works:** shapes, paths, strokes, gradients, patterns, clipping, masks,
opacity, transforms, embedded (`data:`) images, and text in fonts installed on
the viewer's device.

**Watch out for:**

- **Text.** A viewer draws text with *its* fonts. If the font isn't
  installed there, it falls back to another and the layout shifts. For
  anything that must look exact (logos, labels), **convert text to outlines /
  paths** in your vector app before saving the SVG.
- **Linked files.** An `<image href="photo.jpg">` that points at another file
  will not be found by the viewer. Embed it, or don't use it.
- **Filters and blend modes** can differ slightly between Blender's preview
  (resvg) and a web browser.
- **Scripts, animation and interactivity** are ignored. A texture is a still
  image.
- **One image per texture.** If Blender's exporter has to *combine* images
  into one (e.g. a color from one image and alpha from another), that
  texture exports as a bitmap.
- **UDIM tiles** are not supported.

## Viewing the result

Any glTF viewer opens the file and shows the placeholder. To see the SVG at
full sharpness the viewer needs SVG support: [tosijs-3d](https://3d.tosijs.net)
and any Babylon.js app using [this package](/babylon/) have it.

## Troubleshooting

**"The SVG renderer (resvg) is not available."** The add-on was installed
without its renderer. Install it from the `.zip` above, not from a folder
or a single `.py` file.

**The import menu item is missing.** Check **Edit → Preferences → Add-ons**:
"SVG Textures for glTF" must be enabled.

**My exported file is still big.** Something else in the scene is large.
Check the console for the add-on's messages, and make sure the texture was
imported with this add-on: its sidebar panel shows the SVG's size in bytes.
