# SPDX-License-Identifier: Apache-2.0
"""SVG Textures for glTF.

Import an SVG as an image texture. Blender shows a rasterized preview; glTF
export ships the SVG itself, and a viewer with tosi-svg-gltf rasterizes it at
whatever resolution the device warrants.

Docs: https://svg-gltf.tosijs.net/blender/
"""

import bpy

from . import operators, panels, svg_image

# The glTF exporter looks this name up on the add-on's module.
from .export_hook import glTF2ExportUserExtension  # noqa: F401

_classes = operators.classes + panels.classes


def register():
    svg_image.register()
    for cls in _classes:
        bpy.utils.register_class(cls)
    bpy.types.TOPBAR_MT_file_import.append(panels.menu_import)
    bpy.types.IMAGE_MT_image.append(panels.menu_image)


def unregister():
    bpy.types.IMAGE_MT_image.remove(panels.menu_image)
    bpy.types.TOPBAR_MT_file_import.remove(panels.menu_import)
    for cls in reversed(_classes):
        bpy.utils.unregister_class(cls)
    svg_image.unregister()
