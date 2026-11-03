import{Ye}from"./site-hpkmk3qy.js";import{R,je}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class $m extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.impulse=this.registerDataInput("impulse",je),this.location=this.registerDataInput("location",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let s=this.impulse.getValue(t),l=this.location.getValue(t);e.applyImpulse(s,l),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyImpulseBlock"}}var i=!1;function Ym(){if(i)return;i=!0,o("FlowGraphApplyImpulseBlock",$m)}
export{$m,Ym};

//# debugId=D8DE2369B4B84D7F64756E2164756E21
//# sourceMappingURL=site-vym2vxwa.js.map
