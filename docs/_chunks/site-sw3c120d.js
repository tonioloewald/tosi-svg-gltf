import{z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var t="MSFT_sRGBFactors";class sE{constructor(e){this.name=t,this._loader=e,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,o,s){return z.LoadExtraAsync(e,o,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(s),c=this._loader.loadMaterialPropertiesAsync(e,o,s),a=s.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function Sb(){if(i)return;i=!0,W(t),Y(t,!0,(e)=>new sE(e))}
export{sE,Sb};

//# debugId=4918993F4DF2253664756E2164756E21
//# sourceMappingURL=site-sw3c120d.js.map
