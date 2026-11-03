import{R,je}from"./site-0dyxb27k.js";import{Ui}from"./site-jsgb5c31.js";import{o,e}from"./site-t1bgw9ek.js";class Rm extends Ui{constructor(t){super(je,t);this.body=this.registerDataInput("body",R)}_doOperation(t){let i=this.body.getValue(t);if(!i)return;let r=t._getExecutionVariable(this,"_cachedVelocity",null);if(!r)r=new e,t._setExecutionVariable(this,"_cachedVelocity",r);return i.getAngularVelocityToRef(r),r}getClassName(){return"FlowGraphGetAngularVelocityBlock"}}var l=!1;function Am(){if(l)return;l=!0,o("FlowGraphGetAngularVelocityBlock",Rm)}
export{Rm,Am};

//# debugId=530BC3F1701B0BD564756E2164756E21
//# sourceMappingURL=site-stcez4kt.js.map
