import{Ye}from"./site-hpkmk3qy.js";import{He}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";import{c}from"./site-h3pwfkan.js";class nh extends Ye{constructor(t){super(t);this.config=t,this.condition=this.registerDataInput("condition",He),this.executionFlow=this._registerSignalOutput("executionFlow"),this.completed=this._registerSignalOutput("completed"),this._unregisterSignalOutput("out")}_execute(t,r){let i=this.condition.getValue(t);if(this.config?.doWhile&&!i)this.executionFlow._activateSignal(t);let e=0;while(i){if(this.executionFlow._activateSignal(t),++e,e>=nh.MaxLoopCount){c.Warn("FlowGraphWhileLoopBlock: Max loop count reached. Breaking.");break}i=this.condition.getValue(t)}this.completed._activateSignal(t)}getClassName(){return"FlowGraphWhileLoopBlock"}}nh.MaxLoopCount=1000;var l=!1;function fg(){if(l)return;l=!0,o("FlowGraphWhileLoopBlock",nh)}
export{nh,fg};

//# debugId=E96887C1F0920D3F64756E2164756E21
//# sourceMappingURL=site-q4c8vxh7.js.map
