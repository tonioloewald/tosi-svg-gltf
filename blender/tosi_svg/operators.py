# SPDX-License-Identifier: Apache-2.0

import os

import bpy
from bpy_extras.io_utils import ImportHelper

from . import rasterize, svg_image

MISSING_RESVG = (
    "The SVG renderer (resvg) is not available. Reinstall the extension "
    "from the .zip; it carries the renderer for every platform"
)


def _assign_to_material(obj, image, use_alpha):
    """Add an Image Texture node for `image` to obj's active material,
    wired to the Principled BSDF's Base Color (and Alpha)."""
    material = obj.active_material
    if material is None:
        material = bpy.data.materials.new(image.name)
        material.use_nodes = True
        if obj.data.materials:
            obj.material_slots[obj.active_material_index].material = material
        else:
            obj.data.materials.append(material)
    material.use_nodes = True
    tree = material.node_tree
    bsdf = next((n for n in tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    node = tree.nodes.new("ShaderNodeTexImage")
    node.image = image
    if bsdf is not None:
        node.location = (bsdf.location.x - 360, bsdf.location.y)
        tree.links.new(node.outputs["Color"], bsdf.inputs["Base Color"])
        if use_alpha:
            tree.links.new(node.outputs["Alpha"], bsdf.inputs["Alpha"])
    for other in tree.nodes:
        other.select = False
    node.select = True
    tree.nodes.active = node
    return material


class TOSI_SVG_OT_import(bpy.types.Operator, ImportHelper):
    """Import an SVG file as an image texture that exports to glTF as vectors"""

    bl_idname = "tosi_svg.import_svg"
    bl_label = "Import SVG Texture"
    bl_options = {"REGISTER", "UNDO"}

    filename_ext = ".svg"
    filter_glob: bpy.props.StringProperty(default="*.svg", options={"HIDDEN"})

    resolution: bpy.props.IntProperty(
        name="Resolution",
        description="Longest side of the texture, in pixels",
        default=1024,
        min=16,
        max=16384,
        soft_max=8192,
    )
    assign: bpy.props.BoolProperty(
        name="Add to Active Material",
        description=(
            "Add an Image Texture node for it to the active object's material "
            "(creating one if needed), connected to Base Color"
        ),
        default=True,
    )
    use_alpha: bpy.props.BoolProperty(
        name="Connect Alpha",
        description="Also connect the texture's alpha to the material's Alpha",
        default=True,
    )

    def execute(self, context):
        if not rasterize.available():
            self.report({"ERROR"}, MISSING_RESVG)
            return {"CANCELLED"}
        try:
            svg = svg_image.read_svg_file(self.filepath)
            name = os.path.splitext(os.path.basename(self.filepath))[0]
            image = svg_image.create_svg_image(
                name, svg, self.resolution, filepath=self.filepath
            )
        except Exception as e:  # resvg reports malformed SVG as an exception
            self.report({"ERROR"}, "Could not import SVG: " + str(e))
            return {"CANCELLED"}

        obj = context.active_object
        if self.assign and obj is not None and obj.type == "MESH":
            material = _assign_to_material(obj, image, self.use_alpha)
            self.report({"INFO"}, f"{image.name} added to {material.name}")
        else:
            self.report({"INFO"}, f"Imported {image.name}")
        for area in context.screen.areas if context.screen else ():
            if area.type == "IMAGE_EDITOR":
                area.spaces.active.image = image
        return {"FINISHED"}


def _context_image(context):
    """The image the user is looking at: the Image Editor's, or the active
    Image Texture node's."""
    space = context.space_data
    if space is not None and space.type == "IMAGE_EDITOR":
        return space.image
    if space is not None and space.type == "NODE_EDITOR":
        node = context.active_node
        if node is not None and node.type == "TEX_IMAGE":
            return node.image
    return None


class TOSI_SVG_OT_reload(bpy.types.Operator):
    """Re-read the SVG from its file and redraw the texture"""

    bl_idname = "tosi_svg.reload"
    bl_label = "Reload SVG"
    bl_options = {"REGISTER", "UNDO"}

    @classmethod
    def poll(cls, context):
        image = _context_image(context)
        return svg_image.is_svg_image(image) and bool(image.tosi_svg.filepath)

    def execute(self, context):
        image = _context_image(context)
        path = bpy.path.abspath(image.tosi_svg.filepath)
        try:
            image.tosi_svg.source = svg_image.read_svg_file(path)
            svg_image.render_proxy(image)
        except Exception as e:
            self.report({"ERROR"}, "Could not reload SVG: " + str(e))
            return {"CANCELLED"}
        return {"FINISHED"}


class TOSI_SVG_OT_forget(bpy.types.Operator):
    """Make this an ordinary bitmap: drop the SVG source and keep the pixels"""

    bl_idname = "tosi_svg.forget"
    bl_label = "Convert to Bitmap"
    bl_options = {"REGISTER", "UNDO"}

    @classmethod
    def poll(cls, context):
        return svg_image.is_svg_image(_context_image(context))

    def execute(self, context):
        image = _context_image(context)
        image.tosi_svg.source = ""
        image.tosi_svg.filepath = ""
        return {"FINISHED"}


classes = (TOSI_SVG_OT_import, TOSI_SVG_OT_reload, TOSI_SVG_OT_forget)
