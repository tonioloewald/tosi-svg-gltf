import{z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var t="MSFT_minecraftMesh";class gE{constructor(r){this.name=t,this._loader=r,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(r,s,e){return z.LoadExtraAsync(r,s,this.name,async(n,o)=>{if(o){if(!this._loader._pbrMaterialImpls.get("pbr"))throw Error(`${n}: Material type not supported`);let p=this._loader.loadMaterialPropertiesAsync(r,s,e);if(e.needAlphaBlending())e.forceDepthWrite=!0,e.separateCullingPass=!0;return e.backFaceCulling=e.forceDepthWrite,e.twoSidedLighting=!0,await p}})}}var i=!1;function Fb(){if(i)return;i=!0,W(t),Y(t,!0,(r)=>new gE(r))}
export{gE,Fb};

//# debugId=26D06C29B5FD501764756E2164756E21
//# sourceMappingURL=site-b53jbr0j.js.map
