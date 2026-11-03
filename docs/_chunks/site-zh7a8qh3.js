import{Yt}from"./site-hpkmk3qy.js";import{He}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Mg extends Yt{constructor(e){super(e);this.onOn=this._registerSignalOutput("onOn"),this.onOff=this._registerSignalOutput("onOff"),this.value=this.registerDataOutput("value",He)}_execute(e,l){let t=e._getExecutionVariable(this,"value",typeof this.config?.startValue==="boolean"?!this.config.startValue:!1);if(t=!t,e._setExecutionVariable(this,"value",t),this.value.setValue(t,e),t)this.onOn._activateSignal(e);else this.onOff._activateSignal(e)}getClassName(){return"FlowGraphFlipFlopBlock"}}var i=!1;function Og(){if(i)return;i=!0,o("FlowGraphFlipFlopBlock",Mg)}
export{Mg,Og};

//# debugId=6D056A286B04193764756E2164756E21
//# sourceMappingURL=site-zh7a8qh3.js.map
