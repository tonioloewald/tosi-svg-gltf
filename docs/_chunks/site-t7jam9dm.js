import{Ye}from"./site-hpkmk3qy.js";import{R}from"./site-0dyxb27k.js";import{us}from"./site-xytt0st3.js";import{o}from"./site-t1bgw9ek.js";class Lm extends Ye{constructor(e){super(e);this.sound=this.registerDataInput("sound",R)}_execute(e,s){let t=us(e,this.sound.getValue(e));if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function Nm(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",Lm)}
export{Lm,Nm};

//# debugId=BB74FBBAC19B8A2264756E2164756E21
//# sourceMappingURL=site-t7jam9dm.js.map
