# SPDX-License-Identifier: Apache-2.0
"""SVG -> PNG bytes. The only module that touches resvg.

`backend` is replaceable so tests can run the whole add-on in a Blender that
has no resvg wheel installed (see blender/tests/).
"""

import struct
import zlib


def png_size(data):
    """(width, height) from a PNG's IHDR chunk."""
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    return struct.unpack(">II", data[16:24])


def encode_png(width, height, rgba):
    """A minimal RGBA PNG. `rgba` is bytes, width*height*4 long."""

    def chunk(kind, body):
        return (
            struct.pack(">I", len(body))
            + kind
            + body
            + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
        )

    stride = width * 4
    raw = b"".join(
        b"\x00" + rgba[y * stride : (y + 1) * stride] for y in range(height)
    )
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


# 1x1 fully transparent: the smallest valid glTF image.
TRANSPARENT_PIXEL = encode_png(1, 1, b"\x00\x00\x00\x00")


def _resvg_backend(svg, width=None, height=None):
    import resvg_py

    return bytes(resvg_py.svg_to_bytes(svg_string=svg, width=width, height=height))


backend = _resvg_backend


def available():
    """Whether the real rasterizer can be imported (a stub always can)."""
    if backend is not _resvg_backend:
        return True
    try:
        import resvg_py  # noqa: F401

        return True
    except ImportError:
        return False


def rasterize(svg, long_side):
    """Render `svg` with its longer side `long_side` px, aspect kept.

    Returns (png_bytes, width, height).
    """
    png = backend(svg, width=long_side)
    width, height = png_size(png)
    if height > width:
        png = backend(svg, height=long_side)
        width, height = png_size(png)
    return png, width, height
