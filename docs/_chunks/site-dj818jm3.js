import{Ye,ri,Pl}from"./site-hpkmk3qy.js";import{oi}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Sg extends Ye{constructor(e){super(e);this.delayIndex=this.registerDataInput("delayIndex",oi)}_execute(e,l){let a=ri(this.delayIndex.getValue(e));if(a<0||isNaN(a)||!isFinite(a)){if(this.config?.ignoreInvalidDelay){this.out._activateSignal(e);return}return this._reportError(e,"Invalid delay index")}let i=e._getGlobalContextVariable("pendingDelays",[]),r=i[a];if(r)r.dispose(),delete i[a],e._setGlobalContextVariable("pendingDelays",i);Pl(e,a),this.out._activateSignal(e)}getClassName(){return"FlowGraphCancelDelayBlock"}}var t=!1;function yg(){if(t)return;t=!0,o("FlowGraphCancelDelayBlock",Sg)}
export{Sg,yg};

//# debugId=8F55BA2A87CF3C4C64756E2164756E21
//# sourceMappingURL=site-dj818jm3.js.map
