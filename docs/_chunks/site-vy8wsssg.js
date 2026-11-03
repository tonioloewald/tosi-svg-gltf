import{Ye}from"./site-hpkmk3qy.js";import{R,B}from"./site-0dyxb27k.js";import{us}from"./site-xytt0st3.js";import{o}from"./site-t1bgw9ek.js";class Fm extends Ye{constructor(e){super(e);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",B,1)}_execute(e,i){let t=us(e,this.sound.getValue(e));if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}let u=this.volume.getValue(e);t.volume=u,this.out._activateSignal(e)}getClassName(){return"FlowGraphSetSoundVolumeBlock"}}var r=!1;function Bm(){if(r)return;r=!0,o("FlowGraphSetSoundVolumeBlock",Fm)}
export{Fm,Bm};

//# debugId=9CEFC768EE99D83A64756E2164756E21
//# sourceMappingURL=site-vy8wsssg.js.map
