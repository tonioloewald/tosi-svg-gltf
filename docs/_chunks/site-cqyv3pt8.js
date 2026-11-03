import{be,ri}from"./site-hpkmk3qy.js";import{R}from"./site-0dyxb27k.js";import{_e}from"./site-8xv1k759.js";import{o}from"./site-t1bgw9ek.js";class o_ extends be{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new _e(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let i=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let a=e.decodeIndexReference(r,this.config.referenceCollection);if(a===void 0){this.value.setValue(null,e);return}t=a}else t=ri(r);if(i&&t>=0&&t<i.length)this.value.setValue(i[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function a_(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",o_)}
export{o_,a_};

//# debugId=DC184CC21D0A3BEA64756E2164756E21
//# sourceMappingURL=site-cqyv3pt8.js.map
