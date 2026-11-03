import{Ye}from"./site-hpkmk3qy.js";import{R,je}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Hm extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.force=this.registerDataInput("force",je),this.location=this.registerDataInput("location",je)}_execute(t,a){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}let i=this.force.getValue(t),s=this.location.getValue(t);e.applyForce(i,s),this.out._activateSignal(t)}getClassName(){return"FlowGraphApplyForceBlock"}}var r=!1;function Xm(){if(r)return;r=!0,o("FlowGraphApplyForceBlock",Hm)}
export{Hm,Xm};

//# debugId=D02D0CD95C77F52B64756E2164756E21
//# sourceMappingURL=site-2mxqabpk.js.map
