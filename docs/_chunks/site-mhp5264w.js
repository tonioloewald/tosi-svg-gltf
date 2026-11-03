import{oe,z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var r="KHR_texture_basisu";class fE{constructor(e){this.name=r,this._loader=e,this.enabled=e.isExtensionUsed(r)}dispose(){this._loader=null}_loadTextureAsync(e,s,n){return z.LoadExtensionAsync(e,s,this.name,async(a,o)=>{let i=s.sampler==null?z.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,s.sampler),l=oe.Get(`${a}/source`,this._loader.gltf.images,o.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{n(u)},s._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!s._textureInfo.nonColorData,s)})}}var t=!1;function Pb(){if(t)return;t=!0,W(r),Y(r,!0,(e)=>new fE(e))}
export{fE,Pb};

//# debugId=F8135AB4EDCE418D64756E2164756E21
//# sourceMappingURL=site-mhp5264w.js.map
