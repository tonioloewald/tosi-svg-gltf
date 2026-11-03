import{be}from"./site-hpkmk3qy.js";import{R,oi}from"./site-0dyxb27k.js";import{_e}from"./site-8xv1k759.js";import{o}from"./site-t1bgw9ek.js";class l_ extends be{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",R),this.array=this.registerDataInput("array",R),this.index=this.registerDataOutput("index",oi,new _e(-1))}_updateOutputs(e){let i=this.object.getValue(e),t=this.array.getValue(e);if(t)this.index.setValue(new _e(t.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var r=!1;function c_(){if(r)return;r=!0,o("FlowGraphIndexOfBlock",l_)}
export{l_,c_};

//# debugId=DFF45DCC4FDA74FB64756E2164756E21
//# sourceMappingURL=site-q31a8826.js.map
