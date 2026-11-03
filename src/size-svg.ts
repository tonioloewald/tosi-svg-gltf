/*#
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
*/
/*{ "order": 20 }*/

const UNIT_PX: Record<string, number> = {
  '': 1,
  px: 1,
  pt: 96 / 72,
  pc: 16,
  mm: 96 / 25.4,
  cm: 96 / 2.54,
  in: 96,
}

/** A length attribute in px, or `null` for %, em and other relative units. */
export function lengthToPx(value: string | undefined): number | null {
  if (value == null) return null
  const m = /^\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)\s*([a-z]*)\s*$/i.exec(
    value
  )
  if (!m) return null
  const scale = UNIT_PX[m[2]!.toLowerCase()]
  if (scale === undefined) return null
  const px = Number(m[1]) * scale
  return px > 0 ? px : null
}

// Comments, processing instructions and a DOCTYPE (with an internal subset)
// can all precede the root, and any of them may contain the text "<svg".
const PROLOG_OR_ROOT =
  /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE(?:[^>[]|\[[\s\S]*?\])*>|<svg\b((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/gi

const ATTRIBUTE = /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g

interface RootTag {
  start: number
  end: number
  /** Values are kept exactly as written (entities unexpanded) and re-emitted so. */
  attributes: Array<[name: string, value: string, quote: string]>
  selfClosing: boolean
}

function findRoot(svg: string): RootTag | null {
  PROLOG_OR_ROOT.lastIndex = 0
  for (let m = PROLOG_OR_ROOT.exec(svg); m; m = PROLOG_OR_ROOT.exec(svg)) {
    if (m[1] === undefined && !/^<svg/i.test(m[0])) continue
    const attributes: RootTag['attributes'] = []
    const source = m[1] ?? ''
    ATTRIBUTE.lastIndex = 0
    for (let a = ATTRIBUTE.exec(source); a; a = ATTRIBUTE.exec(source)) {
      if (a[3] !== undefined) attributes.push([a[1]!, a[3], "'"])
      else attributes.push([a[1]!, a[2] ?? a[4] ?? '', '"'])
    }
    return {
      start: m.index,
      end: m.index + m[0].length,
      attributes,
      selfClosing: m[2] === '/',
    }
  }
  return null
}

/**
 * The SVG with its root sized to `width` × `height` pixels, scaling (not
 * cropping) its content. Returns the input unchanged if no `<svg>` root is
 * found.
 */
export function sizeSvg(svg: string, width: number, height: number): string {
  const root = findRoot(svg)
  if (root == null) return svg
  const get = (name: string) => root.attributes.find(([n]) => n === name)?.[1]
  const kept = root.attributes.filter(([n]) => n !== 'width' && n !== 'height')
  if (get('viewBox') == null) {
    const w = lengthToPx(get('width'))
    const h = lengthToPx(get('height'))
    if (w != null && h != null) kept.push(['viewBox', `0 0 ${w} ${h}`, '"'])
  }
  kept.push(['width', String(width), '"'], ['height', String(height), '"'])
  const tag =
    '<svg' +
    kept.map(([n, v, q]) => ` ${n}=${q}${v}${q}`).join('') +
    (root.selfClosing ? '/>' : '>')
  return svg.slice(0, root.start) + tag + svg.slice(root.end)
}
