// Site configuration for the tosi-svg-gltf doc site.
// Consumed by bin/site.ts (build + dev). See tosijs-ui/site for the option set.

import { defineSiteConfig } from 'tosijs-ui/site'

const PROJECT = 'tosi-svg-gltf'

export default defineSiteConfig({
  name: PROJECT,
  description:
    'SVG textures inside glTF/GLB, rasterized by the viewer at the resolution it needs. A Blender extension writes them; a Babylon.js loader extension reads them.',

  projectLinks: {
    tosijs: 'https://tosijs.net',
    github: `https://github.com/tonioloewald/${PROJECT}`,
  },
  navbarLinks: [
    { href: '/blender/', label: 'Blender add-on', icon: 'download' },
    { href: 'https://3d.tosijs.net', label: 'tosijs-3d', icon: 'tosiXr' },
    {
      href: `https://github.com/tonioloewald/${PROJECT}`,
      label: 'github',
      icon: 'github',
    },
  ],

  theme: {
    accent: '#2f9e8f',
    background: '#fafafa',
    text: '#222222',
  },

  // README is the home page; blender.md is the page artists land on, so it is
  // written for them rather than for developers. format.md is the contract
  // both halves implement, published so other exporters and viewers can too.
  docPaths: ['src', 'README.md', 'blender.md', 'format.md', 'CHANGELOG.md'],

  host: 'github-pages',
  domain: 'svg-gltf.tosijs.net',

  bundleEntry: './demo/site.ts',
  // static/ holds the sample SVG and GLB and the built Blender extension zip
  // (bun blender build). It is copied into docs/ at build time.
  staticDirs: ['static'],
  watchPaths: ['static'],
  port: Number(process.env.PORT || 8034),

  // Live examples import these by name; the build-time checker needs the same
  // context demo/site.ts seeds at runtime.
  checkExamples: {
    contextKeys: [
      'tosijs',
      'tosijs-ui',
      'tosijs-3d',
      'tosijs-3d/demo-utils',
      PROJECT,
      `${PROJECT}/babylon`,
    ],
  },

  emitLibrary: true,
  libraryTsconfig: 'tsconfig.build.json',
})
