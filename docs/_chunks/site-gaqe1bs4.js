import{R,je}from"./site-0dyxb27k.js";import{Ui}from"./site-jsgb5c31.js";import{o,e}from"./site-t1bgw9ek.js";class Cm extends Ui{constructor(t){super(je,t);this.body=this.registerDataInput("body",R)}_doOperation(t){let i=this.body.getValue(t);if(!i)return;let r=t._getExecutionVariable(this,"_cachedVelocity",null);if(!r)r=new e,t._setExecutionVariable(this,"_cachedVelocity",r);return i.getLinearVelocityToRef(r),r}getClassName(){return"FlowGraphGetLinearVelocityBlock"}}var l=!1;function Em(){if(l)return;l=!0,o("FlowGraphGetLinearVelocityBlock",Cm)}
export{Cm,Em};

//# debugId=F1ECD54BCF6571B464756E2164756E21
//# sourceMappingURL=site-gaqe1bs4.js.map
