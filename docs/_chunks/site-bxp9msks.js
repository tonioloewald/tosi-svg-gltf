import{He}from"./site-0dyxb27k.js";import{Ql}from"./site-vfbwj4zn.js";import{o}from"./site-t1bgw9ek.js";class Km extends Ql{constructor(e){super(e);this.type="KeyDown",this.isRepeat=this.registerDataOutput("isRepeat",He)}_executeEvent(e,t){let r=t.event.repeat??!1;if(r&&this.config?.ignoreRepeat)return!0;return this.isRepeat.setValue(r,e),super._executeEvent(e,t)}getClassName(){return"FlowGraphKeyDownEventBlock"}}var s=!1;function Jm(){if(s)return;s=!0,o("FlowGraphKeyDownEventBlock",Km)}
export{Km,Jm};

//# debugId=7A9EC2AD589E53B464756E2164756E21
//# sourceMappingURL=site-bxp9msks.js.map
