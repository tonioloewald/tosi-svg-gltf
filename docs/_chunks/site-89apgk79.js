import{be}from"./site-hpkmk3qy.js";import{R,ni}from"./site-0dyxb27k.js";function dp(e,c){let t=c;while(t){let r=e.getObjectReference(t,"nodes");if(r?.startsWith("/nodes/"))return r;t=t.parent}return""}class sA extends be{constructor(e){super(e);this.object=this.registerDataInput("object",R),this.value=this.registerDataOutput("value",ni,"")}_updateOutputs(e){this.value.setValue(dp(e,this.object.getValue(e)),e)}getClassName(){return"FlowGraphObjectReferenceBlock"}}
export{dp,sA};

//# debugId=EB1CFD7FA09D99F064756E2164756E21
//# sourceMappingURL=site-89apgk79.js.map
