import{z}from"./site-egfyy78s.js";import{Y,W}from"./site-weckhv4a.js";var o="KHR_materials_dispersion";class PE{constructor(e){this.name=o,this.order=174,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,i){return z.LoadExtensionAsync(e,r,this.name,async(t,s)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,i)),n.push(this._loadDispersionPropertiesAsync(t,r,i,s)),await Promise.all(n).then(()=>{})})}_loadDispersionPropertiesAsync(e,r,i,t){let s=this._loader._getOrCreateMaterialAdapter(i);if(s.transmissionWeight==0||!t.dispersion)return Promise.resolve();return s.transmissionDispersionAbbeNumber=20,s.transmissionDispersionScale=t.dispersion,Promise.resolve()}}var a=!1;function Qb(){if(a)return;a=!0,W(o),Y(o,!0,(e)=>new PE(e))}
export{PE,Qb};

//# debugId=DF057B4121B82B8664756E2164756E21
//# sourceMappingURL=site-x5h1c2c9.js.map
