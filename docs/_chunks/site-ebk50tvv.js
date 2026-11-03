import{is,si}from"./site-hpkmk3qy.js";import{R,B}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class F_ extends si{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",B),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&(t.out===r||is(t.out,r));if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||is(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_getReferencedMesh(e){return this.targetMesh.getValue(e)}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function B_(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",F_)}
export{F_,B_};

//# debugId=FFD722FB9B16EF0C64756E2164756E21
//# sourceMappingURL=site-ebk50tvv.js.map
