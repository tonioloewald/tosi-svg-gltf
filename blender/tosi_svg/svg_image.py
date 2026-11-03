# SPDX-License-Identifier: Apache-2.0
"""The data model: an ordinary Blender Image that also carries SVG source.

The image's pixels are a *proxy*: the SVG rasterized at `resolution`, so the
viewport, Eevee and Cycles show it like any texture. On glTF export the
proxy is swapped for a small placeholder and the SVG text travels instead
(see export_hook.py).
"""

import os

import bpy

from . import rasterize


def is_svg_image(image):
    return image is not None and bool(image.tosi_svg.source)


def _set_png(image, png):
    """Replace an image's pixels with PNG bytes, kept packed in the .blend."""
    image.source = "FILE"
    image.filepath_raw = "//" + bpy.path.clean_name(image.name) + ".png"
    image.file_format = "PNG"
    # Packing again replaces the packed file. (Not unpack(): with no file on
    # disk it fails and logs an ERROR the user would see.)
    image.pack(data=png, data_len=len(png))
    image.reload()


def render_proxy(image):
    """Re-rasterize the proxy at the image's resolution setting."""
    settings = image.tosi_svg
    png, _w, _h = rasterize.rasterize(settings.source, settings.resolution)
    _set_png(image, png)


def create_svg_image(name, svg, resolution, filepath=""):
    """A new Image datablock holding `svg` and a proxy at `resolution`."""
    image = bpy.data.images.new(name, 1, 1, alpha=True)
    image.alpha_mode = "STRAIGHT"
    settings = image.tosi_svg
    # Assigning `resolution` fires its update (a render); set the source last
    # so that render is skipped and only the explicit one below runs.
    settings.resolution = resolution
    settings.filepath = filepath
    settings.source = svg
    render_proxy(image)
    return image


def read_svg_file(filepath):
    with open(filepath, "r", encoding="utf-8-sig") as f:
        svg = f.read()
    if "<svg" not in svg:
        raise ValueError(os.path.basename(filepath) + " is not an SVG file")
    return svg


def payload(image):
    """The glTF `extras.tosi_svg` object for an SVG image."""
    width, height = image.size
    return {
        "version": 1,
        "svg": image.tosi_svg.source,
        "width": int(width),
        "height": int(height),
    }


def placeholder_png(image):
    """What a viewer without SVG support gets: a thumbnail, or 1x1 clear."""
    size = image.tosi_svg.fallback_size
    if size <= 0:
        return rasterize.TRANSPARENT_PIXEL
    png, _w, _h = rasterize.rasterize(image.tosi_svg.source, size)
    return png


def _on_resolution(settings, _context):
    image = settings.id_data
    if is_svg_image(image):
        render_proxy(image)


class TosiSvgSettings(bpy.types.PropertyGroup):
    source: bpy.props.StringProperty(
        name="SVG Source",
        description="The SVG document this image is drawn from",
        options={"HIDDEN"},
    )
    filepath: bpy.props.StringProperty(
        name="SVG File",
        description="Where the SVG was imported from (used by Reload)",
        subtype="FILE_PATH",
    )
    resolution: bpy.props.IntProperty(
        name="Resolution",
        description=(
            "Longest side, in pixels, of the preview Blender draws and of the "
            "texture a viewer draws by default"
        ),
        default=1024,
        min=16,
        max=16384,
        soft_max=8192,
        update=_on_resolution,
    )
    fallback_size: bpy.props.IntProperty(
        name="Fallback Size",
        description=(
            "Longest side of the thumbnail stored for glTF viewers that do not "
            "read SVG. 0 stores a single transparent pixel"
        ),
        default=64,
        min=0,
        max=1024,
    )


def register():
    bpy.utils.register_class(TosiSvgSettings)
    bpy.types.Image.tosi_svg = bpy.props.PointerProperty(type=TosiSvgSettings)


def unregister():
    del bpy.types.Image.tosi_svg
    bpy.utils.unregister_class(TosiSvgSettings)
