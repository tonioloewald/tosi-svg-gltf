import{Ye}from"./site-hpkmk3qy.js";import{ni,He}from"./site-0dyxb27k.js";import{o}from"./site-t1bgw9ek.js";class Bg extends Ye{constructor(t){super(t);this.event=this.registerDataInput("event",ni),this.stopImmediate=this.registerDataInput("stopImmediate",He,!1)}_execute(t){let i=this.event.getValue(t),a=this.stopImmediate.getValue(t);t.configuration.coordinator.stopEventPropagation(i,a),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopEventPropagationBlock"}}var e=!1;function kg(){if(e)return;e=!0,o("FlowGraphStopEventPropagationBlock",Bg)}
export{Bg,kg};

//# debugId=D05469B319364B8464756E2164756E21
//# sourceMappingURL=site-jrzye36m.js.map
