// What the docs promise, checked against what is actually in the repo: the
// version the download link names, the zip it points at, and the sample GLB
// the live example loads.

import { describe, expect, test } from 'bun:test'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-expect-error no types
import validator from 'gltf-validator'
import { readSvgPayload } from '../src/index'

const ROOT = join(import.meta.dir, '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const pkg = JSON.parse(read('package.json'))
const manifestVersion = /^version\s*=\s*"([^"]+)"/m.exec(
  read('blender/tosi_svg/blender_manifest.toml')
)![1]
const zipName = `tosi_svg-${pkg.version}.zip`

describe('versions and the download', () => {
  test('npm package and Blender extension share a version', () => {
    expect(manifestVersion).toBe(pkg.version)
  })

  test('blender.md links the current zip, and only it', () => {
    const doc = read('blender.md')
    expect(doc).toContain(`/downloads/${zipName}`)
    expect(doc).toContain(`Version ${pkg.version}`)
    const named = [...doc.matchAll(/tosi_svg-([\d.]+[^\s"'<)]*)\.zip/g)].map(
      (m) => m[1]
    )
    expect(new Set(named)).toEqual(new Set([pkg.version]))
  })

  test('the zip exists and latest.json describes it', () => {
    const zip = join(ROOT, 'static/downloads', zipName)
    expect(existsSync(zip)).toBe(true)
    const latest = JSON.parse(read('static/downloads/latest.json'))
    const bytes = readFileSync(zip)
    expect(latest.file).toBe(zipName)
    expect(latest.sha256).toBe(createHash('sha256').update(bytes).digest('hex'))
    const mb = (bytes.length / 1e6).toFixed(1)
    expect(read('blender.md')).toContain(`${mb} MB`)
  })
})

function parseGlb(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  expect(view.getUint32(0, true)).toBe(0x46546c67) // 'glTF'
  const jsonLength = view.getUint32(12, true)
  return JSON.parse(
    new TextDecoder().decode(bytes.subarray(20, 20 + jsonLength))
  )
}

describe('the sample GLB (written by the Blender test)', () => {
  const path = join(ROOT, 'static/samples/svg-plane.glb')
  const bytes = new Uint8Array(readFileSync(path))

  test('its image carries the sample SVG', () => {
    const gltf = parseGlb(bytes)
    const payload = readSvgPayload(gltf.images[0])
    expect(payload).not.toBe(null)
    expect(payload!.svg).toBe(read('static/samples/tosi-svg-sample.svg'))
    expect([payload!.width, payload!.height]).toEqual([1024, 1024])
  })

  test('is valid glTF 2.0 (Khronos validator: no errors)', async () => {
    const report = await validator.validateBytes(bytes)
    const errors = report.issues.messages.filter((m: any) => m.severity === 0)
    expect(errors).toEqual([])
  })
})
