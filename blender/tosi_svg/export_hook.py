# SPDX-License-Identifier: Apache-2.0
"""glTF export: send the SVG, not the pixels.

Blender's glTF exporter calls `gather_image_hook` on every user extension
it finds on an enabled add-on's module (the class must be an attribute of
the package, see __init__.py). For an image with SVG source this:

1. writes `extras.tosi_svg = {version, svg, width, height}` on the glTF image;
2. replaces the image's encoded proxy with a small placeholder PNG, so the
   file stays valid glTF 2.0 and any viewer still shows *something*.

A failure here is logged by the exporter and the image exports as the plain
proxy bitmap: a bigger file, never a broken one.
"""

import bpy

from . import svg_image

EXTRAS_KEY = "tosi_svg"


def _binary_data_class():
    # The exporter's modules were renamed at some point (gltf2_io_* prefixes
    # dropped); try the current name, then the old one.
    try:
        from io_scene_gltf2.io.exp.binary_data import BinaryData
    except ImportError:
        from io_scene_gltf2.io.exp.gltf2_io_binary_data import BinaryData
    return BinaryData


def _replace_image_data(image_data, png):
    """Swap the bytes of a .gltf+files image in place. Its uri was already
    assigned (and de-duplicated against the other images) by the exporter,
    so keep it, only correcting the extension if the original was not PNG."""
    image_data._data = png
    image_data._mime_type = "image/png"
    uri = getattr(image_data, "_uri", None)
    if isinstance(uri, str) and not uri.lower().endswith(".png"):
        image_data._uri = uri.rsplit(".", 1)[0] + ".png"


def _blender_images(args, export_settings):
    """Every Blender image the exporter composed this glTF image from.

    The hook's positional arguments differ across Blender versions, so look
    for what we need by shape rather than by position.
    """
    found = []
    for arg in args:
        fills = getattr(arg, "fills", None)  # an ExportImage
        if isinstance(fills, dict):
            for fill in fills.values():
                image = getattr(fill, "image", None)
                if isinstance(image, bpy.types.Image) and image not in found:
                    found.append(image)
        original = getattr(arg, "original", None)
        if isinstance(original, bpy.types.Image) and original not in found:
            found.append(original)
        if isinstance(arg, (tuple, list)):  # shader sockets
            for socket in arg:
                node = getattr(getattr(socket, "socket", socket), "node", None)
                image = getattr(node, "image", None)
                if isinstance(image, bpy.types.Image) and image not in found:
                    found.append(image)
    return found


class glTF2ExportUserExtension:
    def gather_image_hook(self, gltf2_image, *args):
        export_settings = args[-1]
        if gltf2_image is None:
            return
        images = [i for i in _blender_images(args[:-1], export_settings) if svg_image.is_svg_image(i)]
        if not images:
            return
        if len(images) > 1:
            export_settings["log"].warning(
                "SVG textures: "
                + ", ".join(i.name for i in images)
                + " were packed into one glTF image (e.g. color + alpha from different "
                "images); exporting it as a bitmap"
            )
            return
        image = images[0]

        extras = dict(gltf2_image.extras or {})
        extras[EXTRAS_KEY] = svg_image.payload(image)
        gltf2_image.extras = extras

        uri = gltf2_image.uri
        if gltf2_image.buffer_view is None and not hasattr(uri, "_data"):
            # A .gltf that references the original file by path: nothing of
            # ours to swap. The SVG still travels; the proxy is not copied.
            export_settings["log"].warning(
                "SVG textures: " + image.name + " is exported by reference; "
                "its placeholder is the referenced file"
            )
            return
        png = svg_image.placeholder_png(image)
        gltf2_image.mime_type = "image/png"
        if gltf2_image.buffer_view is not None:  # GLB / embedded
            gltf2_image.buffer_view = _binary_data_class()(data=png)
        else:  # .gltf + separate files
            _replace_image_data(uri, png)
