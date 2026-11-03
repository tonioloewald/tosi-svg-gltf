function ln(r,e){let n=r._getGlobalContextVariable("animationGroupObserverSets",new Map),o=n.get(e.uniqueId);if(!o)return;return e.onAnimationGroupEndObservable.remove(o.groupEnd),e.onAnimationEndObservable.remove(o.animationEnd),e.onAnimationLoopObservable.remove(o.animationLoop),e.onAnimationGroupLoopObservable.remove(o.groupLoop),n.delete(e.uniqueId),r._setGlobalContextVariable("animationGroupObserverSets",n),o.block}
export{ln};

//# debugId=DA1BEA1945DDA64064756E2164756E21
//# sourceMappingURL=site-qb46vmy8.js.map
