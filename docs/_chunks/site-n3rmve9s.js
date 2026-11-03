import{Cc}from"./site-g9bsabf8.js";import{Oh}from"./site-mzas2hpw.js";class x0 extends Cc{constructor(e,t){super(e,t)}}class jd extends x0{constructor(e,t){super(e,t);this._subGraph=new jd._SubGraph(this)}async _initAsync(e){if(await this._subGraph.initAsync(e),this.engine.mainOut){if(!this._connect(this.engine.mainOut))throw Error("Connect failed")}this.engine._addMainBus(this)}dispose(){super.dispose(),this.engine._removeMainBus(this)}get _inNode(){return this._subGraph._inNode}get _outNode(){return this._subGraph._outNode}_connect(e){if(!super._connect(e))return!1;if(e._inNode)this._outNode?.connect(e._inNode);return!0}_disconnect(e){if(!super._disconnect(e))return!1;if(e._inNode)this._outNode?.disconnect(e._inNode);return!0}getClassName(){return"_WebAudioMainBus"}}jd._SubGraph=class extends Oh{get _downstreamNodes(){return this._owner._downstreamNodes??null}};
export{x0,jd};

//# debugId=2411B17D8ED8FB0964756E2164756E21
//# sourceMappingURL=site-n3rmve9s.js.map
