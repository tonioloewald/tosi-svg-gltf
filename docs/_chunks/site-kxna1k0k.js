import{be}from"./site-hpkmk3qy.js";import{R,ni}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class km extends be{constructor(t){super(t);this.functionName=this.registerDataInput("functionName",ni),this.object=this.registerDataInput("object",R),this.context=this.registerDataInput("context",R,null),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.functionName.getValue(t),n=this.object.getValue(t),s=this.context.getValue(t);if(n&&i){let e=n[i];if(e&&typeof e==="function")this.output.setValue(e.bind(s),t)}}getClassName(){return"FlowGraphFunctionReference"}}var r=!1;function Vm(){if(r)return;r=!0,o("FlowGraphFunctionReference",km)}
export{km,Vm};

//# debugId=755AD3E919E5B81A64756E2164756E21
//# sourceMappingURL=site-kxna1k0k.js.map
