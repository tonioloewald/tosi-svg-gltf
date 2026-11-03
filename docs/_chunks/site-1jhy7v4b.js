import{z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var t="KHR_materials_ior";class Ep{constructor(e){this.name=t,this.order=180,this._loader=e,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,s){return z.LoadExtensionAsync(e,r,this.name,async(o,i)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,s)),n.push(this._loadIorPropertiesAsync(o,i,s)),await Promise.all(n).then(()=>{})})}_loadIorPropertiesAsync(e,r,s){let o=this._loader._getOrCreateMaterialAdapter(s),i=r.ior!==void 0?r.ior:Ep._DEFAULT_IOR;return o.specularIor=i,Promise.resolve()}}Ep._DEFAULT_IOR=1.5;var a=!1;function Zb(){if(a)return;a=!0,W(t),Y(t,!0,(e)=>new Ep(e))}
export{Ep,Zb};

//# debugId=5B5B3275311E0DD964756E2164756E21
//# sourceMappingURL=site-1jhy7v4b.js.map
