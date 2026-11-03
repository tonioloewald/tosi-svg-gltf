import{Ye}from"./site-hpkmk3qy.js";import{R}from"./site-0dyxb27k.js";import{us}from"./site-xytt0st3.js";import{o}from"./site-t1bgw9ek.js";class Om extends Ye{constructor(t){super(t);this.sound=this.registerDataInput("sound",R)}_execute(t,i){let r=us(t,this.sound.getValue(t));if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Dm(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",Om)}
export{Om,Dm};

//# debugId=542D84AF99A65D7C64756E2164756E21
//# sourceMappingURL=site-vtadqbe9.js.map
