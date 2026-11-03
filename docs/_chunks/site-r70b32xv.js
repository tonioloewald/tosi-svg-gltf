import{oe,z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var s="EXT_texture_avif";class tR{constructor(e){this.name=s,this._loader=e,this.enabled=e.isExtensionUsed(s)}dispose(){this._loader=null}_loadTextureAsync(e,r,n){return z.LoadExtensionAsync(e,r,this.name,async(a,i)=>{let o=r.sampler==null?z.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${a}/source`,this._loader.gltf.images,i.source);return await this._loader._createTextureAsync(e,o,l,(d)=>{n(d)},void 0,!r._textureInfo.nonColorData,r)})}}var t=!1;function NS(){if(t)return;t=!0,W(s),Y(s,!0,(e)=>new tR(e))}
export{tR,NS};

//# debugId=7B14F0B885E94A3964756E2164756E21
//# sourceMappingURL=site-r70b32xv.js.map
