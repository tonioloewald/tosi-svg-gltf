// Hydration bundle entry, loaded by every generated page.
//
// `bundleEntry` REPLACES tosijs-ui's own bundle, so this must register the doc
// system and live examples itself; the package root barrel does not (see
// tosijs-ui's site-config docs, and tosijs-ui#145 / #159 for how silently a
// page degrades to inert prose without them).

import 'tosijs-ui/doc-system/doc-system.js'
import 'tosijs-ui/live-example'

import * as tosijs from 'tosijs'
import * as tosijsui from 'tosijs-ui'
import * as tosijs3d from 'tosijs-3d'
import * as demoUtils from 'tosijs-3d/demo-utils'
import * as core from '../src/index'
import * as babylon from '../src/babylon'

// Live examples import by package name; seed the doc system's context so an
// inline `import { registerSvgExtension } from 'tosi-svg-gltf/babylon'` resolves.
for (const el of document.querySelectorAll('tosi-doc-system')) {
  ;(el as unknown as { context: Record<string, unknown> }).context = {
    tosijs,
    'tosijs-ui': tosijsui,
    'tosijs-3d': tosijs3d,
    'tosijs-3d/demo-utils': demoUtils,
    'tosi-svg-gltf': core,
    'tosi-svg-gltf/babylon': babylon,
  }
}
