import{be}from"./site-hpkmk3qy.js";import{R}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class q_ extends be{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let a=this.config.variable;if(e.hasVariable(a))this.value.setValue(e.getVariable(a),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var r=!1;function Z_(){if(r)return;r=!0,o("FlowGraphGetVariableBlock",q_)}
export{q_,Z_};

//# debugId=10274DE2A5BB7C0464756E2164756E21
//# sourceMappingURL=site-nxgf4sn0.js.map
