import{on}from"./site-9c84561h.js";import{At}from"./site-5fxhqekr.js";import{mp}from"../hydrate-9g3hpszc.js";import{hr}from"./site-7rm2e32d.js";import{i}from"./site-1yf4ncc8.js";var o="volumetricLightingRenderVolumeVertexShader",r=`#include<__decl__sceneVertex>
#include<__decl__meshVertex>
attribute vec3 position;varying vec4 vWorldPos;void main(void) {vec4 worldPos=world*vec4(position,1.0);vWorldPos=worldPos;gl_Position=viewProjection*worldPos;}
`;if(!i.ShadersStore[o])i.ShadersStore[o]=r;var t=[on,At,mp,hr];for(let e of t)if(!i.IncludesShadersStore[e.name])i.IncludesShadersStore[e.name]=e.shader;var l={name:o,shader:r};export{l as volumetricLightingRenderVolumeVertexShader};

//# debugId=3A36C1136BD5170164756E2164756E21
//# sourceMappingURL=volumetricLightingRenderVolume.vertex-1v8mmsja.js.map
