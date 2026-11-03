// The engine-agnostic core: no dependencies, no 3D engine.
// The Babylon.js adapter is the `tosi-svg-gltf/babylon` subpath, so
// importing this never pulls Babylon into a bundle.

export {
  EXTRAS_KEY,
  PAYLOAD_VERSION,
  readSvgPayload,
  textureSize,
} from './payload.js'
export type { SvgPayload, TextureSizeOptions } from './payload.js'
export { sizeSvg, lengthToPx } from './size-svg.js'
export { decodeSvg, svgToCanvas } from './hydrate.js'
