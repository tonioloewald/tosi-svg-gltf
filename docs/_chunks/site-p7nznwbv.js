import{oe,z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var s="EXT_texture_webp";class iR{constructor(e){this.name=s,this._loader=e,this.enabled=e.isExtensionUsed(s)}dispose(){this._loader=null}_loadTextureAsync(e,r,n){return z.LoadExtensionAsync(e,r,this.name,async(a,o)=>{let i=r.sampler==null?z.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${a}/source`,this._loader.gltf.images,o.source);return await this._loader._createTextureAsync(e,i,l,(d)=>{n(d)},void 0,!r._textureInfo.nonColorData,r)})}}var t=!1;function FS(){if(t)return;t=!0,W(s),Y(s,!0,(e)=>new iR(e))}
export{iR,FS};

//# debugId=B40EE3B3B58044AE64756E2164756E21
//# sourceMappingURL=site-p7nznwbv.js.map
