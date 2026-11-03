# Specification: Dynamic SVG Texture Pipeline for GLB

> **Original plan, kept for its reasoning.** The built version differs, deliberately:
>
> - **Payload location:** `images[i].extras.tosi_svg = {version, svg, width, height}`, not
>   `textureInfo.extras.tosi_svg = {payload, default_resolution}`. The plan wrote it on
>   textureInfo but read it from texture; the image level stores it once per image and
>   carries the aspect ratio. See `format.md`.
> - **No `createImageBitmap`:** Chromium, Firefox and WebKit all reject SVG blobs there.
> - **No `DynamicTexture`:** the Babylon extension hands the sized SVG to Babylon's own image
>   loader (via `onLoading`), so samplers, mipmaps, UV orientation and texture transforms stay
>   Babylon's. `registerSvgExtension(options)` imports the loader registry; no `babylonInstance`.
> - **Blender:** an extension (`blender_manifest.toml` + `wheels = […]`), not `sys.path`
>   juggling; `resvg-py` (abi3 wheels, works on Blender 5's Python 3.13) rather than
>   `resvg-python` (stops at 3.12); only `gather_image_hook` is needed.

This specification defines a dual-environment architecture to embed raw SVG vector data into GLB payloads. By deferring rasterization to the client, it bypasses texture memory and bandwidth bottlenecks (especially on passive-cooled mobile GPUs) and aligns with zero-build, code-first web architectures.

## 1. System Architecture

* **Authoring (`blender-tosi-svg`):** A Blender add-on that ingests SVGs, uses `resvg-python` to create a viewport proxy, and intercepts the glTF export to embed the raw SVG string while swapping the proxy bitmap for a microscopic placeholder.
* **Hydration (`tosi-svg-gltf`):** A zero-dependency ES module that parses the GLB `extras`, offloads SVG decoding to a background thread using `createImageBitmap`, and injects the dynamically scaled `<canvas>` into Babylon.js (or any 3D engine).

---

## 2. TypeScript Client Library: `tosi-svg-gltf`

Designed as a lightweight, framework-agnostic ES module that exports a core DOM hydration function and a specific Babylon.js adapter.

### File Structure

* `src/core/hydrate.ts`: Pure DOM logic. Decoupled from any 3D engine.
* `src/babylon/extension.ts`: Implements Babylon’s `IGLTFLoaderExtension`.
* `src/index.ts`: Public API exports.

### Core Hydration Logic (`src/core/hydrate.ts`)

Must execute off the main thread where possible to prevent blocking JavaScript execution on constrained CPUs.

* **Signature:** `export async function hydrateSvgToCanvas(svgString: string, targetResolution: number): Promise<HTMLCanvasElement>`
* **Implementation Steps:**
1. Wrap `svgString` in a `Blob` (`type: 'image/svg+xml'`) and generate an `ObjectURL`.
2. Prefer `window.createImageBitmap(blob)` for off-thread decoding. Fall back to `HTMLImageElement` if unsupported.
3. Initialize an `OffscreenCanvas` (fallback to standard `HTMLCanvasElement`) sized to `targetResolution`.
4. Draw the decoded image to the canvas context and revoke the Object URL.



### Babylon.js Extension (`src/babylon/extension.ts`)

Registers a custom extension with `BABYLON.GLTFFileLoader`.

* **Signature:** `export function registerSvgExtension(babylonInstance: any, config: { maxResolution?: number } = {})`
* **Extension Class:** Implements `IGLTFLoaderExtension`.
* `name = "TOSI_svg_texture"`.
* Intercepts `loadTextureInfoAsync(context, textureInfo, assign)`.
* Checks `textureInfo.texture.extras.tosi_svg`. If absent, returns `null` to allow standard GLB texture loading.
* If present, halts standard loading, calls `hydrateSvgToCanvas`, feeds the resulting canvas into a `new BABYLON.DynamicTexture`, calls `assign(dynamicTexture)`, and resolves.



---

## 3. Blender Python Plugin: `blender-tosi-svg`

A modular Blender add-on distributed as a `.zip` containing pre-compiled dependencies to avoid system environment configuration for the user.

### File Structure & Dependency Management

* **Structure:**
* `__init__.py`: Registration, UI, and data model extension.
* `ops_import.py`: SVG import operator.
* `glTF2ExportUserExtension.py`: Khronos glTF exporter hooks.
* `dependencies/`: Directory containing `resvg-python` wheels (installed via `pip install --target ./dependencies resvg-python` during release packaging).


* **Initialization:** `__init__.py` must append `./dependencies` to `sys.path` before importing `resvg`.

### Data Model & Import Operator

* **Data Model:** Extend Blender's Image datablock.
```python
import bpy
bpy.types.Image.tosi_svg_payload = bpy.props.StringProperty()
bpy.types.Image.tosi_svg_resolution = bpy.props.IntProperty(default=1024)

```


* **Import Operator (`ops_import.py`):**
1. Reads the selected `.svg` file from disk.
2. Creates a new Image datablock and assigns the text to `tosi_svg_payload`.
3. Uses `resvg-python` to rasterize the SVG at `tosi_svg_resolution`.
4. Packs the rasterized pixels into the Image datablock to serve as a high-quality viewport proxy.



### GLB Export Hook (`glTF2ExportUserExtension.py`)

Intercepts the official glTF 2.0 exporter to manipulate the outgoing texture payloads.

* **Hook 1: `gather_texture_info_hook(self, gltf2_texture_info, blender_shader_sockets, export_settings)**`
* Checks if the connected Blender image contains `tosi_svg_payload`.
* If present, mutates `gltf2_texture_info.extras` to inject the payload structure:
```json
"extras": {
  "tosi_svg": {
    "payload": "<svg>...</svg>",
    "default_resolution": 1024
  }
}

```




* **Hook 2: `gather_image_hook(self, gltf2_image, blender_image, export_settings)**`
* Intercepts the bitmap generation phase.
* If `blender_image` contains an SVG payload, abort exporting the high-resolution viewport proxy.
* Dynamically write a 1x1 pixel transparent PNG (or a heavily compressed 64x64 placeholder) to the glTF image buffer. This ensures strict glTF 2.0 validity while eliminating texture bloat.