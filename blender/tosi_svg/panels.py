# SPDX-License-Identifier: Apache-2.0

import os

import bpy

from . import rasterize, svg_image
from .operators import TOSI_SVG_OT_import, _context_image


def _draw(layout, image):
    if not rasterize.available():
        layout.label(text="SVG renderer missing: reinstall", icon="ERROR")
    if not svg_image.is_svg_image(image):
        layout.label(text="Not an SVG texture", icon="INFO")
        layout.operator(TOSI_SVG_OT_import.bl_idname, icon="IMPORT")
        return
    settings = image.tosi_svg
    if settings.filepath:
        layout.label(text=os.path.basename(settings.filepath), icon="FILE")
    width, height = image.size
    layout.label(text=f"{width} × {height} px · {len(settings.source):,} bytes of SVG")
    layout.prop(settings, "resolution")
    layout.prop(settings, "fallback_size")
    row = layout.row(align=True)
    row.operator("tosi_svg.reload", icon="FILE_REFRESH")
    row.operator("tosi_svg.forget", icon="IMAGE_DATA")


class TOSI_SVG_PT_image_editor(bpy.types.Panel):
    bl_label = "SVG Texture"
    bl_space_type = "IMAGE_EDITOR"
    bl_region_type = "UI"
    bl_category = "Image"

    def draw(self, context):
        _draw(self.layout, _context_image(context))


class TOSI_SVG_PT_node_editor(bpy.types.Panel):
    bl_label = "SVG Texture"
    bl_space_type = "NODE_EDITOR"
    bl_region_type = "UI"
    bl_category = "Node"

    @classmethod
    def poll(cls, context):
        node = context.active_node
        return node is not None and node.type == "TEX_IMAGE"

    def draw(self, context):
        _draw(self.layout, _context_image(context))


def menu_import(self, _context):
    self.layout.operator(TOSI_SVG_OT_import.bl_idname, text="SVG as Texture (.svg)")


def menu_image(self, _context):
    self.layout.operator(TOSI_SVG_OT_import.bl_idname, text="Open SVG as Texture…")


classes = (TOSI_SVG_PT_image_editor, TOSI_SVG_PT_node_editor)
