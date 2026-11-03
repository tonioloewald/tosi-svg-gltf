import{be}from"./site-hpkmk3qy.js";import{R,B,je}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Im extends be{constructor(s){super(s);this.body=this.registerDataInput("body",R),this.mass=this.registerDataOutput("mass",B),this.centerOfMass=this.registerDataOutput("centerOfMass",je),this.inertia=this.registerDataOutput("inertia",je)}_updateOutputs(s){let t=this.body.getValue(s);if(!t)return;let e=t.getMassProperties();if(e.mass!==void 0)this.mass.setValue(e.mass,s);if(e.centerOfMass)this.centerOfMass.setValue(e.centerOfMass,s);if(e.inertia)this.inertia.setValue(e.inertia,s)}getClassName(){return"FlowGraphGetPhysicsMassPropertiesBlock"}}var r=!1;function Pm(){if(r)return;r=!0,o("FlowGraphGetPhysicsMassPropertiesBlock",Im)}
export{Im,Pm};

//# debugId=69FF393F32B9685D64756E2164756E21
//# sourceMappingURL=site-7yq50e7c.js.map
