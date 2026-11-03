import{be,to,ri}from"./site-hpkmk3qy.js";import{R}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Gm extends be{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",R,NaN),this.default=this.registerDataInput("default",R),this.value=this.registerDataOutput("value",R);let s=this.config.cases||[];for(let t of s){if(t=ri(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,R))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(to(s))t=this._getOutputValueForCase(ri(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function zm(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",Gm)}
export{Gm,zm};

//# debugId=41242253B0DB44CC64756E2164756E21
//# sourceMappingURL=site-tz2nxk5y.js.map
