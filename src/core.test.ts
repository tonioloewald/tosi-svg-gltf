import { describe, expect, test } from 'bun:test'
import {
  lengthToPx,
  readSvgPayload,
  sizeSvg,
  textureSize,
  PAYLOAD_VERSION,
} from './index'

const payload = (p: Record<string, unknown>) => ({ extras: { tosi_svg: p } })
const good = {
  version: PAYLOAD_VERSION,
  svg: '<svg/>',
  width: 100,
  height: 50,
}

describe('readSvgPayload', () => {
  test('reads a valid payload', () => {
    expect(readSvgPayload(payload(good))).toEqual(good)
  })
  test('treats anything malformed as absent, never throws', () => {
    for (const bad of [
      null,
      undefined,
      42,
      {},
      { extras: null },
      { extras: { tosi_svg: 'nope' } },
      payload({ ...good, version: 2 }),
      payload({ ...good, svg: 'not svg' }),
      payload({ ...good, width: 0 }),
      payload({ ...good, height: Number.NaN }),
      payload({ ...good, width: '100' }),
    ]) {
      expect(readSvgPayload(bad)).toBe(null)
    }
  })
})

describe('textureSize', () => {
  test('defaults to the authored size', () => {
    expect(textureSize({ width: 1024, height: 512 })).toEqual({
      width: 1024,
      height: 512,
    })
  })
  test('scale multiplies, maxResolution caps the long side, aspect kept', () => {
    expect(textureSize({ width: 1024, height: 512 }, { scale: 2 })).toEqual({
      width: 2048,
      height: 1024,
    })
    expect(
      textureSize(
        { width: 512, height: 1024 },
        { scale: 8, maxResolution: 2048 }
      )
    ).toEqual({ width: 1024, height: 2048 })
  })
  test('never below one pixel; nonsense scale is ignored', () => {
    expect(textureSize({ width: 1000, height: 1 }, { scale: 0.01 })).toEqual({
      width: 10,
      height: 1,
    })
    expect(textureSize({ width: 8, height: 8 }, { scale: -1 })).toEqual({
      width: 8,
      height: 8,
    })
  })
})

describe('lengthToPx', () => {
  test('absolute units convert, relative ones do not', () => {
    expect(lengthToPx('24')).toBe(24)
    expect(lengthToPx('24px')).toBe(24)
    expect(lengthToPx('1in')).toBe(96)
    expect(lengthToPx('72pt')).toBe(96)
    expect(lengthToPx('25.4mm')).toBeCloseTo(96)
    expect(lengthToPx('100%')).toBe(null)
    expect(lengthToPx('2em')).toBe(null)
    expect(lengthToPx('0')).toBe(null)
    expect(lengthToPx(undefined)).toBe(null)
  })
})

describe('sizeSvg', () => {
  test('adds a viewBox from width/height so content scales', () => {
    expect(sizeSvg('<svg width="24" height="12"><g/></svg>', 96, 48)).toBe(
      '<svg viewBox="0 0 24 12" width="96" height="48"><g/></svg>'
    )
  })
  test('keeps an existing viewBox and every other attribute verbatim', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox=\'0 0 10 10\' width="10mm" data-x="a &amp; b"><g/></svg>'
    expect(sizeSvg(svg, 64, 64)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox=\'0 0 10 10\' data-x="a &amp; b" width="64" height="64"><g/></svg>'
    )
  })
  test('skips a prolog, comments and DOCTYPE that mention <svg', () => {
    const svg = `<?xml version="1.0"?>
<!-- an <svg width="1"> in a comment -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "x" [ <!ENTITY e "<svg>"> ]>
<svg width="2in" height="1in"><text>&e;</text></svg>`
    const out = sizeSvg(svg, 200, 100)
    expect(out.includes('<!-- an <svg width="1"> in a comment -->')).toBe(true)
    expect(
      out.includes('<svg viewBox="0 0 192 96" width="200" height="100">')
    ).toBe(true)
  })
  test('percent sizes: no viewBox can be inferred, size is still set', () => {
    expect(sizeSvg('<svg width="100%"/>', 8, 8)).toBe(
      '<svg width="8" height="8"/>'
    )
  })
  test('no root: unchanged', () => {
    expect(sizeSvg('<html/>', 8, 8)).toBe('<html/>')
  })
  test('only the root changes, not nested <svg> elements', () => {
    expect(sizeSvg('<svg viewBox="0 0 1 1"><svg width="5"/></svg>', 4, 4)).toBe(
      '<svg viewBox="0 0 1 1" width="4" height="4"><svg width="5"/></svg>'
    )
  })
})
