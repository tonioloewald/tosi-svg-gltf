import{Ye}from"./site-hpkmk3qy.js";import{R,je}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class jm extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setLinearVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetLinearVelocityBlock"}}var i=!1;function Qm(){if(i)return;i=!0,o("FlowGraphSetLinearVelocityBlock",jm)}
export{jm,Qm};

//# debugId=9BF82E5E8E4EF5DD64756E2164756E21
//# sourceMappingURL=site-2994w31a.js.map
