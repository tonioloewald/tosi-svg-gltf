import{Y,W}from"./site-weckhv4a.js";var e="KHR_xmp_json_ld";class pE{constructor(t){this.name=e,this.order=100,this._loader=t,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}onLoading(){if(this._loader.rootBabylonMesh===null)return;let t=this._loader.gltf.extensions?.KHR_xmp_json_ld,s=this._loader.gltf.asset?.extensions?.KHR_xmp_json_ld;if(t&&s){let o=+s.packet;if(t.packets&&o<t.packets.length)this._loader.rootBabylonMesh.metadata=this._loader.rootBabylonMesh.metadata||{},this._loader.rootBabylonMesh.metadata.xmp=t.packets[o]}}}var n=!1;function Mb(){if(n)return;n=!0,W(e),Y(e,!0,(t)=>new pE(t))}
export{pE,Mb};

//# debugId=8CC5439067A5F48664756E2164756E21
//# sourceMappingURL=site-6wcwc3kx.js.map
