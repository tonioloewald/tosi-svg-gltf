import{is,si}from"./site-hpkmk3qy.js";import{R,B}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class k_ extends si{constructor(e){super(e);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",B),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);if(this.meshOutOfPointer.setValue(t.mesh,e),this.pointerId.setValue(t.pointerId,e),!(t.over&&(t.over===r||is(t.over,r)))&&(t.mesh===r||is(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_getReferencedMesh(e){return this.targetMesh.getValue(e)}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function V_(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",k_)}
export{k_,V_};

//# debugId=0FF0921C01A34B4264756E2164756E21
//# sourceMappingURL=site-n6jsqpj8.js.map
