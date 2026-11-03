import{Yt}from"./site-hpkmk3qy.js";import{He}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class gg extends Yt{constructor(e){super(e);this.condition=this.registerDataInput("condition",He),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function xg(){if(t)return;t=!0,o("FlowGraphBranchBlock",gg)}
export{gg,xg};

//# debugId=15F954FFCF84BDC264756E2164756E21
//# sourceMappingURL=site-0hsr0z6j.js.map
