# SPDX-License-Identifier: GPL-3.0-or-later
"""End-to-end test of the extension, run INSIDE Blender by bin/blender.ts:

    blender -b --factory-startup --python-exit-code 1 \
        --python blender/tests/export_test.py -- <sample.svg> <out.glb> [--stub]

The extension must already be installed and enabled in the (isolated) user
repository `user_default`. With --stub, resvg is replaced by a pure-Python
rasterizer that draws a solid colour at the right size: everything except
resvg's own rendering is exercised.
"""

import json
import os
import re
import struct
import sys
import tempfile

import bpy

argv = sys.argv[sys.argv.index("--") + 1 :]
SAMPLE, OUT = argv[0], argv[1]
STUB = "--stub" in argv

MODULE = "bl_ext.user_default.tosi_svg"
# Enable through preferences, as a user's checkbox does: the glTF exporter
# finds user extensions by walking preferences.addons, and `--addons` alone
# loads the module without listing it there.
if MODULE not in bpy.context.preferences.addons:
    bpy.ops.preferences.addon_enable(module=MODULE)
assert MODULE in bpy.context.preferences.addons, MODULE + " is not enabled"
from bl_ext.user_default.tosi_svg import rasterize, svg_image  # noqa: E402

failures = []


def check(cond, message):
    print(("  ok    " if cond else "  FAIL  ") + message)
    if not cond:
        failures.append(message)


if STUB:

    def stub(svg, width=None, height=None):
        m = re.search(r'viewBox="\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)', svg)
        vw, vh = (float(m.group(1)), float(m.group(2))) if m else (100.0, 100.0)
        if width is not None:
            w, h = width, max(1, round(width * vh / vw))
        else:
            w, h = max(1, round(height * vw / vh)), height
        return rasterize.encode_png(w, h, b"\x2f\x9e\x8f\xff" * (w * h))

    rasterize.backend = stub
    print("tosi_svg test: STUB rasterizer (resvg not exercised)")
else:
    check(rasterize.available(), "resvg is importable from the installed wheels")


def read_glb(path):
    with open(path, "rb") as f:
        data = f.read()
    magic, _version, length = struct.unpack("<III", data[:12])
    assert magic == 0x46546C67 and length == len(data), "not a GLB"
    json_len, json_type = struct.unpack("<II", data[12:20])
    assert json_type == 0x4E4F534A
    gltf = json.loads(data[20 : 20 + json_len])
    rest = data[20 + json_len :]
    bin_len, _bin_type = struct.unpack("<II", rest[:8])
    return gltf, rest[8 : 8 + bin_len]


# -- scene: one plane, nothing else ------------------------------------------
# (Not read_factory_settings: that would also unload the extension.)
for collection in (bpy.data.objects, bpy.data.meshes, bpy.data.materials, bpy.data.images):
    for item in list(collection):
        collection.remove(item)
bpy.ops.mesh.primitive_plane_add(size=2)
plane = bpy.context.active_object
plane.name = "svg-plane"
plane.rotation_euler = (1.5708, 0, 0)  # face -Y, i.e. the default front view

print("import operator")
with open(SAMPLE, encoding="utf-8") as f:
    source = f.read()
result = bpy.ops.tosi_svg.import_svg(filepath=SAMPLE, resolution=1024)
check(result == {"FINISHED"}, "import_svg finished")
image = bpy.data.images.get("tosi-svg-sample")
check(image is not None, "image named after the file")
check(svg_image.is_svg_image(image), "image carries SVG source")
check(image.tosi_svg.source == source, "source is the file's text, verbatim")
check(tuple(image.size) == (1024, 1024), f"proxy is 1024x1024 (got {tuple(image.size)})")
check(image.packed_file is not None, "proxy is packed into the .blend")

material = plane.active_material
check(material is not None, "plane got a material")
nodes = material.node_tree.nodes if material else []
tex = next((n for n in nodes if n.type == "TEX_IMAGE"), None)
bsdf = next((n for n in nodes if n.type == "BSDF_PRINCIPLED"), None)
check(tex is not None and tex.image == image, "Image Texture node uses it")
check(
    bsdf is not None and bsdf.inputs["Base Color"].links[0].from_node == tex,
    "wired to Base Color",
)

print("resolution update")
image.tosi_svg.resolution = 256
check(tuple(image.size) == (256, 256), f"proxy follows resolution (got {tuple(image.size)})")
image.tosi_svg.resolution = 1024

print("aspect ratio")
wide = svg_image.create_svg_image(
    "wide", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"/>', 300
)
tall = svg_image.create_svg_image(
    "tall", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"/>', 300
)
check(tuple(wide.size) == (300, 150), f"wide SVG: long side 300 (got {tuple(wide.size)})")
check(tuple(tall.size) == (150, 300), f"tall SVG: long side 300 (got {tuple(tall.size)})")
bpy.data.images.remove(wide)
bpy.data.images.remove(tall)

print("GLB export")
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB")
gltf, binary = read_glb(OUT)
images = gltf.get("images", [])
check(len(images) == 1, "one glTF image")
payload = images[0].get("extras", {}).get("tosi_svg") if images else None
check(payload is not None, "image has extras.tosi_svg")
if payload:
    check(payload == {"version": 1, "svg": source, "width": 1024, "height": 1024},
          "payload is {version, svg, width, height}")
    view = gltf["bufferViews"][images[0]["bufferView"]]
    png = binary[view.get("byteOffset", 0) : view.get("byteOffset", 0) + view["byteLength"]]
    check(images[0]["mimeType"] == "image/png", "placeholder is PNG")
    check(rasterize.png_size(png) == (64, 64), f"placeholder is the 64px thumbnail (got {rasterize.png_size(png)})")
    print(f"  info  GLB {os.path.getsize(OUT):,} bytes; placeholder {len(png):,} bytes; SVG {len(source):,} bytes")

print("separate .gltf export, 1px fallback")
image.tosi_svg.fallback_size = 0
with tempfile.TemporaryDirectory() as tmp:
    path = os.path.join(tmp, "plane.gltf")
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLTF_SEPARATE")
    with open(path) as f:
        sep = json.load(f)
    img = sep["images"][0]
    check("tosi_svg" in img.get("extras", {}), "separate: extras present")
    with open(os.path.join(tmp, img["uri"]), "rb") as f:
        sep_png = f.read()
    check(sep_png == rasterize.TRANSPARENT_PIXEL, "separate: 1x1 transparent placeholder file")
image.tosi_svg.fallback_size = 64

print("ordinary bitmaps are untouched")
image.tosi_svg.source = ""
with tempfile.TemporaryDirectory() as tmp:
    path = os.path.join(tmp, "bitmap.glb")
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB")
    plain, _ = read_glb(path)
    check("extras" not in plain["images"][0], "no extras on a plain image")

if failures:
    print(f"\n{len(failures)} FAILED")
    sys.exit(1)
print("\nall passed" + (" (STUB rasterizer)" if STUB else ""))
