// The Blender extension: vendor its wheels, build the .zip, test it in a real
// Blender, and (re)generate the sample GLB the doc site loads.
//
//   bun blender                 # wheels + build + test (the full gate)
//   bun blender wheels          # download wheels, verify sha256 against the lock
//   bun blender build           # → static/downloads/tosi_svg-<version>.zip
//   bun blender test            # install the zip in an ISOLATED Blender profile, run tests
//   bun blender test --stub     # same, from source, with a pure-Python rasterizer
//                               #   (no wheels needed; resvg itself not exercised)
//
// BLENDER=/path/to/blender overrides the executable.
//
// Isolation: every Blender run gets BLENDER_USER_RESOURCES pointing at a fresh
// temp dir and --factory-startup, so the tests never see (or touch) your own
// add-ons, preferences or extension repositories.

import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dir, '..')
const SRC = join(ROOT, 'blender/tosi_svg')
const WHEELS = join(SRC, 'wheels')
const LOCK = join(ROOT, 'blender/wheels.lock.json')
const DOWNLOADS = join(ROOT, 'static/downloads')
const SAMPLE_SVG = join(ROOT, 'static/samples/tosi-svg-sample.svg')
const SAMPLE_GLB = join(ROOT, 'static/samples/svg-plane.glb')
const TEST = join(ROOT, 'blender/tests/export_test.py')

const BLENDER =
  process.env.BLENDER ||
  [
    '/Applications/Blender.app/Contents/MacOS/Blender',
    '/usr/bin/blender',
    'C:\\Program Files\\Blender Foundation\\Blender\\blender.exe',
  ].find(existsSync) ||
  'blender'

const manifest = readFileSync(join(SRC, 'blender_manifest.toml'), 'utf8')
const VERSION = /^version\s*=\s*"([^"]+)"/m.exec(manifest)![1]!
const ZIP = join(DOWNLOADS, `tosi_svg-${VERSION}.zip`)

function run(cmd: string[], env: Record<string, string> = {}): string {
  const p = Bun.spawnSync(cmd, {
    env: { ...process.env, ...env },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const out = p.stdout.toString() + p.stderr.toString()
  if (p.exitCode !== 0) {
    console.error(out)
    throw new Error(`${cmd.slice(0, 3).join(' ')} … exited ${p.exitCode}`)
  }
  return out
}

const sha256 = (bytes: Uint8Array) =>
  createHash('sha256').update(bytes).digest('hex')

async function wheels() {
  const lock = JSON.parse(readFileSync(LOCK, 'utf8')) as {
    wheels: Record<string, { url: string; sha256: string }>
  }
  const listed = [...manifest.matchAll(/\.\/wheels\/([^"]+\.whl)/g)].map(
    (m) => m[1]!
  )
  const locked = Object.keys(lock.wheels)
  if (listed.sort().join() !== locked.sort().join()) {
    throw new Error(
      'blender_manifest.toml wheels and blender/wheels.lock.json disagree'
    )
  }
  mkdirSync(WHEELS, { recursive: true })
  for (const file of readdirSync(WHEELS)) {
    if (!lock.wheels[file]) rmSync(join(WHEELS, file))
  }
  for (const [file, { url, sha256: want }] of Object.entries(lock.wheels)) {
    const path = join(WHEELS, file)
    if (existsSync(path) && sha256(readFileSync(path)) === want) continue
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
    const bytes = new Uint8Array(await res.arrayBuffer())
    const got = sha256(bytes)
    if (got !== want)
      throw new Error(`${file}: sha256 ${got}, lock says ${want}`)
    writeFileSync(path, bytes)
    console.log(`  fetched ${file}`)
  }
  console.log(`wheels: ${locked.length} verified`)
}

function build() {
  mkdirSync(DOWNLOADS, { recursive: true })
  for (const f of readdirSync(DOWNLOADS)) {
    if (/^tosi_svg-.*\.zip$/.test(f)) rmSync(join(DOWNLOADS, f))
  }
  run([BLENDER, '--factory-startup', '--command', 'extension', 'validate', SRC])
  run([
    BLENDER,
    '--factory-startup',
    '--command',
    'extension',
    'build',
    '--source-dir',
    SRC,
    '--output-filepath',
    ZIP,
  ])
  const bytes = readFileSync(ZIP)
  writeFileSync(
    join(DOWNLOADS, 'latest.json'),
    JSON.stringify(
      {
        id: 'tosi_svg',
        version: VERSION,
        file: `tosi_svg-${VERSION}.zip`,
        bytes: bytes.length,
        sha256: sha256(bytes),
      },
      null,
      2
    ) + '\n'
  )
  console.log(`built ${ZIP} (${(bytes.length / 1e6).toFixed(1)} MB)`)
}

function test(stub: boolean) {
  const profile = mkdtempSync(join(tmpdir(), 'tosi-svg-blender-'))
  const env = { BLENDER_USER_RESOURCES: profile }
  try {
    if (stub) {
      // A user repository is just a directory of unpacked extensions.
      const dest = join(profile, 'extensions/user_default/tosi_svg')
      cpSync(SRC, dest, {
        recursive: true,
        filter: (p) => !p.includes('/wheels') && !p.includes('__pycache__'),
      })
    } else {
      if (!existsSync(ZIP)) throw new Error(`${ZIP} missing: run build first`)
      run(
        [
          BLENDER,
          '--command',
          'extension',
          'install-file',
          '-r',
          'user_default',
          ZIP,
        ],
        env
      )
    }
    const out = run(
      [
        BLENDER,
        '-b',
        '--factory-startup',
        '--python-exit-code',
        '1',
        '--python',
        TEST,
        '--',
        SAMPLE_SVG,
        SAMPLE_GLB,
        ...(stub ? ['--stub'] : []),
      ],
      env
    )
    const lines = out.split('\n')
    const from = lines.findIndex(
      (l) => l.startsWith('tosi_svg test') || l === 'import operator'
    )
    console.log(lines.slice(Math.max(0, from)).join('\n').trim())
    if (stub) {
      console.warn(
        `\n⚠️  ${SAMPLE_GLB} now has a STUB fallback thumbnail. Run \`bun blender\` before committing it.`
      )
    }
  } finally {
    rmSync(profile, { recursive: true, force: true })
  }
}

const [verb = 'all', ...flags] = process.argv.slice(2)
const stub = flags.includes('--stub')
try {
  if (verb === 'wheels' || verb === 'all') await wheels()
  if (verb === 'build' || verb === 'all') build()
  if (verb === 'test' || verb === 'all') test(stub)
} catch (e) {
  console.error(`\n✗ ${(e as Error).message}`)
  process.exit(1)
}
