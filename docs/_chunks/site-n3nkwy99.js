import{z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var i="KHR_materials_emissive_strength";class wE{constructor(e){this.name=i,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(i)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return z.LoadExtensionAsync(e,s,this.name,async(r,o)=>(await this._loader.loadMaterialPropertiesAsync(e,s,t),this._loadEmissiveProperties(r,o,t),await Promise.resolve()))}_loadEmissiveProperties(e,s,t){if(s.emissiveStrength!==void 0){let r=this._loader._getOrCreateMaterialAdapter(t);r.emissionLuminance=s.emissiveStrength}}}var n=!1;function qb(){if(n)return;n=!0,W(i),Y(i,!0,(e)=>new wE(e))}
export{wE,qb};

//# debugId=6E63D10345B839D564756E2164756E21
//# sourceMappingURL=site-n3nkwy99.js.map
