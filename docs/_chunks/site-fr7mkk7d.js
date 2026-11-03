import{be}from"./site-hpkmk3qy.js";import{R,He}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class mg extends be{constructor(t){super(t);this.condition=this.registerDataInput("condition",He),this.onTrue=this.registerDataInput("onTrue",R),this.onFalse=this.registerDataInput("onFalse",R),this.output=this.registerDataOutput("output",R)}_updateOutputs(t){let i=this.condition.getValue(t);this.output.setValue(i?this.onTrue.getValue(t):this.onFalse.getValue(t),t)}getClassName(){return"FlowGraphConditionalBlock"}}var e=!1;function _g(){if(e)return;e=!0,o("FlowGraphConditionalBlock",mg)}
export{mg,_g};

//# debugId=903A568505EE053C64756E2164756E21
//# sourceMappingURL=site-fr7mkk7d.js.map
