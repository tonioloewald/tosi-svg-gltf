import{Ye}from"./site-hpkmk3qy.js";import{R,B,He}from"./site-0dyxb27k.js";import{us}from"./site-xytt0st3.js";import{o}from"./site-t1bgw9ek.js";class wm extends Ye{constructor(t){super(t);this.sound=this.registerDataInput("sound",R),this.volume=this.registerDataInput("volume",B,1),this.startOffset=this.registerDataInput("startOffset",B,0),this.loop=this.registerDataInput("loop",He,!1)}_execute(t,i){let e=us(t,this.sound.getValue(t));if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function Mm(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",wm)}
export{wm,Mm};

//# debugId=E71B7511082D92DC64756E2164756E21
//# sourceMappingURL=site-mdhra6d9.js.map
