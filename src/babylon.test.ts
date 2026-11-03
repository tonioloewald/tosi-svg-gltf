import { afterEach, describe, expect, test } from 'bun:test'
import { registeredGLTFExtensions } from '@babylonjs/loaders/glTF/2.0/glTFLoaderExtensionRegistry.js'
import {
  EXTENSION_NAME,
  SvgTextureLoaderExtension,
  registerSvgExtension,
  unregisterSvgExtension,
} from './babylon'

const fakeLoader = (images: any[], maxTextureSize = 16384) =>
  ({
    gltf: { asset: { version: '2.0' }, images },
    babylonScene: {
      getEngine: () => ({ getCaps: () => ({ maxTextureSize }) }),
    },
  } as any)

const svgImage = (width = 512, height = 256) => ({
  mimeType: 'image/png',
  bufferView: 3,
  extras: {
    tosi_svg: {
      version: 1,
      svg: '<svg viewBox="0 0 2 1"><rect width="2" height="1"/></svg>',
      width,
      height,
    },
  },
})

const decoded = async (image: any) =>
  new TextDecoder().decode(await image._data)

describe('SvgTextureLoaderExtension.onLoading', () => {
  test('swaps a payload image to sized SVG bytes before any texture loads', async () => {
    const image = svgImage()
    new SvgTextureLoaderExtension(fakeLoader([image])).onLoading()
    expect(image.mimeType).toBe('image/svg+xml')
    expect(await decoded(image)).toBe(
      '<svg viewBox="0 0 2 1" width="512" height="256"><rect width="2" height="1"/></svg>'
    )
  })

  test('leaves ordinary images alone', () => {
    const plain: any = { mimeType: 'image/png', bufferView: 1 }
    new SvgTextureLoaderExtension(fakeLoader([plain])).onLoading()
    expect(plain).toEqual({ mimeType: 'image/png', bufferView: 1 })
  })

  test('scale, maxResolution and the GPU limit all apply', async () => {
    const a = svgImage()
    new SvgTextureLoaderExtension(fakeLoader([a]), { scale: 4 }).onLoading()
    expect(await decoded(a)).toContain('width="2048" height="1024"')

    const b = svgImage()
    new SvgTextureLoaderExtension(fakeLoader([b]), {
      scale: 4,
      maxResolution: () => 1024,
    }).onLoading()
    expect(await decoded(b)).toContain('width="1024" height="512"')

    const c = svgImage()
    new SvgTextureLoaderExtension(fakeLoader([c], 256), {
      scale: 4,
    }).onLoading()
    expect(await decoded(c)).toContain('width="256" height="128"')
  })

  test('resolve chooses per image', async () => {
    const image = svgImage()
    new SvgTextureLoaderExtension(fakeLoader([image]), {
      resolve: () => ({ width: 7, height: 9 }),
    }).onLoading()
    expect(await decoded(image)).toContain('width="7" height="9"')
  })

  test('a file with no images is fine', () => {
    new SvgTextureLoaderExtension(fakeLoader(undefined as any)).onLoading()
  })
})

describe('registration', () => {
  afterEach(() => unregisterSvgExtension())

  test('registers as a non-glTF extension (active without extensionsUsed)', () => {
    registerSvgExtension()
    const entry = registeredGLTFExtensions.get(EXTENSION_NAME)
    expect(entry?.isGLTFExtension).toBe(false)
  })

  test('registering again replaces, unregister removes', () => {
    registerSvgExtension({ scale: 1 })
    registerSvgExtension({ scale: 2 })
    expect(unregisterSvgExtension()).toBe(true)
    expect(unregisterSvgExtension()).toBe(false)
  })
})
