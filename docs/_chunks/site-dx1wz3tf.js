import{Ye}from"./site-hpkmk3qy.js";import{R,je}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class qm extends Ye{constructor(t){super(t);this.body=this.registerDataInput("body",R),this.velocity=this.registerDataInput("velocity",je)}_execute(t,r){let e=this.body.getValue(t);if(!e){this._reportError(t,"No physics body provided"),this.out._activateSignal(t);return}e.setAngularVelocity(this.velocity.getValue(t)),this.out._activateSignal(t)}getClassName(){return"FlowGraphSetAngularVelocityBlock"}}var i=!1;function Zm(){if(i)return;i=!0,o("FlowGraphSetAngularVelocityBlock",qm)}
export{qm,Zm};

//# debugId=BD8C992613797E6964756E2164756E21
//# sourceMappingURL=site-dx1wz3tf.js.map
