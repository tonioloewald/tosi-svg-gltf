function dd(t){if(!t)return null;if(typeof t==="string")return t;if(typeof t.play==="function")return null;let n=t.name;return typeof n==="string"?n:null}function us(t,n){if(n&&typeof n.play==="function")return n;let o=dd(n);return o!==null?t.configuration.coordinator.getSoundAsset(o):null}
export{dd,us};

//# debugId=81AD22720BF674AD64756E2164756E21
//# sourceMappingURL=site-xytt0st3.js.map
