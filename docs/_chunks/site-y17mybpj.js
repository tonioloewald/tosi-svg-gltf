import{z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";import{m}from"./site-5w546tza.js";var e="KHR_texture_transform";class dE{constructor(s){this.name=e,this._loader=s,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(s,o,i){return z.LoadExtensionAsync(s,o,this.name,async(a,t)=>await this._loader.loadTextureInfoAsync(s,o,(r)=>{if(!(r instanceof m))throw Error(`${a}: Texture type not supported`);if(t.offset)r.uOffset=t.offset[0],r.vOffset=t.offset[1];if(r.uRotationCenter=0,r.vRotationCenter=0,t.rotation)r.wAng=-t.rotation;if(t.scale)r.uScale=t.scale[0],r.vScale=t.scale[1];if(t.texCoord!=null)r.coordinatesIndex=t.texCoord;i(r)}))}}var f=!1;function wb(){if(f)return;f=!0,W(e),Y(e,!0,(s)=>new dE(s))}
export{dE,wb};

//# debugId=8F2129959EC4C9F764756E2164756E21
//# sourceMappingURL=site-y17mybpj.js.map
