# size-svg

`sizeSvg(svg, width, height)` returns the SVG with its root element's
`width` and `height` set to that many pixels, so a browser decodes it at the
size you are about to draw it. That matters because a browser hands an SVG
`<img>` to WebGL at its **intrinsic** size: an icon authored as
`width="24" height="24"` becomes a 24 px texture however large it is drawn.

The edit is textual and works without a DOM, in a worker too:

- if the root has no `viewBox`, one is added from its original `width` and
  `height` (px, pt, pc, mm, cm, in or unitless), so the drawing **scales**
  to the new size instead of being cropped to it;
- `width` and `height` are replaced, or added;
- nothing else in the document changes.

```test
import { sizeSvg } from 'tosi-svg-gltf'

test('an icon is scaled, not cropped', () => {
  const out = sizeSvg('<svg width="24" height="24"><rect/></svg>', 512, 512)
  expect(out.includes('viewBox="0 0 24 24"')).toBe(true)
  expect(out.includes('width="512"')).toBe(true)
})
```
