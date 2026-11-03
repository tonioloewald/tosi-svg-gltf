import{Ye}from"./site-hpkmk3qy.js";import{B}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Eg extends Ye{constructor(t){super(t);this.count=this.registerDataInput("count",B),this.reset=this._registerSignalInput("reset"),this.currentCount=this.registerDataOutput("currentCount",B)}_execute(t,u){if(u===this.reset){t._setExecutionVariable(this,"debounceCount",0);return}let i=this.count.getValue(t),e=t._getExecutionVariable(this,"debounceCount",0)+1;if(this.currentCount.setValue(e,t),t._setExecutionVariable(this,"debounceCount",e),e>=i)this.out._activateSignal(t),t._setExecutionVariable(this,"debounceCount",0)}getClassName(){return"FlowGraphDebounceBlock"}}var r=!1;function Rg(){if(r)return;r=!0,o("FlowGraphDebounceBlock",Eg)}
export{Eg,Rg};

//# debugId=72D167C6245D283164756E2164756E21
//# sourceMappingURL=site-xh1s6a1p.js.map
