import{Ye}from"./site-hpkmk3qy.js";import{oi}from"./site-0dyxb27k.js";import{_e}from"./site-8xv1k759.js";import{o}from"./site-t1bgw9ek.js";class Pg extends Ye{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new _e(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",oi),this.executionCount=this.registerDataOutput("executionCount",oi,new _e(0))}_execute(t,s){if(s===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new _e(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var i=!1;function wg(){if(i)return;i=!0,o("FlowGraphDoNBlock",Pg)}
export{Pg,wg};

//# debugId=4D6F5E236B6351DF64756E2164756E21
//# sourceMappingURL=site-dmjfqvnv.js.map
