import{be}from"./site-hpkmk3qy.js";import{R,je}from"./site-0dyxb27k.js";import{o,e,a}from"./site-t1bgw9ek.js";class U_ extends be{constructor(t){super(t);this.sourceSystem=this.registerDataInput("sourceSystem",R),this.destinationSystem=this.registerDataInput("destinationSystem",R),this.inputCoordinates=this.registerDataInput("inputCoordinates",je),this.outputCoordinates=this.registerDataOutput("outputCoordinates",je)}_updateOutputs(t){let n=this.sourceSystem.getValue(t),u=this.destinationSystem.getValue(t),p=this.inputCoordinates.getValue(t),l=n.getWorldMatrix(),m=u.getWorldMatrix(),s=a.Matrix[0].copyFrom(m);s.invert();let r=a.Matrix[1];s.multiplyToRef(l,r);let d=this.outputCoordinates.getValue(t);e.TransformCoordinatesToRef(p,r,d)}getClassName(){return"FlowGraphTransformCoordinatesSystemBlock"}}var i=!1;function W_(){if(i)return;i=!0,o("FlowGraphTransformCoordinatesSystemBlock",U_)}
export{U_,W_};

//# debugId=714688A715F7AA9864756E2164756E21
//# sourceMappingURL=site-g6wbsgzw.js.map
