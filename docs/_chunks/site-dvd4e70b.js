import{Iu,be,ri}from"./site-hpkmk3qy.js";import{R}from"./site-0dyxb27k.js";import{_e}from"./site-8xv1k759.js";import{o}from"./site-t1bgw9ek.js";class H_ extends be{constructor(e){super(e);this.config=e,this.type=this.registerDataInput("type",R,e.type),this.value=this.registerDataOutput("value",R),this.index=this.registerDataInput("index",R,new _e(ri(e.index??-1)))}_updateOutputs(e){let s=this.type.getValue(e),r=this.index.getValue(e),i=Iu(e.assetsContext,s,ri(r),this.config.useIndexAsUniqueId);this.value.setValue(i,e)}getClassName(){return"FlowGraphGetAssetBlock"}}var t=!1;function X_(){if(t)return;t=!0,o("FlowGraphGetAssetBlock",H_)}
export{H_,X_};

//# debugId=93AB268D68EDEA1D64756E2164756E21
//# sourceMappingURL=site-dvd4e70b.js.map
