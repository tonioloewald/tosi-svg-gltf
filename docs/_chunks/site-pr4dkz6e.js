import{Ye}from"./site-hpkmk3qy.js";import{R,B}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class ym extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.motionType=this.registerDataInput("motionType",B,2)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setMotionType(this.motionType.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetPhysicsMotionTypeBlock"}}var i=!1;function Tm(){if(i)return;i=!0,o("FlowGraphSetPhysicsMotionTypeBlock",ym)}
export{ym,Tm};

//# debugId=B47B469682D1C08764756E2164756E21
//# sourceMappingURL=site-pr4dkz6e.js.map
