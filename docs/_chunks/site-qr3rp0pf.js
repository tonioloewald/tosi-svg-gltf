import{aa}from"./site-1bb6313h.js";import{u,o,_,e,I,d,l,h,x,r,t,s,kt,v,X,_i}from"./site-t1bgw9ek.js";import{Cr}from"./site-42wd8me0.js";import{In}from"./site-4c6a74pf.js";import{L}from"./site-qaa0h24x.js";import{xs}from"./site-e04s4574.js";import{de,Ip}from"./site-sr27jj1c.js";import{ce}from"./site-c82ywvkz.js";import{Or,Xr}from"./site-hxfjb6nq.js";import{Jo,wn,w,Z,Xu,Xc,p}from"./site-kq1vrw0k.js";import{qe}from"./site-c8bnn7gc.js";import{he}from"./site-sb8zcbvd.js";import{di,F}from"./site-7tywn2ep.js";import{g}from"./site-dbvp65bz.js";import{Ei,Vn,ks,ut,_r,eu,Tr,Gn,NR,bm,vs,Sm}from"./site-5b61hg3x.js";import{C}from"./site-q9hnmsaa.js";import{n,fs}from"./site-t14aqrb9.js";import{yi}from"./site-y1v8z7vg.js";import{c}from"./site-h3pwfkan.js";import{i}from"./site-1yf4ncc8.js";var Ae="gaussianPointSplattingBlitVertexShader",rt=`attribute position: vec3f;varying vScreenUv: vec2f;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.position=vec4f(vertexInputs.position.xy,0.0,1.0);vertexOutputs.vScreenUv=vertexInputs.position.xy*0.5+vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_END
}
`;if(!i.ShadersStoreWGSL[Ae])i.ShadersStoreWGSL[Ae]=rt;var LO={name:Ae,shader:rt};var Oe="gaussianPointSplattingBlitPixelShader",at=`uniform resolution: vec2f;uniform projZ: vec4f;uniform inverseProjection: mat4x4f;uniform useInverseProjection: f32;uniform logarithmicDepthConstant: f32;varying vScreenUv: vec2f;var<storage,read> accumBuffer : array<vec4f>;var<storage,read> accumDepth : array<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
let res=uniforms.resolution;let uv=clamp(fragmentInputs.vScreenUv,vec2f(0.0,0.0),vec2f(0.99999,0.99999));let pixel=vec2u(uv*res);let idx=pixel.y*u32(res.x)+pixel.x;let accumulated=accumBuffer[idx];if (accumulated.w<0.0015) {discard;}
fragmentOutputs.color=vec4f(accumulated.rgb,accumulated.w);var depth=accumDepth[idx];if (uniforms.logarithmicDepthConstant>0.0) {var clipW : f32;if (uniforms.useInverseProjection>0.5) {let ndcXY=(vec2f(pixel)+0.5)/res*2.0-1.0;let unprojected=uniforms.inverseProjection*vec4f(ndcXY,depth,1.0);clipW=1.0/unprojected.w;} else {let vz=(depth*uniforms.projZ.w-uniforms.projZ.z)/(uniforms.projZ.x-depth*uniforms.projZ.y);clipW=uniforms.projZ.y*vz+uniforms.projZ.w;}
depth=log2(max(0.000001,1.0+clipW))*uniforms.logarithmicDepthConstant*0.5;}
fragmentOutputs.fragDepth=depth;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!i.ShadersStoreWGSL[Oe])i.ShadersStoreWGSL[Oe]=at;var NO={name:Oe,shader:at};var Le="gaussianPointSplattingDepthBlitPixelShader",nt=`uniform resolution: vec2f;uniform depthValues: vec2f;uniform projZ: vec4f;uniform inverseProjection: mat4x4f;uniform useInverseProjection: f32;uniform reverseDepth: f32;varying vScreenUv: vec2f;var<storage,read> accumBuffer : array<vec4f>;var<storage,read> accumDepth : array<f32>;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
let res=uniforms.resolution;let uv=clamp(fragmentInputs.vScreenUv,vec2f(0.0,0.0),vec2f(0.99999,0.99999));let pixel=vec2u(uv*res);let idx=pixel.y*u32(res.x)+pixel.x;if (accumBuffer[idx].w<0.0015) {discard;}
let ndc=accumDepth[idx];var clipZ : f32;if (uniforms.useInverseProjection>0.5) {let ndcXY=(vec2f(pixel)+0.5)/res*2.0-1.0;let unprojected=uniforms.inverseProjection*vec4f(ndcXY,ndc,1.0);clipZ=ndc/unprojected.w;} else {let denom=uniforms.projZ.x-ndc*uniforms.projZ.y;let vz=(ndc*uniforms.projZ.w-uniforms.projZ.z)/denom;clipZ=uniforms.projZ.x*vz+uniforms.projZ.z;}
let signedClipZ=select(clipZ,-clipZ,uniforms.reverseDepth>0.5);let metric=(signedClipZ+uniforms.depthValues.x)/uniforms.depthValues.y;fragmentOutputs.color=vec4f(metric,0.0,0.0,1.0);fragmentOutputs.fragDepth=ndc;
#define CUSTOM_FRAGMENT_MAIN_END
}
`;if(!i.ShadersStoreWGSL[Le])i.ShadersStoreWGSL[Le]=nt;var FO={name:Le,shader:nt};var Fe="gaussianPointSplatting",ot=`const GPS_DEPTH_CLEAR : u32=0xFFFFFFFFu;const GPS_DEPTH_MAX_CODE : u32=65534u;const GPS_TWO_PI : f32=6.2831853071795864;const GPS_U32_TO_UNIT : f32=2.3283064365386963e-10; 
const GPS_PARTITION_BUCKETS : u32=65536u;struct GpsUniforms {view : mat4x4f,
viewProjection : mat4x4f,
resNearFar : vec4f,
params0 : vec4f, 
focal : vec4f, 
camPosDeg : vec4f, 
depthNorm : vec4f, 
hiZInfo : vec4f, 
misc : vec4f, 
pixelMap : vec4f, 
projection : mat4x4f,
inverseProjection : mat4x4f,
projectedDepth : vec4f,};fn gpsProjectedDepth(inverseProjection : mat4x4f,ndcXY : vec2f,viewZ : f32)->vec2f {let origin=inverseProjection*vec4f(ndcXY,0.0,1.0);let direction=inverseProjection[2];let depth=(viewZ*origin.w-origin.z)/(direction.z-viewZ*direction.w);return vec2f(depth,1.0/(origin.w+depth*direction.w));}
fn gpsCov2D(covA : vec3f,covB : vec3f,modelView : mat4x4f,projection : mat4x4f,clip : vec4f,pixelScale : vec2f)->mat3x3f {let rowW=vec3f(projection[0].w,projection[1].w,projection[2].w);let rowX=vec3f(projection[0].x,projection[1].x,projection[2].x);let rowY=vec3f(projection[0].y,projection[1].y,projection[2].y);let jx=(rowX-clip.x/clip.w*rowW)*(0.5*pixelScale.x/clip.w);let jy=(rowY-clip.y/clip.w*rowW)*(0.5*pixelScale.y/clip.w);let J=mat3x3f(jx,jy,vec3f(0.0));let T=transpose(mat3x3f(modelView[0].xyz,modelView[1].xyz,modelView[2].xyz))*J;let covariance=mat3x3f(covA.x,covA.y,covA.z,covA.y,covB.x,covB.y,covA.z,covB.y,covB.z);return transpose(T)*covariance*T;}
struct GpsPart {world : mat4x4f,
vis : vec4f, 
dbg0 : vec4f, 
dbg1 : vec4f, 
dbg2 : vec4f, 
dbg3 : vec4f, 
dbg4 : vec4f, };fn gpsInverseMat3(inMatrix : mat3x3f)->mat3x3f {let a00=inMatrix[0][0]; let a01=inMatrix[0][1]; let a02=inMatrix[0][2];let a10=inMatrix[1][0]; let a11=inMatrix[1][1]; let a12=inMatrix[1][2];let a20=inMatrix[2][0]; let a21=inMatrix[2][1]; let a22=inMatrix[2][2];let b01=a22*a11-a12*a21;let b11=-a22*a10+a12*a20;let b21=a21*a10-a11*a20;let det=a00*b01+a01*b11+a02*b21;return mat3x3f(b01/det,(-a22*a01+a02*a21)/det,(a12*a01-a02*a11)/det,
b11/det,(a22*a00-a02*a20)/det,(-a12*a00+a02*a10)/det,
b21/det,(-a21*a00+a01*a20)/det,(a11*a00-a01*a10)/det);}
struct GpsScreen {pmConicXY : vec4f,
conicZChol : vec4f,
colorOp : vec4f, 
depth : vec4u, };const GPS_FLAG_SATURATE : u32=1u; 
const GPS_FLAG_SCREEN_RECT : u32=2u;const GPS_MAX_ALPHA : f32=0.999;fn gpsPointIntensity(alpha : f32)->f32 {return -log(1.0-min(alpha,GPS_MAX_ALPHA));}
fn gpsGetPixelMean(s : GpsScreen)->vec2f { return s.pmConicXY.xy; }
fn gpsGetConic(s : GpsScreen)->vec3f { return vec3f(s.pmConicXY.z,s.pmConicXY.w,s.conicZChol.x); }
fn gpsGetChol(s : GpsScreen)->vec3f { return s.conicZChol.yzw; }
fn gpsPackRGB565(c : vec3f)->u32 {let r=u32(clamp(c.r,0.0,1.0)*31.0+0.5);let g=u32(clamp(c.g,0.0,1.0)*63.0+0.5);let b=u32(clamp(c.b,0.0,1.0)*31.0+0.5);return (r<<11u) | (g<<5u) | b;}
fn gpsUnpackRGB565(v : u32)->vec3f {return vec3f(
f32((v>>11u) & 31u)/31.0,
f32((v>>5u) & 63u)/63.0,
f32(v & 31u)/31.0
);}
fn gpsPackKey(depthKey : u32,colorKey : u32)->u32 {return (depthKey<<16u) | (colorKey & 0xFFFFu);}
fn gpsKeyColor(key : u32,mask : u32)->vec3f {return gpsUnpackRGB565((key ^ mask) & 0xFFFFu);}
fn gpsPcg(vIn : u32)->u32 {let state=vIn*747796405u+2891336453u;let word=((state>>((state>>28u)+4u)) ^ state)*277803737u;return (word>>22u) ^ word;}
fn gpsHash2(a : u32,b : u32)->u32 {return gpsPcg(a ^ gpsPcg(b));}
fn gpsUnit(state : u32)->f32 {return f32(state)*GPS_U32_TO_UNIT;}
fn gpsBoxMuller(u1 : f32,u2 : f32)->vec2f {let r=sqrt(-2.0*log(max(1e-7,u1)));let theta=GPS_TWO_PI*u2;return vec2f(r*cos(theta),r*sin(theta));}
const GPS_LI2_MAX : f32=1.6449340668482264; 
fn gpsDilog(x : f32)->f32 {var y=-6.09201442e-01;y=y*x+1.79126616e+00;y=y*x+-2.14953223e+00;y=y*x+1.26304372e+00;y=y*x+-4.59069895e-01;y=y*x+-1.87417414e-01;y=y*x+1.99603130e+00;y=y*x+5.99669467e-05;let s=1.0-x;if (s>0.0) {y+=s*log(max(s,1e-37));}
return y;}
fn gpsInvDilog(x : f32)->f32 {let t=min(x/GPS_LI2_MAX,1.0);var y=-1.27463503e+01;y=y*t+5.88993459e+01;y=y*t+-1.16025780e+02;y=y*t+1.26945827e+02;y=y*t+-8.43108826e+01;y=y*t+3.48799862e+01;y=y*t+-8.89606235e+00;y=y*t+1.38640936e+00;y=y*t+-7.80640876e-01;y=y*t+1.64841888e+00;y=y*t+-2.82836687e-05;return y;}
fn gpsCorrectedBoxMuller(u1 : f32,u2 : f32,alpha : f32)->vec2f {var a=(1.0/max(alpha,1e-37))*gpsInvDilog((1.0-u1)*gpsDilog(alpha));a=clamp(a,1e-37,1.0);let r=sqrt(max(-2.0*log(a),0.0));let theta=GPS_TWO_PI*u2;return vec2f(r*cos(theta),r*sin(theta));}
const GPS_POISSON_SMALL_MEAN : f32=12.0;fn gpsPoisson(seed : u32,lambda : f32)->u32 {let st1=gpsPcg(seed);if (lambda<GPS_POISSON_SMALL_MEAN) {let u=gpsUnit(st1);var p=exp(-lambda);var cdf=p;var k=0u;loop {if (u<cdf || (f32(k)>lambda && p<1e-7)) {break;}
k=k+1u;p=p*lambda/f32(k);cdf=cdf+p;}
return k;}
let st2=gpsPcg(st1);let w=gpsBoxMuller(gpsUnit(st1),gpsUnit(st2)).x;let w2=w*w;let w3=w2*w;let w4=w2*w2;let s=sqrt(lambda);let invS=1.0/s;let invL=1.0/lambda;var kf=lambda+s*w+(w2-1.0)/6.0;kf+=invS*(-(1.0/36.0)*w-(1.0/72.0)*w3);kf+=invL*(-(8.0/405.0)+(7.0/810.0)*w2+(1.0/270.0)*w4);return u32(max(i32(round(kf)),0));}
fn gpsGaussianValue(conic : vec3f,d : vec2f)->f32 {let power=-0.5*(conic.x*d.x*d.x+conic.z*d.y*d.y)-conic.y*d.x*d.y;return exp(power);}
`;if(!i.IncludesShadersStoreWGSL[Fe])i.IncludesShadersStoreWGSL[Fe]=ot;var _e={name:Fe,shader:ot};var Ge="gpsPreprocessComputeShader",lt=`#include<gaussianPointSplatting>
#include<gaussianSplattingShared>
@group(0) @binding(0) var<storage,read> means : array<vec4f>;@group(0) @binding(1) var<storage,read> colorOpacity : array<u32>;@group(0) @binding(2) var<storage,read_write> weights : array<u32>;@group(0) @binding(3) var<storage,read_write> gsData : array<GpsScreen>;@group(0) @binding(4) var<uniform> uniforms : GpsUniforms;@group(0) @binding(5) var<storage,read> cov3d : array<u32>; 
@group(0) @binding(6) var<storage,read> sh : array<u32>; 
@group(0) @binding(7) var<storage,read> parts : array<GpsPart>; 
@group(0) @binding(8) var<storage,read> hiZ : array<f32>; 
fn gpsHiZLevelOffset(l : u32,baseW : u32,baseH : u32)->u32 {var off=0u;for (var i=0u; i<l; i=i+1u) {off+=max(1u,baseW>>i)*max(1u,baseH>>i);}
return off;}
fn gpsHiZOccluded(center : vec2f,footR : f32,viewDepth : f32)->bool {let baseW=u32(uniforms.hiZInfo.x);let baseH=u32(uniforms.hiZInfo.y);let numLevels=u32(uniforms.hiZInfo.z);let minx=i32(floor(center.x-footR));let maxx=i32(ceil(center.x+footR));let miny=i32(floor(center.y-footR));let maxy=i32(ceil(center.y+footR));let d=f32(max(maxx-minx,maxy-miny)+1);var lod=i32(ceil(log2(max(d,1.0)*0.5)));lod=clamp(lod,0,i32(numLevels)-1);let L=u32(lod);let lw=max(1u,baseW>>L);let lh=max(1u,baseH>>L);let tile=1u<<L;let off=gpsHiZLevelOffset(L,baseW,baseH);let tx0=min(u32(max(minx,0))/tile,lw-1u);let tx1=min(u32(max(maxx,0))/tile,lw-1u);let ty0=min(u32(max(miny,0))/tile,lh-1u);let ty1=min(u32(max(maxy,0))/tile,lh-1u);var zMax=0.0;for (var ty=ty0; ty<=ty1; ty=ty+1u) {let row=off+ty*lw;for (var tx=tx0; tx<=tx1; tx=tx+1u) {zMax=max(zMax,hiZ[row+tx]);}}
return zMax<viewDepth;}
#if SH_DEGREE>0
#if SH_DEGREE==1
const GPS_SH_WORDS : u32=3u; 
#elif SH_DEGREE==2
const GPS_SH_WORDS : u32=6u; 
#elif SH_DEGREE==3
const GPS_SH_WORDS : u32=12u; 
#else
const GPS_SH_WORDS : u32=18u; 
#endif
fn gpsShByte(baseWord : u32,s : u32)->f32 {let w=sh[baseWord+(s>>2u)];let b=(w>>(8u*(s & 3u))) & 0xFFu;return f32(b)*(2.0/255.0)-1.0;}
fn gpsShCoeff(baseWord : u32,j : u32)->vec3f {let s=j*3u;return vec3f(gpsShByte(baseWord,s),gpsShByte(baseWord,s+1u),gpsShByte(baseWord,s+2u));}
#if SH_DEGREE==1
const GPS_SH_DIM : u32=3u;
#elif SH_DEGREE==2
const GPS_SH_DIM : u32=8u;
#elif SH_DEGREE==3
const GPS_SH_DIM : u32=15u;
#else
const GPS_SH_DIM : u32=24u;
#endif
fn gpsEvalShDelta(g : u32,dir : vec3f,so1 : f32,so2 : f32,so3 : f32,so4 : f32)->vec3f {let base=g*GPS_SH_WORDS;var coeffs : array<vec3<f32>,25>;for (var j=0u; j<GPS_SH_DIM; j=j+1u) {coeffs[1u+j]=gpsShCoeff(base,j);}
return computeColorFromSHDegree(dir,coeffs,so1,so2,so3,so4);}
#endif
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let g=gid.y*65535u*256u+gid.x;let count=u32(uniforms.params0.x);if (g>=count) {return;}
weights[g]=0u;let mean=means[g].xyz;let partIndex=u32(means[g].w);let pdata=parts[partIndex];let partWorld=pdata.world;let near=uniforms.resNearFar.z;let far=uniforms.resNearFar.w;let worldPos=(partWorld*vec4f(mean,1.0)).xyz;let camspace=uniforms.view*vec4f(worldPos,1.0);let clip=uniforms.viewProjection*vec4f(worldPos,1.0);if (clip.w<=0.0) {return;}
let viewDepth=select(camspace.z,-camspace.z,uniforms.focal.z>0.5);let projectedDepth=(u32(uniforms.misc.w) & 2u) != 0u;if (!projectedDepth && (viewDepth<=near || (far>0.0 && viewDepth>=far))) {return;}
let ndc=clip.xyz/clip.w;if (ndc.x<-1.3 || ndc.x>1.3 || ndc.y<-1.3 || ndc.y>1.3) {return;}
let px=(ndc.x*0.5+0.5)*uniforms.pixelMap.x+uniforms.pixelMap.z;let py=(ndc.y*0.5+0.5)*uniforms.pixelMap.y+uniforms.pixelMap.w;let covFactor=bitcast<f32>(cov3d[4u*g+3u]);let p0=unpack2x16float(cov3d[4u*g+0u])*covFactor; 
let p1=unpack2x16float(cov3d[4u*g+1u])*covFactor; 
let p2=unpack2x16float(cov3d[4u*g+2u])*covFactor; 
let covA=vec3f(p0.x,p0.y,p1.x); 
let covB=vec3f(p1.y,p2.x,p2.y); 
let isOrtho=uniforms.focal.w>0.5;let modelView=uniforms.view*partWorld;var cov2d : mat3x3f;if ((u32(uniforms.misc.w) & 1u) != 0u) {cov2d=gpsCov2D(covA,covB,modelView,uniforms.projection,clip,uniforms.pixelMap.xy);} else {cov2d=computeCov2D(covA,covB,modelView,camspace.xyz,uniforms.focal.xy,isOrtho);}
cov2d=cov2d*0.25;let detOrig=cov2d[0][0]*cov2d[1][1]-cov2d[0][1]*cov2d[0][1];let kernelSize=uniforms.params0.y;cov2d[0][0]+=kernelSize;cov2d[1][1]+=kernelSize;let a=cov2d[0][0];let b=cov2d[0][1];let cc=cov2d[1][1];let det=a*cc-b*b;if (det<=0.0) {return;}
let lambda1=(a+cc)*0.5+length(vec2f((a-cc)*0.5,b));let minPixelSize=uniforms.misc.y;if (minPixelSize>0.0 && 4.0*uniforms.misc.x*sqrt(2.0*lambda1)<minPixelSize) {return;}
if (uniforms.hiZInfo.w>0.5) {let footR=3.0*sqrt(max(lambda1,0.0)); 
var nearestDepth=viewDepth;if (projectedDepth) {let low=((vec2f(px,py)-footR-uniforms.pixelMap.zw)/uniforms.pixelMap.xy)*2.0-1.0;let high=((vec2f(px,py)+footR-uniforms.pixelMap.zw)/uniforms.pixelMap.xy)*2.0-1.0;var depths=vec4f(
gpsProjectedDepth(uniforms.inverseProjection,low,camspace.z).x,
gpsProjectedDepth(uniforms.inverseProjection,high,camspace.z).x,
gpsProjectedDepth(uniforms.inverseProjection,vec2f(low.x,high.y),camspace.z).x,
gpsProjectedDepth(uniforms.inverseProjection,vec2f(high.x,low.y),camspace.z).x);if ((u32(uniforms.misc.w) & 4u) != 0u) {depths=vec4f(1.0)-depths;}
nearestDepth=min(min(depths.x,depths.y),min(depths.z,depths.w));}
if (gpsHiZOccluded(vec2f(px,py),footR,nearestDepth)) {return;}}
let compensation=select(1.0,sqrt(max(0.0,detOrig/det)),uniforms.depthNorm.w>0.5);let invDet=1.0/det;let conic=vec3f(cc*invDet,-b*invDet,a*invDet);let chol0=sqrt(a);let chol1=b/chol0;let chol2=sqrt(max(0.0,cc-chol1*chol1));let rgba=colorOpacity[g];let baseColor=vec3f(f32(rgba & 0xFFu),f32((rgba>>8u) & 0xFFu),f32((rgba>>16u) & 0xFFu))/255.0;let baseOpacity=f32((rgba>>24u) & 0xFFu)/255.0;if (baseOpacity==0.0) {return;}
if (uniforms.depthNorm.z>0.5) {let clipMin=pdata.dbg0.xyz;let clipMax=vec3f(pdata.dbg0.w,pdata.dbg1.x,pdata.dbg1.y);if (any(worldPos<clipMin) || any(worldPos>clipMax)) {return;}
if (baseOpacity<pdata.dbg1.z || baseOpacity>pdata.dbg1.w) {return;}
let det3d=p0.x*(p1.y*p2.y-p2.x*p2.x)-p0.y*(p0.y*p2.y-p2.x*p1.x)+p1.x*(p0.y*p2.x-p1.y*p1.x);let splatSize=pow(abs(det3d),1.0/6.0);if (splatSize<pdata.dbg2.x || splatSize>pdata.dbg2.y) {return;}}
var color=baseColor*pdata.dbg3.x;var opacity=clamp(baseOpacity*pdata.vis.x*pdata.dbg2.z*compensation,0.0,1.0);let saturate=pdata.dbg2.w>0.5;
#if SH_DEGREE>0
{let worldRot=mat3x3f(partWorld[0].xyz,partWorld[1].xyz,partWorld[2].xyz);let dir=normalize(gpsInverseMat3(worldRot)*(worldPos-uniforms.camPosDeg.xyz));color+=gpsEvalShDelta(g,dir,pdata.dbg3.y,pdata.dbg3.z,pdata.dbg3.w,pdata.dbg4.x);}
#endif
let lambdaMax=gpsPointIntensity(opacity);var importance : f32;if (saturate) {importance=4.0*GPS_TWO_PI*sqrt(det)*lambdaMax*uniforms.params0.z;} else {importance=GPS_TWO_PI*sqrt(det)*gpsDilog(opacity)*uniforms.params0.z;}
let res=uniforms.resNearFar.xy;let halfExtent=sqrt(8.0*vec2f(a,cc));let rectMin=clamp(floor(vec2f(px,py)-halfExtent),vec2f(0.0),res);let rectMax=clamp(ceil(vec2f(px,py)+halfExtent),vec2f(0.0),res);let rectSize=rectMax-rectMin;let rectImportance=lambdaMax*rectSize.x*rectSize.y*uniforms.params0.z;let useRect=rectImportance<importance;let chosen=select(importance,rectImportance,useRect);if (chosen<1e-4) {return;}
let seed=gpsHash2(g,u32(uniforms.params0.w));let numPoints=gpsPoisson(gpsPcg(seed),chosen);if (numPoints==0u) {return;}
var s : GpsScreen;s.pmConicXY=vec4f(px,py,conic.x,conic.y);s.conicZChol=vec4f(conic.z,chol0,chol1,chol2);s.colorOp=vec4f(color,opacity);let dmin=uniforms.depthNorm.x;let dmax=uniforms.depthNorm.y;let dord=clamp((viewDepth-dmin)/max(dmax-dmin,1e-6),0.0,1.0);let flags=select(0u,GPS_FLAG_SATURATE,saturate) | select(0u,GPS_FLAG_SCREEN_RECT,useRect);let rmin=vec2u(rectMin);let rmax=vec2u(rectMax);let depthKey=select(u32(dord*f32(GPS_DEPTH_MAX_CODE)),bitcast<u32>(camspace.z),projectedDepth);s.depth=vec4u(depthKey,flags,rmin.x | (rmin.y<<16u),rmax.x | (rmax.y<<16u));gsData[g]=s;weights[g]=numPoints;}
`;if(!i.ShadersStoreWGSL[Ge])i.ShadersStoreWGSL[Ge]=lt;var ns=[_e,aa];for(let a of ns)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var BO={name:Ge,shader:lt};var ze="gaussianPointSplattingScan",ct=`const GpsMaxPointCount : u32=0xFFFFFF00u;fn gpsSaturatingAdd(a : u32,b : u32)->u32 {let sum=a+b;return select(GpsMaxPointCount,sum,sum>=a && sum<=GpsMaxPointCount);}
var<workgroup> gpsScanTemp : array<u32,512>;fn gpsScanExclusive512(t : u32)->u32 {var offset=1u;for (var d=256u; d>0u; d=d>>1u) {workgroupBarrier();if (t<d) {let ai=offset*(2u*t+1u)-1u;let bi=offset*(2u*t+2u)-1u;gpsScanTemp[bi]=gpsSaturatingAdd(gpsScanTemp[bi],gpsScanTemp[ai]);}
offset=offset<<1u;}
var total=0u;if (t==0u) {total=gpsScanTemp[511];gpsScanTemp[511]=0u; }
for (var d=1u; d<512u; d=d<<1u) {offset=offset>>1u;workgroupBarrier();if (t<d) {let ai=offset*(2u*t+1u)-1u;let bi=offset*(2u*t+2u)-1u;let s=gpsScanTemp[ai];gpsScanTemp[ai]=gpsScanTemp[bi];gpsScanTemp[bi]=gpsSaturatingAdd(gpsScanTemp[bi],s);}}
workgroupBarrier();return total;}
`;if(!i.IncludesShadersStoreWGSL[ze])i.IncludesShadersStoreWGSL[ze]=ct;var xe={name:ze,shader:ct};var ke="gpsScanBlocksComputeShader",ht=`#include<gaussianPointSplattingScan>
@group(0) @binding(0) var<storage,read> weights : array<u32>;@group(0) @binding(1) var<storage,read_write> cdf : array<u32>;@group(0) @binding(2) var<storage,read_write> blockSums : array<u32>;@compute @workgroup_size(256,1,1)
fn main(@builtin(local_invocation_id) lid : vec3u,@builtin(workgroup_id) wid : vec3u) {let t=lid.x;let block=wid.y*65535u+wid.x;let base=block*512u;let n=arrayLength(&weights);let i0=base+2u*t;let i1=base+2u*t+1u;gpsScanTemp[2u*t]=select(0u,weights[i0],i0<n);gpsScanTemp[2u*t+1u]=select(0u,weights[i1],i1<n);let total=gpsScanExclusive512(t);if (t==0u) {blockSums[block]=total;}
if (i0<n) {cdf[i0]=gpsScanTemp[2u*t];}
if (i1<n) {cdf[i1]=gpsScanTemp[2u*t+1u];}}
`;if(!i.ShadersStoreWGSL[ke])i.ShadersStoreWGSL[ke]=ht;var os=[xe];for(let a of os)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var kO={name:ke,shader:ht};var Ie="gpsScanSumsComputeShader",dt=`#include<gaussianPointSplattingScan>
@group(0) @binding(0) var<storage,read_write> blockSums : array<u32>;@group(0) @binding(1) var<storage,read_write> pointCount : array<u32>;@group(0) @binding(2) var<storage,read_write> indirectArgs : array<u32>;var<workgroup> wgCarry : u32;var<workgroup> wgChunkTotal : u32;@compute @workgroup_size(256,1,1)
fn main(@builtin(local_invocation_id) lid : vec3u) {let t=lid.x;let n=arrayLength(&blockSums);if (t==0u) {wgCarry=0u;}
workgroupBarrier();var chunk=0u;loop {if (chunk>=n) {break;}
let i0=chunk+2u*t;let i1=chunk+2u*t+1u;gpsScanTemp[2u*t]=select(0u,blockSums[i0],i0<n);gpsScanTemp[2u*t+1u]=select(0u,blockSums[i1],i1<n);let total=gpsScanExclusive512(t);if (t==0u) {wgChunkTotal=total;}
workgroupBarrier();if (i0<n) {blockSums[i0]=gpsSaturatingAdd(gpsScanTemp[2u*t],wgCarry);}
if (i1<n) {blockSums[i1]=gpsSaturatingAdd(gpsScanTemp[2u*t+1u],wgCarry);}
workgroupBarrier();if (t==0u) {wgCarry=gpsSaturatingAdd(wgCarry,wgChunkTotal);}
workgroupBarrier();chunk=chunk+512u;}
if (t==0u) {let totalGroups=wgCarry/256u+select(0u,1u,(wgCarry % 256u) != 0u);let gx=min(totalGroups,65535u);let gy=totalGroups/65535u+select(0u,1u,(totalGroups % 65535u) != 0u);pointCount[0]=wgCarry; 
pointCount[1]=totalGroups; 
indirectArgs[0]=gx;indirectArgs[1]=gy;indirectArgs[2]=1u;}}
`;if(!i.ShadersStoreWGSL[Ie])i.ShadersStoreWGSL[Ie]=dt;var ls=[xe];for(let a of ls)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var VO={name:Ie,shader:dt};var We="gpsScanAddComputeShader",ft=`#include<gaussianPointSplattingScan>
@group(0) @binding(0) var<storage,read_write> cdf : array<u32>;@group(0) @binding(1) var<storage,read> blockSums : array<u32>;@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let i=gid.y*65535u*256u+gid.x;if (i>=arrayLength(&cdf)) {return;}
cdf[i]=gpsSaturatingAdd(cdf[i],blockSums[i/512u]);}
`;if(!i.ShadersStoreWGSL[We])i.ShadersStoreWGSL[We]=ft;var us=[xe];for(let a of us)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var GO={name:We,shader:ft};var Ne="gpsPartitionComputeShader",pt=`#include<gaussianPointSplatting>
@group(0) @binding(0) var<storage,read> cdf : array<u32>;@group(0) @binding(1) var<storage,read> pointCount : array<u32>;@group(0) @binding(2) var<storage,read_write> partTable : array<u32>;fn gpsFindGaussian(p : u32,count : u32)->u32 {var lo=0u;var hi=count;loop {if (lo+1u>=hi) {break;}
let mid=(lo+hi)>>1u;if (cdf[mid]<=p) {lo=mid;} else {hi=mid;}}
return lo;}
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let k=gid.x;if (k>GPS_PARTITION_BUCKETS) {return;}
let total=pointCount[0];let count=arrayLength(&cdf);if (total==0u || count==0u) {partTable[k]=0u;return;}
var pk=u32(f32(k)/f32(GPS_PARTITION_BUCKETS)*f32(total));if (pk>total-1u) {pk=total-1u;}
partTable[k]=gpsFindGaussian(pk,count);}
`;if(!i.ShadersStoreWGSL[Ne])i.ShadersStoreWGSL[Ne]=pt;var cs=[_e];for(let a of cs)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var zO={name:Ne,shader:pt};var Ue="gpsSplatComputeShader",_t=`#include<gaussianPointSplatting>
@group(0) @binding(0) var<storage,read> cdf : array<u32>;@group(0) @binding(1) var<storage,read> gsData : array<GpsScreen>;@group(0) @binding(2) var<storage,read_write> imageBuffer : array<atomic<u32>>;@group(0) @binding(3) var<uniform> uniforms : GpsUniforms;@group(0) @binding(4) var<storage,read> pointCount : array<u32>;@group(0) @binding(5) var<storage,read> partTable : array<u32>; 
fn gpsFindGaussian(p : u32,loInit : u32,hiInit : u32)->u32 {var lo=loInit;var hi=hiInit;loop {if (lo+1u>=hi) {break;}
let mid=(lo+hi)>>1u;if (cdf[mid]<=p) {lo=mid;} else {hi=mid;}}
return lo;}
@compute @workgroup_size(256,1,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let p=gid.y*65535u*256u+gid.x;let total=pointCount[0];if (p>=total) {return;}
let count=u32(uniforms.params0.x);let bucket=min(u32(max(f32(p)/f32(total)*f32(GPS_PARTITION_BUCKETS),0.0)),GPS_PARTITION_BUCKETS-1u);let loB=select(bucket-1u,0u,bucket==0u);let hiB=min(bucket+2u,GPS_PARTITION_BUCKETS);let g=gpsFindGaussian(p,partTable[loB],min(partTable[hiB]+1u,count));let s=gsData[g];let pixelMean=gpsGetPixelMean(s);let conic=gpsGetConic(s);let chol=gpsGetChol(s);let opacity=s.colorOp.w;let saturate=(s.depth.y & GPS_FLAG_SATURATE) != 0u;var st=gpsHash2(p,u32(uniforms.params0.w));st=gpsPcg(st);let u1=gpsUnit(st);st=gpsPcg(st);let u2=gpsUnit(st);var offset : vec2f;if ((s.depth.y & GPS_FLAG_SCREEN_RECT) != 0u) {let rectMin=vec2f(f32(s.depth.z & 0xFFFFu),f32(s.depth.z>>16u));let rectMax=vec2f(f32(s.depth.w & 0xFFFFu),f32(s.depth.w>>16u));offset=mix(rectMin,rectMax,vec2f(u1,u2))-pixelMean;} else {var z : vec2f;if (saturate) {let r=sqrt(u1)*2.8284271; 
let ang=GPS_TWO_PI*u2;z=vec2f(r*cos(ang),r*sin(ang));} else {z=gpsCorrectedBoxMuller(u1,u2,opacity);}
offset=vec2f(chol.x*z.x,chol.y*z.x+chol.z*z.y);}
let mahalanobis2=conic.x*offset.x*offset.x+2.0*conic.y*offset.x*offset.y+conic.z*offset.y*offset.y;if (mahalanobis2>8.0) {return;}
let pixel=floor(pixelMean+offset);let x=i32(pixel.x);let y=i32(pixel.y);let res=vec2i(vec2u(uniforms.resNearFar.xy));if (x<0 || y<0 || x>=res.x || y>=res.y) {return;}
let alpha=select(opacity*exp(-0.5*mahalanobis2),opacity,saturate);if (alpha<0.00392) { 
return;}
if ((s.depth.y & GPS_FLAG_SCREEN_RECT) != 0u) {st=gpsPcg(st);if (gpsUnit(st)*gpsPointIntensity(opacity)>=gpsPointIntensity(alpha)) {return;}}
st=gpsPcg(st);let dr=gpsUnit(st)-0.5;st=gpsPcg(st);let dg=gpsUnit(st)-0.5;st=gpsPcg(st);let db=gpsUnit(st)-0.5;let dithered=s.colorOp.rgb/uniforms.projectedDepth.z+vec3f(dr/31.0,dg/63.0,db/31.0);var depthKey=s.depth.x;if ((u32(uniforms.misc.w) & 2u) != 0u) {let ndcXY=((pixel+0.5-uniforms.pixelMap.zw)/uniforms.pixelMap.xy)*2.0-1.0;let projected=gpsProjectedDepth(uniforms.inverseProjection,ndcXY,bitcast<f32>(s.depth.x));if (!(projected.x>=0.0 && projected.x<=1.0 && projected.y>0.0)) {return;}
let ordered=select(projected.x,1.0-projected.x,(u32(uniforms.misc.w) & 4u) != 0u);let normalized=clamp((ordered-uniforms.projectedDepth.x)/max(uniforms.projectedDepth.y-uniforms.projectedDepth.x,1e-6),0.0,1.0);depthKey=u32(normalized*f32(GPS_DEPTH_MAX_CODE));}
let key=gpsPackKey(depthKey,gpsPackRGB565(dithered) ^ u32(uniforms.misc.z));let idx=u32(y)*u32(res.x)+u32(x);if (atomicLoad(&imageBuffer[idx])<=key) {return;}
atomicMin(&imageBuffer[idx],key);}
`;if(!i.ShadersStoreWGSL[Ue])i.ShadersStoreWGSL[Ue]=_t;var hs=[_e];for(let a of hs)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var UO={name:Ue,shader:_t};var je="gpsResolveComputeShader",mt=`#include<gaussianPointSplatting>
struct GpsResolveParams {resolution : vec2f, 
outResolution : vec2f,
depthNorm : vec2f, 
colorMask : vec2f, 
upsample : vec4f, 
misc2 : vec4f, 
projZ : vec4f, 
inverseProjection : mat4x4f,
occlusion : vec4f, };@group(0) @binding(0) var<storage,read_write> accumBuffer : array<vec4f>;@group(0) @binding(1) var<uniform> params : GpsResolveParams;@group(0) @binding(2) var<storage,read_write> imageBuffer : array<atomic<u32>>;@group(0) @binding(3) var<storage,read_write> accumDepth : array<f32>;@group(0) @binding(4) var<storage,read_write> hiZ : array<f32>; 
@group(0) @binding(5) var<storage,read_write> accumCount : array<u32>; 
const GPS_HIZ_FAR : f32=1e30; 
@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let res=vec2u(params.resolution); 
if (gid.x>=res.x || gid.y>=res.y) {return;}
let idx=gid.y*res.x+gid.x; 
let raw=atomicLoad(&imageBuffer[idx]);var hitColor=vec3f(0.0,0.0,0.0);var hit=0.0;var depth=1.0;var occlVz=GPS_HIZ_FAR;var viewZ=0.0;if (raw != GPS_DEPTH_CLEAR) {hitColor=gpsKeyColor(raw,u32(params.colorMask.x))*params.colorMask.y;hit=1.0;let dq=f32(raw>>16u)/f32(GPS_DEPTH_MAX_CODE);let vz=params.depthNorm.x+dq*(params.depthNorm.y-params.depthNorm.x);occlVz=vz+(params.depthNorm.y-params.depthNorm.x)/f32(GPS_DEPTH_MAX_CODE);depth=(params.projZ.x*vz+params.projZ.z)/(params.projZ.y*vz+params.projZ.w);if (params.misc2.w>0.5) {depth=select(vz,1.0-vz,params.misc2.z>0.5);let outputPixel=vec2f(gid.xy)*params.upsample.x+params.upsample.yz+0.5;let ndcXY=outputPixel/params.outResolution*2.0-1.0;let unprojected=params.inverseProjection*vec4f(ndcXY,depth,1.0);viewZ=unprojected.z/unprojected.w;}}
if (params.occlusion.x>0.5) {hiZ[idx]=occlVz;}
atomicStore(&imageBuffer[idx],GPS_DEPTH_CLEAR);let n=u32(params.upsample.x);let outRes=vec2u(params.outResolution);let gen=u32(params.upsample.w);let premult=hitColor*hit;if (params.misc2.y>0.5) {for (var dy=0u; dy<n; dy=dy+1u) {for (var dx=0u; dx<n; dx=dx+1u) {let ox2=gid.x*n+dx;let oy2=gid.y*n+dy;if (ox2<outRes.x && oy2<outRes.y) {let oi=oy2*outRes.x+ox2;var outputDepth=depth;var outputHit=hit;if (params.misc2.w>0.5 && hit>0.5) {let ndcXY=(vec2f(f32(ox2),f32(oy2))+0.5)/params.outResolution*2.0-1.0;let projected=gpsProjectedDepth(params.inverseProjection,ndcXY,viewZ);outputDepth=projected.x;outputHit=select(0.0,hit,projected.x>=0.0 && projected.x<=1.0 && projected.y>0.0);}
accumBuffer[oi]=vec4f(hitColor*outputHit,outputHit);accumCount[oi]=(gen<<16u) | 1u;accumDepth[oi]=select(1.0,outputDepth,outputHit>0.5);}}}
return;}
let ox=select(0u,u32(params.upsample.y),n>1u);let oy=select(0u,u32(params.upsample.z),n>1u);let outX=gid.x*n+ox;let outY=gid.y*n+oy;if (outX>=outRes.x || outY>=outRes.y) {return;}
let outIdx=outY*outRes.x+outX;let packed=accumCount[outIdx];let count=select(0u,packed & 0xFFFFu,(packed>>16u)==gen);let t=select(1.0/(f32(count)+1.0),1.0,count==0u);let prev=accumBuffer[outIdx];let newRgb=mix(prev.rgb,premult,t);let newCov=mix(prev.w,hit,t);accumBuffer[outIdx]=vec4f(newRgb,newCov);accumCount[outIdx]=(gen<<16u) | min(count+1u,u32(params.misc2.x));if (hit>0.5) {accumDepth[outIdx]=depth;} else if (count==0u) {accumDepth[outIdx]=1.0;}}
`;if(!i.ShadersStoreWGSL[je])i.ShadersStoreWGSL[je]=mt;var ds=[_e];for(let a of ds)if(!i.IncludesShadersStoreWGSL[a.name])i.IncludesShadersStoreWGSL[a.name]=a.shader;var WO={name:je,shader:mt};var Ve="gpsHiZBuildComputeShader",gt=`struct GpsHiZParams {src : vec4u,
dst : vec4u,};@group(0) @binding(0) var<storage,read_write> hiZ : array<f32>;@group(0) @binding(1) var<uniform> params : GpsHiZParams;@compute @workgroup_size(8,8,1)
fn main(@builtin(global_invocation_id) gid : vec3u) {let dstW=params.dst.y;let dstH=params.dst.z;if (gid.x>=dstW || gid.y>=dstH) {return;}
let srcW=params.src.y;let srcH=params.src.z;let sx=gid.x*2u;let sy=gid.y*2u;let sxEnd=select(min(sx+1u,srcW-1u),srcW-1u,gid.x==dstW-1u);let syEnd=select(min(sy+1u,srcH-1u),srcH-1u,gid.y==dstH-1u);let base=params.src.x;var m=0.0;for (var y=sy; y<=syEnd; y=y+1u) {let row=base+y*srcW;for (var x=sx; x<=sxEnd; x=x+1u) {m=max(m,hiZ[row+x]);}}
hiZ[params.dst.x+gid.y*dstW+gid.x]=m;}
`;if(!i.ShadersStoreWGSL[Ve])i.ShadersStoreWGSL[Ve]=gt;var HO={name:Ve,shader:gt};var Ce={name:"splat",extensions:{".splat":{isBinary:!0},".ply":{isBinary:!0},".spz":{isBinary:!0},".json":{isBinary:!1},".sog":{isBinary:!0}}};In();NR();var St=256,ps=512,ye=65535,_s=4294967295,xt=65536;function jh(a){let f=a.m;return f[2]!==0||f[6]!==0||f[3]!==0||f[7]!==0}function vp(a){if(a<1)return 0;return Math.ceil((a===1?3:a===2?8:a===3?15:24)*3/4)*4}class bp{_getMaxStorageBufferSize(){let f=this._engine.currentLimits;if(!f)return 134217728;return Math.min(f.maxStorageBufferBindingSize||134217728,f.maxBufferSize||134217728)}supportsWorkload(a,f,S,m){let y=this._getMaxStorageBufferSize(),b=Math.max(64,vp(f));return a*b<=y&&S*m*4*Float32Array.BYTES_PER_ELEMENT<=y}constructor(a){this._preprocessShDegree=-1,this._means=null,this._colorOpacity=null,this._cov3d=null,this._sh=null,this._shDegree=0,this._weights=null,this._gsData=null,this._cdf=null,this._blockSums=null,this._gaussianCount=0,this._numBlocks=0,this.pointScale=1,this.kernelSize=0.3,this.minPixelSize=0,this.rightHandedSystem=!1,this.debugActive=0,this.isOrthographic=!1,this.compensation=!1,this.occlusionCulling=!1,this._imageBuffer=null,this._accumBuffer=null,this._accumDepth=null,this._accumCount=null,this._hiZ=null,this._hiZLevels=[],this._hiZBuildParams=[],this._boundHiZParams=null,this._width=0,this._height=0,this._outWidth=0,this._outHeight=0,this._upsampleN=1,this._jitterX=0,this._jitterY=0,this._view=null,this._viewProjection=null,this._projection=null,this._inverseProjection=null,this._projectedDepth=!1,this._reverseDepth=!1,this._projectedDepthSpan=new Float32Array([0,1]),this._near=0.1,this._far=1000,this._focalX=1000,this._focalY=1000,this._camX=0,this._camY=0,this._camZ=0,this._viewZMin=0.1,this._viewZMax=1000,this._projZ=new Float32Array([0,1,0,0]),this._frameIndex=0,this._parts=null,this._partBuffers=[],this._partUseFrames=[],this._partSlot=0,this._partCount=0,this._prevPartData=new Float32Array(0),this._accumGeneration=0,this._lastRenderedGeneration=-1,this._prevVp=new Float32Array(16),this._hasPrevVp=!1,this.maxAccumFrames=255,this._engine=a,this._preprocessBindings={means:{group:0,binding:0},colorOpacity:{group:0,binding:1},weights:{group:0,binding:2},gsData:{group:0,binding:3},uniforms:{group:0,binding:4},cov3d:{group:0,binding:5},sh:{group:0,binding:6},parts:{group:0,binding:7},hiZ:{group:0,binding:8}},this._scanBlocksCs=new _r("gpsScanBlocks",a,"gpsScanBlocks",{bindingsMapping:{weights:{group:0,binding:0},cdf:{group:0,binding:1},blockSums:{group:0,binding:2}}}),this._scanSumsCs=new _r("gpsScanSums",a,"gpsScanSums",{bindingsMapping:{blockSums:{group:0,binding:0},pointCount:{group:0,binding:1},indirectArgs:{group:0,binding:2}}}),this._scanAddCs=new _r("gpsScanAdd",a,"gpsScanAdd",{bindingsMapping:{cdf:{group:0,binding:0},blockSums:{group:0,binding:1}}}),this._partitionCs=new _r("gpsPartition",a,"gpsPartition",{bindingsMapping:{cdf:{group:0,binding:0},pointCount:{group:0,binding:1},partTable:{group:0,binding:2}}}),this._hiZBuildCs=new _r("gpsHiZBuild",a,"gpsHiZBuild",{bindingsMapping:{hiZ:{group:0,binding:0},params:{group:0,binding:1}}});let f={cdf:{group:0,binding:0},gsData:{group:0,binding:1},imageBuffer:{group:0,binding:2},uniforms:{group:0,binding:3},pointCount:{group:0,binding:4},partTable:{group:0,binding:5}};this._splatCs=new _r("gpsSplat",a,"gpsSplat",{bindingsMapping:f});let S={accumBuffer:{group:0,binding:0},params:{group:0,binding:1},imageBuffer:{group:0,binding:2},accumDepth:{group:0,binding:3},hiZ:{group:0,binding:4},accumCount:{group:0,binding:5}};this._resolveCs=new _r("gpsResolve",a,"gpsResolve",{bindingsMapping:S}),this._uniforms=new X(a),this._uniforms.addUniform("view",16),this._uniforms.addUniform("viewProjection",16),this._uniforms.addUniform("resNearFar",4),this._uniforms.addUniform("params0",4),this._uniforms.addUniform("focal",4),this._uniforms.addUniform("camPosDeg",4),this._uniforms.addUniform("depthNorm",4),this._uniforms.addUniform("hiZInfo",4),this._uniforms.addUniform("misc",4),this._uniforms.addUniform("pixelMap",4),this._uniforms.addUniform("projection",16),this._uniforms.addUniform("inverseProjection",16),this._uniforms.addUniform("projectedDepth",4),this._resolveParams=new X(a),this._resolveParams.addUniform("resolution",2),this._resolveParams.addUniform("outResolution",2),this._resolveParams.addUniform("depthNorm",2),this._resolveParams.addUniform("colorMask",2),this._resolveParams.addUniform("upsample",4),this._resolveParams.addUniform("misc2",4),this._resolveParams.addUniform("projZ",4),this._resolveParams.addUniform("inverseProjection",16),this._resolveParams.addUniform("occlusion",4),this._pointCount=new Ei(a,4*Uint32Array.BYTES_PER_ELEMENT),this._indirectArgs=new Ei(a,3*Uint32Array.BYTES_PER_ELEMENT,98),this._partition=new Ei(a,(xt+1)*Uint32Array.BYTES_PER_ELEMENT),this._createPreprocessCs(0),this._splatCs.setUniformBuffer("uniforms",this._uniforms),this._resolveCs.setUniformBuffer("params",this._resolveParams),this._scanSumsCs.setStorageBuffer("pointCount",this._pointCount),this._scanSumsCs.setStorageBuffer("indirectArgs",this._indirectArgs),this._partitionCs.setStorageBuffer("pointCount",this._pointCount),this._partitionCs.setStorageBuffer("partTable",this._partition),this._splatCs.setStorageBuffer("pointCount",this._pointCount),this._splatCs.setStorageBuffer("partTable",this._partition)}_createPreprocessCs(a){this._preprocessShDegree=a;let f={...this._preprocessBindings};if(a<=0)delete f.sh;if(this._preprocessCs=new _r("gpsPreprocess",this._engine,"gpsPreprocess",{bindingsMapping:f,defines:["#define SH_DEGREE "+a]}),this._preprocessCs.setUniformBuffer("uniforms",this._uniforms),this._parts)this._preprocessCs.setStorageBuffer("parts",this._parts);if(this._hiZ)this._preprocessCs.setStorageBuffer("hiZ",this._hiZ)}get accumBuffer(){return this._accumBuffer}get accumDepthBuffer(){return this._accumDepth}get renderedFrameCount(){return this._frameIndex}get accumulationVersion(){return this._accumGeneration}get pixelCycleLength(){return this._upsampleN*this._upsampleN}async readPointCountAsync(){let a=await this._pointCount.read(0,Uint32Array.BYTES_PER_ELEMENT);return new Uint32Array(a.buffer,a.byteOffset,1)[0]}get width(){return this._width}get height(){return this._height}get outputWidth(){return this._outWidth}get outputHeight(){return this._outHeight}get gaussianCount(){return this._gaussianCount}isReady(){return this._preprocessCs.isReady()&&this._scanBlocksCs.isReady()&&this._scanSumsCs.isReady()&&this._scanAddCs.isReady()&&this._partitionCs.isReady()&&this._splatCs.isReady()&&this._resolveCs.isReady()&&(!this.occlusionCulling||this._hiZBuildCs.isReady())}updateSplats(a,f,S,m,y,b){if(this._disposeGaussianBuffers(),this._gaussianCount=b,this._shDegree=m?y:0,this._shDegree!==this._preprocessShDegree)this._createPreprocessCs(this._shDegree);if(b===0)return;this._numBlocks=Math.ceil(b/ps);let M=this._engine;if(this._means=new Ei(M,b*4*Float32Array.BYTES_PER_ELEMENT),this._means.update(a),this._cov3d=new Ei(M,b*4*Uint32Array.BYTES_PER_ELEMENT),this._cov3d.update(f),m&&this._shDegree>0)this._sh=new Ei(M,m.byteLength),this._sh.update(m);else this._sh=new Ei(M,Float32Array.BYTES_PER_ELEMENT);if(this._colorOpacity=new Ei(M,b*Uint32Array.BYTES_PER_ELEMENT),this._colorOpacity.update(S),this._weights=new Ei(M,b*Uint32Array.BYTES_PER_ELEMENT),this._cdf=new Ei(M,b*Uint32Array.BYTES_PER_ELEMENT),this._blockSums=new Ei(M,this._numBlocks*Uint32Array.BYTES_PER_ELEMENT),this._gsData=new Ei(M,b*64),this._preprocessCs.setStorageBuffer("means",this._means),this._preprocessCs.setStorageBuffer("colorOpacity",this._colorOpacity),this._preprocessCs.setStorageBuffer("weights",this._weights),this._preprocessCs.setStorageBuffer("gsData",this._gsData),this._preprocessCs.setStorageBuffer("cov3d",this._cov3d),this._shDegree>0)this._preprocessCs.setStorageBuffer("sh",this._sh);this._scanBlocksCs.setStorageBuffer("weights",this._weights),this._scanBlocksCs.setStorageBuffer("cdf",this._cdf),this._scanBlocksCs.setStorageBuffer("blockSums",this._blockSums),this._scanSumsCs.setStorageBuffer("blockSums",this._blockSums),this._scanAddCs.setStorageBuffer("cdf",this._cdf),this._scanAddCs.setStorageBuffer("blockSums",this._blockSums),this._partitionCs.setStorageBuffer("cdf",this._cdf),this._splatCs.setStorageBuffer("cdf",this._cdf),this._splatCs.setStorageBuffer("gsData",this._gsData),this.resetAccumulation()}resetAccumulation(){this._accumGeneration=this._accumGeneration+1&65535}setCamera(a,f,S,m,y,b,M,P,D,R,B){this._view=a,this._viewProjection=f,this._near=S,this._far=m,this._focalX=y,this._focalY=b,this._camX=M,this._camY=P,this._camZ=D,this._viewZMin=R,this._viewZMax=B}setProjectionZ(a,f,S,m){this._projZ[0]=a,this._projZ[1]=f,this._projZ[2]=S,this._projZ[3]=m,this._projection=null,this._inverseProjection=null,this._projectedDepth=!1}setProjectionMatrix(a,f,S=!1){let m=a.m;this.setProjectionZ(m[10],m[11],m[14],m[15]),this._projection=a,this._inverseProjection=f,this._projectedDepth=jh(a),this._reverseDepth=S}_getProjectedDepthSpan(a=1,f=1){let S=this._inverseProjection.m,m=this.rightHandedSystem?-1:1,y=m*this._viewZMin,b=m*this._viewZMax,M=S[10]-y*S[11],P=S[10]-b*S[11];if(M*P<=0)return this._projectedDepthSpan[0]=0,this._projectedDepthSpan[1]=1,this._projectedDepthSpan;let D=1,R=0;for(let B=0;B<8;B++){let O=B&1?a:-1,T=B&2?f:-1,A=B&4?b:y,z=(A*(S[3]*O+S[7]*T+S[15])-(S[2]*O+S[6]*T+S[14]))/(S[10]-A*S[11]),V=Math.max(0,Math.min(1,this._reverseDepth?1-z:z));D=Math.min(D,V),R=Math.max(R,V)}return this._projectedDepthSpan[0]=D,this._projectedDepthSpan[1]=Math.max(D+0.000001,R),this._projectedDepthSpan}_matchesPartData(a,f){let S=f*40;if(!this._parts||this._partCount!==f||this._prevPartData.length!==S)return!1;for(let m=0;m<S;m++)if(this._prevPartData[m]!==a[m])return!1;return!0}setPartData(a,f){let S=this._engine,m=f*40,y=!this._matchesPartData(a,f);if(this._partCount!==f)this._disposePartBuffers(),this._partCount=f;let b=S.frameId;if(!y){if(this._parts)this._partUseFrames[this._partSlot]=b;return}if(this._prevPartData.length!==m)this._prevPartData=new Float32Array(m);if(this._prevPartData.set(a),this.resetAccumulation(),!this._parts||this._partUseFrames[this._partSlot]===b){let M=0;while(M<this._partBuffers.length&&this._partUseFrames[M]===b)M++;if(M===this._partBuffers.length)this._partBuffers.push(new Ei(S,m*Float32Array.BYTES_PER_ELEMENT)),this._partUseFrames.push(-1);this._partSlot=M,this._parts=this._partBuffers[M],this._preprocessCs.setStorageBuffer("parts",this._parts)}this._partUseFrames[this._partSlot]=b,this._parts.update(a)}_disposePartBuffers(){for(let a of this._partBuffers)a.dispose();this._partBuffers.length=0,this._partUseFrames.length=0,this._partSlot=0,this._parts=null}_ensurePixelBuffers(a,f,S,m){let y=this._engine,b=a!==this._width||f!==this._height||!this._imageBuffer,M=S!==this._outWidth||m!==this._outHeight||!this._accumBuffer;if(b){this._width=a,this._height=f;let P=a*f;this._imageBuffer?.dispose(),this._imageBuffer=new Ei(y,P*Uint32Array.BYTES_PER_ELEMENT);let D=new Uint32Array(P);D.fill(_s),this._imageBuffer.update(D),this._splatCs.setStorageBuffer("imageBuffer",this._imageBuffer),this._resolveCs.setStorageBuffer("imageBuffer",this._imageBuffer)}if(!this._hiZ||this.occlusionCulling!==this._hiZLevels.length>0||this.occlusionCulling&&b){this._hiZLevels=[];let P=1;if(this.occlusionCulling){P=0;let D=Math.floor(Math.log2(Math.max(a,f)))+1;for(let R=0;R<D;R++){let B=Math.max(1,a>>R),O=Math.max(1,f>>R);this._hiZLevels.push({offset:P,w:B,h:O}),P+=B*O}}this._hiZ?.dispose(),this._hiZ=new Ei(y,P*Float32Array.BYTES_PER_ELEMENT),this._hiZ.update(new Float32Array(P).fill(1000000000000000000000000000000)),this._preprocessCs.setStorageBuffer("hiZ",this._hiZ),this._resolveCs.setStorageBuffer("hiZ",this._hiZ),this._hiZBuildCs.setStorageBuffer("hiZ",this._hiZ);for(let D of this._hiZBuildParams)D.dispose();this._hiZBuildParams=[],this._boundHiZParams=null;for(let D=1;D<this._hiZLevels.length;D++){let R=this._hiZLevels[D-1],B=this._hiZLevels[D],O=new X(y);O.addUniform("src",4),O.addUniform("dst",4),O.updateUInt4("src",R.offset,R.w,R.h,0),O.updateUInt4("dst",B.offset,B.w,B.h,0),O.update(),this._hiZBuildParams.push(O)}}if(M){this._outWidth=S,this._outHeight=m;let P=S*m;this._accumBuffer?.dispose(),this._accumBuffer=new Ei(y,P*4*Float32Array.BYTES_PER_ELEMENT),this._accumDepth?.dispose(),this._accumDepth=new Ei(y,P*Float32Array.BYTES_PER_ELEMENT),this._accumCount?.dispose(),this._accumCount=new Ei(y,P*Uint32Array.BYTES_PER_ELEMENT),this._resolveCs.setStorageBuffer("accumBuffer",this._accumBuffer),this._resolveCs.setStorageBuffer("accumDepth",this._accumDepth),this._resolveCs.setStorageBuffer("accumCount",this._accumCount),this.resetAccumulation()}}renderToBuffer(a,f,S=a,m=f,y=1,b=0,M=0){if(a<=0||f<=0||S<=0||m<=0)return!1;if(this._upsampleN=Math.max(1,Math.round(y)),this._jitterX=b,this._jitterY=M,this._ensurePixelBuffers(a,f,S,m),this._gaussianCount===0||!this._parts||!this._view||!this._viewProjection||!this.isReady())return!1;let P=this._viewProjection.m,D=!this._hasPrevVp;for(let G=0;G<16;G++)if(Math.abs(P[G]-this._prevVp[G])>0.00001){D=!0;break}if(D)this.resetAccumulation(),this._prevVp.set(P),this._hasPrevVp=!0;let R=this._accumGeneration!==this._lastRenderedGeneration;this._lastRenderedGeneration=this._accumGeneration;let B=this._upsampleN,O=(B/2-this._jitterX-0.5)/B,T=(B/2-this._jitterY-0.5)/B,A=Math.imul(this._frameIndex+1,2654435761)>>>16&65535,z=this._shDegree>0?8:1;this._uniforms.updateMatrix("view",this._view),this._uniforms.updateMatrix("viewProjection",this._viewProjection),this._uniforms.updateFloat4("resNearFar",a,f,this._near,this._far),this._uniforms.updateFloat4("params0",this._gaussianCount,this.kernelSize*0.25/(B*B),this.pointScale,this._frameIndex%65536),this._uniforms.updateFloat4("focal",this._focalX,this._focalY,this.rightHandedSystem?1:0,this.isOrthographic?1:0),this._uniforms.updateFloat4("camPosDeg",this._camX,this._camY,this._camZ,this._shDegree),this._uniforms.updateFloat4("depthNorm",this._viewZMin,this._viewZMax,this.debugActive,this.compensation?1:0),this._uniforms.updateFloat4("hiZInfo",a,f,this._hiZLevels.length,this.occlusionCulling&&!R?1:0);let V=(this._projection?1:0)|(this._projectedDepth?2:0)|(this._reverseDepth?4:0),j=this._projectedDepth?this._getProjectedDepthSpan(Math.max(1,2*a*B/this._outWidth-1),Math.max(1,2*f*B/this._outHeight-1)):null;if(this._uniforms.updateFloat4("misc",B,this.minPixelSize,A,V),this._uniforms.updateFloat4("pixelMap",this._outWidth/B,this._outHeight/B,O,T),this._projection&&this._inverseProjection)this._uniforms.updateMatrix("projection",this._projection),this._uniforms.updateMatrix("inverseProjection",this._inverseProjection);this._uniforms.updateFloat4("projectedDepth",j?.[0]??0,j?.[1]??1,z,0),this._uniforms.update(),this._resolveParams.updateFloat2("resolution",a,f),this._resolveParams.updateFloat2("outResolution",this._outWidth,this._outHeight),this._resolveParams.updateFloat2("depthNorm",j?.[0]??this._viewZMin,j?.[1]??this._viewZMax),this._resolveParams.updateFloat2("colorMask",A,z),this._resolveParams.updateFloat4("upsample",B,this._jitterX,this._jitterY,this._accumGeneration),this._resolveParams.updateFloat4("misc2",Math.max(1,Math.min(65535,Math.floor(this.maxAccumFrames))),R?1:0,this._reverseDepth?1:0,this._projectedDepth?1:0);let E=this.rightHandedSystem?-1:1;if(this._resolveParams.updateFloat4("projZ",this._projZ[0]*E,this._projZ[1]*E,this._projZ[2],this._projZ[3]),this._inverseProjection)this._resolveParams.updateMatrix("inverseProjection",this._inverseProjection);this._resolveParams.updateFloat4("occlusion",this.occlusionCulling?1:0,0,0,0),this._resolveParams.update();let q=Math.ceil(this._gaussianCount/St);if(this._partUseFrames[this._partSlot]=this._engine.frameId,this._preprocessCs.dispatch(Math.min(q,ye),Math.ceil(q/ye),1),this._scanBlocksCs.dispatch(Math.min(this._numBlocks,ye),Math.ceil(this._numBlocks/ye),1),this._scanSumsCs.dispatch(1,1,1),this._scanAddCs.dispatch(Math.min(q,ye),Math.ceil(q/ye),1),this._partitionCs.dispatch(Math.ceil((xt+1)/St),1,1),this._splatCs.dispatchIndirect(this._indirectArgs),this._resolveCs.dispatch(Math.ceil(a/8),Math.ceil(f/8),1),this.occlusionCulling)for(let G=1;G<this._hiZLevels.length;G++){let Y=this._hiZLevels[G],W=this._hiZBuildParams[G-1];if(W!==this._boundHiZParams)this._hiZBuildCs.setUniformBuffer("params",W),this._boundHiZParams=W;this._hiZBuildCs.dispatch(Math.ceil(Y.w/8),Math.ceil(Y.h/8),1)}return this._frameIndex++,!0}_disposeGaussianBuffers(){this._means?.dispose(),this._colorOpacity?.dispose(),this._cov3d?.dispose(),this._sh?.dispose(),this._weights?.dispose(),this._gsData?.dispose(),this._cdf?.dispose(),this._blockSums?.dispose(),this._means=null,this._colorOpacity=null,this._cov3d=null,this._sh=null,this._weights=null,this._gsData=null,this._cdf=null,this._blockSums=null,this._gaussianCount=0,this._numBlocks=0}dispose(){this._disposeGaussianBuffers(),this._imageBuffer?.dispose(),this._accumBuffer?.dispose(),this._accumDepth?.dispose(),this._accumCount?.dispose(),this._accumDepth=null,this._imageBuffer=null,this._accumBuffer=null,this._accumCount=null,this._hiZ?.dispose(),this._hiZ=null,this._hiZLevels=[];for(let a of this._hiZBuildParams)a.dispose();this._hiZBuildParams=[],this._boundHiZParams=null,this._disposePartBuffers(),this._partCount=0,this._pointCount.dispose(),this._indirectArgs.dispose(),this._partition.dispose(),this._uniforms.dispose(),this._resolveParams.dispose(),this._width=0,this._height=0,this._outWidth=0,this._outHeight=0}}class gp extends de{constructor(a,f){super(a,f,{vertex:"gaussianPointSplattingBlit",fragment:"gaussianPointSplattingBlit"},{attributes:["position"],uniforms:["resolution","projZ","inverseProjection","useInverseProjection","logarithmicDepthConstant"],storageBuffers:["accumBuffer","accumDepth"],shaderLanguage:1,needAlphaBlending:!0});this._resolution=new _,this._projZ=new I,this.backFaceCulling=!1,this.alphaMode=7,this.setFloat("logarithmicDepthConstant",0),this.setFloat("useInverseProjection",0)}setAccumBuffer(a){this.setStorageBuffer("accumBuffer",a)}setAccumDepthBuffer(a){this.setStorageBuffer("accumDepth",a)}setResolution(a,f){this.setVector2("resolution",this._resolution.set(a,f))}setProjectionZ(a,f,S,m){this.setVector4("projZ",this._projZ.set(a,f,S,m)),this.setFloat("useInverseProjection",0)}setInverseProjection(a){this.setMatrix("inverseProjection",a),this.setFloat("useInverseProjection",1)}setLogarithmicDepthConstant(a){this.setFloat("logarithmicDepthConstant",a)}}class xp extends de{constructor(a,f){super(a,f,{vertex:"gaussianPointSplattingBlit",fragment:"gaussianPointSplattingDepthBlit"},{attributes:["position"],uniforms:["resolution","depthValues","projZ","inverseProjection","useInverseProjection","reverseDepth"],storageBuffers:["accumBuffer","accumDepth"],shaderLanguage:1,needAlphaBlending:!1});this._resolution=new _,this._projZ=new I,this._depthValues=new _,this.backFaceCulling=!1,this.alphaMode=0,this.forceDepthWrite=!0,this.setFloat("useInverseProjection",0)}setAccumBuffer(a){this.setStorageBuffer("accumBuffer",a)}setAccumDepthBuffer(a){this.setStorageBuffer("accumDepth",a)}setResolution(a,f){this.setVector2("resolution",this._resolution.set(a,f))}setProjectionZ(a,f,S,m){this.setVector4("projZ",this._projZ.set(a,f,S,m)),this.setFloat("useInverseProjection",0)}setInverseProjection(a){this.setMatrix("inverseProjection",a),this.setFloat("useInverseProjection",1)}setDepthValues(a,f){this.setVector2("depthValues",this._depthValues.set(a,f))}setReverseDepth(a){this.setFloat("reverseDepth",a?1:0)}}class bt extends he{constructor(){super(...arguments);this.GS_DBG_ENABLED=!1,this.GS_DBG_CLIP=0,this.GS_DBG_CULL_OPACITY=0,this.GS_DBG_CULL_SIZE=0,this.GS_DBG_OPACITY_SCALE=0,this.GS_DBG_OPACITY_SATURATE=0,this.GS_DBG_SH_DC=1,this.GS_DBG_SH_ORDER1=1,this.GS_DBG_SH_ORDER2=1,this.GS_DBG_SH_ORDER3=1,this.GS_DBG_SH_ORDER4=1}}var Ze=10;class Aa extends qe{constructor(a){super(a,"GaussianSplattingDebug",200,new bt,!0,!0);this._clippingBox=null,this._opacityCulling=null,this._sizeCulling=null,this._opacityScale=1,this._opacitySaturate=!1,this._shDc=!0,this._shOrder1=!0,this._shOrder2=!0,this._shOrder3=!0,this._shOrder4=!0,this._partCount=0,this._partClippingBoxes=[],this._partOpacityCullings=[],this._partSizeCullings=[],this._partOpacityScales=[],this._partOpacitySaturates=[],this._partShDcs=[],this._partShOrder1s=[],this._partShOrder2s=[],this._partShOrder3s=[],this._partShOrder4s=[],this._dbgPartDataTexture=null,this._textureDirty=!1,this._maxPartCount=0,this._resolvedPartData=null,this._mutableValuesSnapshot=null,this._partArrays=[this._partClippingBoxes,this._partOpacityCullings,this._partSizeCullings,this._partOpacityScales,this._partOpacitySaturates,this._partShDcs,this._partShOrder1s,this._partShOrder2s,this._partShOrder3s,this._partShOrder4s]}get isDebugActive(){return this._isAnyFeatureActive()}getResolvedPartData(a,f){if(!this._maxPartCount)this._maxPartCount=Vn(f);let S=this._refreshMutableValuesSnapshot(a);if(!this._resolvedPartData||this._resolvedPartData.partCount!==a||S)this._resolvedPartData={partCount:a,data:this._buildTextureData(a),maxPartCount:this._maxPartCount};return this._resolvedPartData}_refreshMutableValuesSnapshot(a){let f=a+1,S=this._mutableValuesSnapshot,m=!1;if(!S||S.length!==f*Ze)S=new Float64Array(f*Ze),this._mutableValuesSnapshot=S,m=!0;for(let y=0;y<f;y++){let b=y*Ze,M=y<a?this._partClippingBoxes[y]??this._clippingBox:this._clippingBox;if(this._diffMutableValue(S,b,M?M.min.x:0))m=!0;if(this._diffMutableValue(S,b+1,M?M.min.y:0))m=!0;if(this._diffMutableValue(S,b+2,M?M.min.z:0))m=!0;if(this._diffMutableValue(S,b+3,M?M.max.x:0))m=!0;if(this._diffMutableValue(S,b+4,M?M.max.y:0))m=!0;if(this._diffMutableValue(S,b+5,M?M.max.z:0))m=!0;let P=y<a?this._partOpacityCullings[y]??this._opacityCulling:this._opacityCulling;if(this._diffMutableValue(S,b+6,P?P.min:0))m=!0;if(this._diffMutableValue(S,b+7,P?P.max:0))m=!0;let D=y<a?this._partSizeCullings[y]??this._sizeCulling:this._sizeCulling;if(this._diffMutableValue(S,b+8,D?D.min:0))m=!0;if(this._diffMutableValue(S,b+9,D?D.max:0))m=!0}return m}_diffMutableValue(a,f,S){if(a[f]===S)return!1;return a[f]=S,!0}_isAnyFeatureActive(){return this._clippingBox!==null||this._opacityCulling!==null||this._sizeCulling!==null||this._opacityScale!==1||this._opacitySaturate||!this._shDc||!this._shOrder1||!this._shOrder2||!this._shOrder3||!this._shOrder4||this._partClippingBoxes.some((a)=>a!==null)||this._partOpacityCullings.some((a)=>a!==null)||this._partSizeCullings.some((a)=>a!==null)||this._partOpacityScales.some((a)=>a!==null)||this._partOpacitySaturates.some((a)=>a!==null)||this._partShDcs.some((a)=>a!==null)||this._partShOrder1s.some((a)=>a!==null)||this._partShOrder2s.some((a)=>a!==null)||this._partShOrder3s.some((a)=>a!==null)||this._partShOrder4s.some((a)=>a!==null)}_markDirty(){this.markAllDefinesAsDirty(),this._textureDirty=!0,this._resolvedPartData=null}get partCount(){return this._partCount}set partCount(a){if(this._partCount!==a)this._partCount=a,this._markDirty()}setPartOptions(a,f){if(this._partCount===0){c.Error("GaussianSplattingDebugMaterialPlugin.setPartOptions: called on a non-compound mesh. partCount is 0.");return}if(f.clippingBox!==void 0)this._partClippingBoxes[a]=f.clippingBox;if(f.opacityCulling!==void 0)this._partOpacityCullings[a]=f.opacityCulling;if(f.sizeCulling!==void 0)this._partSizeCullings[a]=f.sizeCulling;if(f.opacityScale!==void 0)this._partOpacityScales[a]=f.opacityScale;if(f.opacitySaturate!==void 0)this._partOpacitySaturates[a]=f.opacitySaturate;if(f.shDc!==void 0)this._partShDcs[a]=f.shDc;if(f.shOrder1!==void 0)this._partShOrder1s[a]=f.shOrder1;if(f.shOrder2!==void 0)this._partShOrder2s[a]=f.shOrder2;if(f.shOrder3!==void 0)this._partShOrder3s[a]=f.shOrder3;if(f.shOrder4!==void 0)this._partShOrder4s[a]=f.shOrder4;this._markDirty()}clearPartOptions(a){this._partClippingBoxes[a]=null,this._partOpacityCullings[a]=null,this._partSizeCullings[a]=null,this._partOpacityScales[a]=null,this._partOpacitySaturates[a]=null,this._partShDcs[a]=null,this._partShOrder1s[a]=null,this._partShOrder2s[a]=null,this._partShOrder3s[a]=null,this._partShOrder4s[a]=null,this._markDirty()}shiftPartOptions(a){for(let f of this._partArrays)if(a<f.length)f.splice(a,1);this._markDirty()}get clippingBox(){return this._clippingBox}set clippingBox(a){this._clippingBox=a,this._markDirty()}get opacityCulling(){return this._opacityCulling}set opacityCulling(a){this._opacityCulling=a,this._markDirty()}get sizeCulling(){return this._sizeCulling}set sizeCulling(a){this._sizeCulling=a,this._markDirty()}get opacityScale(){return this._opacityScale}set opacityScale(a){this._opacityScale=a,this._markDirty()}get opacitySaturate(){return this._opacitySaturate}set opacitySaturate(a){this._opacitySaturate=a,this._markDirty()}get shDc(){return this._shDc}set shDc(a){this._shDc=a,this._markDirty()}get shOrder1(){return this._shOrder1}set shOrder1(a){this._shOrder1=a,this._markDirty()}get shOrder2(){return this._shOrder2}set shOrder2(a){this._shOrder2=a,this._markDirty()}get shOrder3(){return this._shOrder3}set shOrder3(a){this._shOrder3=a,this._markDirty()}get shOrder4(){return this._shOrder4}set shOrder4(a){this._shOrder4=a,this._markDirty()}getSamplers(a){a.push("dbgPartData")}getClassName(){return"GaussianSplattingDebugMaterialPlugin"}isCompatible(a){switch(a){case 0:case 1:return!0;default:return!1}}isReadyForSubMesh(a,f,S,m){return!0}prepareDefines(a){a.GS_DBG_ENABLED=this._isAnyFeatureActive(),a.GS_DBG_CLIP=this._clippingBox!==null||this._partClippingBoxes.some((f)=>f!==null)?1:0,a.GS_DBG_CULL_OPACITY=this._opacityCulling!==null||this._partOpacityCullings.some((f)=>f!==null)?1:0,a.GS_DBG_CULL_SIZE=this._sizeCulling!==null||this._partSizeCullings.some((f)=>f!==null)?1:0,a.GS_DBG_OPACITY_SCALE=this._opacityScale!==1||this._partOpacityScales.some((f)=>f!==null)?1:0,a.GS_DBG_OPACITY_SATURATE=this._opacitySaturate||this._partOpacitySaturates.some((f)=>f!==null)?1:0,a.GS_DBG_SH_DC=!this._shDc||this._partShDcs.some((f)=>f!==null)?0:1,a.GS_DBG_SH_ORDER1=!this._shOrder1||this._partShOrder1s.some((f)=>f!==null)?0:1,a.GS_DBG_SH_ORDER2=!this._shOrder2||this._partShOrder2s.some((f)=>f!==null)?0:1,a.GS_DBG_SH_ORDER3=!this._shOrder3||this._partShOrder3s.some((f)=>f!==null)?0:1,a.GS_DBG_SH_ORDER4=!this._shOrder4||this._partShOrder4s.some((f)=>f!==null)?0:1}getCustomCode(a,f=0){if(f===1)return this._getCustomCodeWGSL(a);return this._getCustomCodeGLSL(a)}_getCustomCodeGLSL(a){if(a==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
uniform vec3 dbgClipMin;
uniform vec3 dbgClipMax;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
uniform float dbgMinOpacity;
uniform float dbgMaxOpacity;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
uniform float dbgMinSize;
uniform float dbgMaxSize;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
uniform float dbgOpacityScale;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
uniform sampler2D dbgPartData;
${ks(0)}
#endif
`,CUSTOM_VERTEX_UPDATE:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
    if (worldPos.x < dbgClipMin.x || worldPos.x > dbgClipMax.x ||
        worldPos.y < dbgClipMin.y || worldPos.y > dbgClipMax.y ||
        worldPos.z < dbgClipMin.z || worldPos.z > dbgClipMax.z) {
        scale = vec2(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
    if (splat.color.w < dbgMinOpacity || splat.color.w > dbgMaxOpacity) {
        scale = vec2(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
    {
        float _d0 = splat.covA.x; float _d1 = splat.covA.y; float _d2 = splat.covA.z;
        float _d3 = splat.covA.w; float _d4 = splat.covB.x; float _d5 = splat.covB.y;
        float _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
        float _sz = pow(abs(_det), 1.0/6.0);
        if (_sz < dbgMinSize || _sz > dbgMaxSize) {
            scale = vec2(0.0);
        }
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
    vColor.w *= dbgOpacityScale;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    {
        int _pIdx = int(splat.partIndex);
        vPartIndex = float(splat.partIndex);
        vec4 _row0 = texelFetch(dbgPartData, ivec2(_pIdx, 0), 0);
        vec4 _row1 = texelFetch(dbgPartData, ivec2(_pIdx, 1), 0);
        vec4 _row2 = texelFetch(dbgPartData, ivec2(_pIdx, 2), 0);
        vec3 _clipMin = _row0.xyz;
        vec3 _clipMax = vec3(_row0.w, _row1.xy);
        float _minOp = _row1.z;
        float _maxOp = _row1.w;
        float _minSz = _row2.x;
        float _maxSz = _row2.y;
        float _opSc  = _row2.z;
        #if GS_DBG_CLIP == 1
        if (worldPos.x < _clipMin.x || worldPos.x > _clipMax.x ||
            worldPos.y < _clipMin.y || worldPos.y > _clipMax.y ||
            worldPos.z < _clipMin.z || worldPos.z > _clipMax.z) {
            scale = vec2(0.0);
        }
        #endif
        #if GS_DBG_CULL_OPACITY == 1
        if (splat.color.w < _minOp || splat.color.w > _maxOp) {
            scale = vec2(0.0);
        }
        #endif
        #if GS_DBG_CULL_SIZE == 1
        {
            float _d0 = splat.covA.x; float _d1 = splat.covA.y; float _d2 = splat.covA.z;
            float _d3 = splat.covA.w; float _d4 = splat.covB.x; float _d5 = splat.covB.y;
            float _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
            float _sz = pow(abs(_det), 1.0/6.0);
            if (_sz < _minSz || _sz > _maxSz) {
                scale = vec2(0.0);
            }
        }
        #endif
        #if GS_DBG_OPACITY_SCALE == 1
        vColor.w *= _opSc;
        #endif
    }
#endif
`};else if(a==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
uniform sampler2D dbgPartData;
${ks(0)}
#endif
`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    if (texelFetch(dbgPartData, ivec2(int(vPartIndex + 0.5), 2), 0).w > 0.5) { finalColor.a = vColor.a; }
#elif defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SATURATE == 1
    finalColor.a = vColor.a;
#endif
`};return null}_getCustomCodeWGSL(a){if(a==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
uniform dbgClipMin: vec3f;
uniform dbgClipMax: vec3f;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
uniform dbgMinOpacity: f32;
uniform dbgMaxOpacity: f32;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
uniform dbgMinSize: f32;
uniform dbgMaxSize: f32;
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
uniform dbgOpacityScale: f32;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
var dbgPartData: texture_2d<f32>;
${ks(1)}
#endif
`,CUSTOM_VERTEX_UPDATE:`
#if defined(GS_DBG_ENABLED) && GS_DBG_CLIP == 1 && !defined(IS_COMPOUND)
    if (worldPos.x < uniforms.dbgClipMin.x || worldPos.x > uniforms.dbgClipMax.x ||
        worldPos.y < uniforms.dbgClipMin.y || worldPos.y > uniforms.dbgClipMax.y ||
        worldPos.z < uniforms.dbgClipMin.z || worldPos.z > uniforms.dbgClipMax.z) {
        scale = vec2f(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_OPACITY == 1 && !defined(IS_COMPOUND)
    if (splat.color.w < uniforms.dbgMinOpacity || splat.color.w > uniforms.dbgMaxOpacity) {
        scale = vec2f(0.0);
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_CULL_SIZE == 1 && !defined(IS_COMPOUND)
    {
        let _d0 = splat.covA.x; let _d1 = splat.covA.y; let _d2 = splat.covA.z;
        let _d3 = splat.covA.w; let _d4 = splat.covB.x; let _d5 = splat.covB.y;
        let _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
        let _sz = pow(abs(_det), 1.0/6.0);
        if (_sz < uniforms.dbgMinSize || _sz > uniforms.dbgMaxSize) {
            scale = vec2f(0.0);
        }
    }
#endif
#if defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SCALE == 1 && !defined(IS_COMPOUND)
    vertexOutputs.vColor.w *= uniforms.dbgOpacityScale;
#endif
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    {
        let _pIdx = i32(splat.partIndex);
        vertexOutputs.vPartIndex = f32(splat.partIndex);
        let _row0 = textureLoad(dbgPartData, vec2i(_pIdx, 0), 0);
        let _row1 = textureLoad(dbgPartData, vec2i(_pIdx, 1), 0);
        let _row2 = textureLoad(dbgPartData, vec2i(_pIdx, 2), 0);
        let _clipMin = _row0.xyz;
        let _clipMax = vec3f(_row0.w, _row1.xy);
        let _minOp = _row1.z;
        let _maxOp = _row1.w;
        let _minSz = _row2.x;
        let _maxSz = _row2.y;
        let _opSc  = _row2.z;
        #if GS_DBG_CLIP == 1
        if (worldPos.x < _clipMin.x || worldPos.x > _clipMax.x ||
            worldPos.y < _clipMin.y || worldPos.y > _clipMax.y ||
            worldPos.z < _clipMin.z || worldPos.z > _clipMax.z) {
            scale = vec2f(0.0);
        }
        #endif
        #if GS_DBG_CULL_OPACITY == 1
        if (splat.color.w < _minOp || splat.color.w > _maxOp) {
            scale = vec2f(0.0);
        }
        #endif
        #if GS_DBG_CULL_SIZE == 1
        {
            let _d0 = splat.covA.x; let _d1 = splat.covA.y; let _d2 = splat.covA.z;
            let _d3 = splat.covA.w; let _d4 = splat.covB.x; let _d5 = splat.covB.y;
            let _det = _d0*(_d3*_d5 - _d4*_d4) - _d1*(_d1*_d5 - _d4*_d2) + _d2*(_d1*_d4 - _d3*_d2);
            let _sz = pow(abs(_det), 1.0/6.0);
            if (_sz < _minSz || _sz > _maxSz) {
                scale = vec2f(0.0);
            }
        }
        #endif
        #if GS_DBG_OPACITY_SCALE == 1
        vertexOutputs.vColor.w *= _opSc;
        #endif
    }
#endif
`};else if(a==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
var dbgPartData: texture_2d<f32>;
${ks(1)}
#endif
`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
    if (textureLoad(dbgPartData, vec2i(i32(fragmentInputs.vPartIndex + 0.5), 2), 0).w > 0.5) {
        let _gsdbgA: f32 = -dot(fragmentInputs.vPosition, fragmentInputs.vPosition);
        if (_gsdbgA > -4.0) { finalColor.a = fragmentInputs.vColor.a; }
    }
#elif defined(GS_DBG_ENABLED) && GS_DBG_OPACITY_SATURATE == 1
    {
        let _gsdbgA: f32 = -dot(fragmentInputs.vPosition, fragmentInputs.vPosition);
        if (_gsdbgA > -4.0) {
            finalColor.a = fragmentInputs.vColor.a;
        }
    }
#endif
`};return null}getUniforms(){return{externalUniforms:["dbgClipMin","dbgClipMax","dbgMinOpacity","dbgMaxOpacity","dbgMinSize","dbgMaxSize","dbgOpacityScale"]}}_buildTextureData(a){let f=this._maxPartCount,S=new Float32Array(f*5*4);for(let m=0;m<f;m++){let y=m*4,b=(f+m)*4,M=(f*2+m)*4,P=(f*3+m)*4,D=(f*4+m)*4,R=m<a?this._partClippingBoxes[m]??this._clippingBox:this._clippingBox;if(R)S[y]=R.min.x,S[y+1]=R.min.y,S[y+2]=R.min.z,S[y+3]=R.max.x,S[b]=R.max.y,S[b+1]=R.max.z;else S[y]=-1e9,S[y+1]=-1e9,S[y+2]=-1e9,S[y+3]=1e9,S[b]=1e9,S[b+1]=1e9;let B=m<a?this._partOpacityCullings[m]??this._opacityCulling:this._opacityCulling;S[b+2]=B?B.min:0,S[b+3]=B?B.max:1;let O=m<a?this._partSizeCullings[m]??this._sizeCulling:this._sizeCulling;S[M]=O?O.min:0,S[M+1]=O?O.max:1e9,S[M+2]=m<a?this._partOpacityScales[m]??this._opacityScale:this._opacityScale;let T=m<a?this._partOpacitySaturates[m]??this._opacitySaturate:this._opacitySaturate;S[M+3]=T?1:0,S[P]=(m<a?this._partShDcs[m]??this._shDc:this._shDc)?1:0,S[P+1]=(m<a?this._partShOrder1s[m]??this._shOrder1:this._shOrder1)?1:0,S[P+2]=(m<a?this._partShOrder2s[m]??this._shOrder2:this._shOrder2)?1:0,S[P+3]=(m<a?this._partShOrder3s[m]??this._shOrder3:this._shOrder3)?1:0,S[D]=(m<a?this._partShOrder4s[m]??this._shOrder4:this._shOrder4)?1:0}return S}_updateOrCreateTexture(a){if(!this._maxPartCount)this._maxPartCount=Vn(a.getEngine());let f=this._buildTextureData(this._partCount);if(!this._dbgPartDataTexture)this._dbgPartDataTexture=ce.CreateRGBATexture(f,this._maxPartCount,5,a,!1,!1,1,1);else this._dbgPartDataTexture.update(f);this._textureDirty=!1}bindForSubMesh(a,f,S,m){let y=m.effect;if(!y)return;if(this._partCount>0&&this._isAnyFeatureActive()){if(this._textureDirty||!this._dbgPartDataTexture)this._updateOrCreateTexture(f);if(this._dbgPartDataTexture)y.setTexture("dbgPartData",this._dbgPartDataTexture)}else if(this._partCount===0){if(this._clippingBox)y.setVector3("dbgClipMin",this._clippingBox.min),y.setVector3("dbgClipMax",this._clippingBox.max);if(this._opacityCulling)y.setFloat("dbgMinOpacity",this._opacityCulling.min),y.setFloat("dbgMaxOpacity",this._opacityCulling.max);if(this._sizeCulling)y.setFloat("dbgMinSize",this._sizeCulling.min),y.setFloat("dbgMaxSize",this._sizeCulling.max);if(this._opacityScale!==1)y.setFloat("dbgOpacityScale",this._opacityScale)}}dispose(a){this._dbgPartDataTexture?.dispose(),this._dbgPartDataTexture=null}}var yt=!1;function gb(){if(yt)return;yt=!0,o("BABYLON.GaussianSplattingDebugMaterialPlugin",Aa)}var Hh=(()=>{var a;let f=qe,S=[],m;return a=class extends f{get isEnabled(){return this._isEnabled}set isEnabled(b){if(this._isEnabled===b)return;this._isEnabled=b,this._onIsEnabledChanged()}_onIsEnabledChanged(){}constructor(b,M,P){super(b,"GaussianSplatSolidColor",200);this._partColors=t(this,S),this._isEnabled=!0,this._partColorArray=[],this._partColors=M,this._maxPartCount=P??Vn(b.getScene().getEngine()),this._enable(!0)}updatePartColors(b){this._partColors=b}getClassName(){return"GaussianSplattingSolidColorMaterialPlugin"}isCompatible(b){switch(b){case 0:case 1:return!0;default:return!1}}isReadyForSubMesh(b,M,P,D){return!0}getCustomCode(b,M=0){let P=this._maxPartCount;if(M===1)return this._getCustomCodeWGSL(b,P);return this._getCustomCodeGLSL(b,P)}_getCustomCodeGLSL(b,M){if(b==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:ks(0),CUSTOM_VERTEX_UPDATE:`
#if IS_COMPOUND
    vPartIndex = float(splat.partIndex);
#else
    vPartIndex = 0.0;
#endif
                `};else if(b==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
${ks(0)}
uniform float solidColorEnabled;
uniform vec3 partColors[${M}];
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
if (solidColorEnabled > 0.5) {
    int partIdx = int(vPartIndex + 0.5);
    finalColor = vec4(partColors[partIdx], finalColor.w);
}
                `};return null}_getCustomCodeWGSL(b,M){if(b==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:ks(1),CUSTOM_VERTEX_UPDATE:`
#if IS_COMPOUND
    vertexOutputs.vPartIndex = f32(splat.partIndex);
#else
    vertexOutputs.vPartIndex = 0.0;
#endif
                `};else if(b==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:`
${ks(1)}
uniform solidColorEnabled: f32;
uniform partColors: array<vec3f, ${M}>;
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
if (uniforms.solidColorEnabled > 0.5) {
    var partIdx: i32 = i32(fragmentInputs.vPartIndex + 0.5);
    finalColor = vec4f(uniforms.partColors[partIdx], finalColor.w);
}
                `};return null}getUniforms(){return{externalUniforms:["partColors","solidColorEnabled"]}}bindForSubMesh(b,M,P,D){let R=D.effect;if(!R)return;R.setFloat("solidColorEnabled",this._isEnabled?1:0);let B=this._partColorArray;B.length=0;for(let O=0;O<this._maxPartCount;O++){let T=this._partColors[O];if(T)B.push(T.r,T.g,T.b);else B.push(0,0,0)}R.setArray3("partColors",B)}},(()=>{let y=typeof Symbol==="function"&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;if(m=[s()],r(a,null,m,{kind:"getter",name:"isEnabled",static:!1,private:!1,access:{has:(b)=>("isEnabled"in b),get:(b)=>b.isEnabled},metadata:y},null,S),y)Object.defineProperty(a,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:y})})(),a})();var vt=!1;function pb(){if(vt)return;vt=!0,o("BABYLON.GaussianSplattingSolidColorMaterialPlugin",Hh)}var Xh=(()=>{var a;let f=qe,S=[],m,y;return a=class extends f{get isEnabled(){return this._isEnabled}set isEnabled(M){this._isEnabled=M}get sizeScale(){return this._sizeScale}set sizeScale(M){if(!Number.isFinite(M)||M<=0)throw RangeError("sizeScale must be a positive finite number of pixels.");this._sizeScale=M}constructor(M){super(M,"GaussianSplattingSize",210);this._isEnabled=(t(this,S),!0),this._sizeScale=16,this._enable(!0)}getClassName(){return"GaussianSplattingSizeMaterialPlugin"}isCompatible(M){return M===0||M===1}getCustomCode(M,P=0){let D=P===1;if(M==="vertex")return{CUSTOM_VERTEX_DEFINITIONS:D?`varying vSplatSizeBrightness: f32;
uniform splatSizeScale: f32;`:`varying float vSplatSizeBrightness;
uniform float splatSizeScale;`,CUSTOM_VERTEX_UPDATE:D?"vertexOutputs.vSplatSizeBrightness = 0.0;":"vSplatSizeBrightness = 0.0;",CUSTOM_GAUSSIAN_SPLAT_PROJECTED_SIZE:D?"vertexOutputs.vSplatSizeBrightness = uniforms.splatSizeScale / (uniforms.splatSizeScale + 2.0 * max(length(majorAxis * scale), length(minorAxis * scale)));":"vSplatSizeBrightness = splatSizeScale / (splatSizeScale + 2.0 * max(length(majorAxis * scale), length(minorAxis * scale)));"};if(M==="fragment")return{CUSTOM_FRAGMENT_DEFINITIONS:D?`varying vSplatSizeBrightness: f32;
uniform splatSizeEnabled: f32;`:`varying float vSplatSizeBrightness;
uniform float splatSizeEnabled;`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:D?"if (uniforms.splatSizeEnabled > 0.5) { finalColor = vec4f(vec3f(fragmentInputs.vSplatSizeBrightness), finalColor.a); }":"if (splatSizeEnabled > 0.5) { finalColor = vec4(vec3(vSplatSizeBrightness), finalColor.a); }"};return null}getUniforms(){return{externalUniforms:["splatSizeScale","splatSizeEnabled"]}}bindForSubMesh(M,P,D,R){R.effect?.setFloat("splatSizeScale",this._sizeScale),R.effect?.setFloat("splatSizeEnabled",this._isEnabled?1:0)}},(()=>{let b=typeof Symbol==="function"&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;if(m=[s()],y=[s()],r(a,null,m,{kind:"getter",name:"isEnabled",static:!1,private:!1,access:{has:(M)=>("isEnabled"in M),get:(M)=>M.isEnabled},metadata:b},null,S),r(a,null,y,{kind:"getter",name:"sizeScale",static:!1,private:!1,access:{has:(M)=>("sizeScale"in M),get:(M)=>M.sizeScale},metadata:b},null,S),b)Object.defineProperty(a,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:b})})(),a})();var Mt=!1;function mb(){if(!Mt)Mt=!0,o("BABYLON.GaussianSplattingSizeMaterialPlugin",Xh)}var $h=(()=>{var a;let f=qe,S=[],m,y;return a=class extends f{get isEnabled(){return this._isEnabled}set isEnabled(M){if(M===this._isEnabled)return;if(this._isEnabled=M,M)this._originalAlphaMode=this._material.alphaMode,this._originalDisableDepthWrite=this._material.disableDepthWrite,this._originalForceDepthWrite=this._material.forceDepthWrite;this._applyBlendState()}get intensity(){return this._intensity}set intensity(M){if(!Number.isFinite(M)||M<=0)throw RangeError("intensity must be a positive finite number.");this._intensity=M}constructor(M){super(M,"GaussianSplattingOverdraw",220);this._isEnabled=(t(this,S),!0),this._intensity=0.00390625,this._originalAlphaMode=M.alphaMode,this._originalDisableDepthWrite=M.disableDepthWrite,this._originalForceDepthWrite=M.forceDepthWrite,this._applyBlendState(),this._enable(!0)}_applyBlendState(){if(this._isEnabled)this._material.alphaMode=6,this._material.disableDepthWrite=!0,this._material.forceDepthWrite=!1;else{if(this._material.alphaMode===6)this._material.alphaMode=this._originalAlphaMode;if(this._material.disableDepthWrite)this._material.disableDepthWrite=this._originalDisableDepthWrite;if(!this._material.forceDepthWrite)this._material.forceDepthWrite=this._originalForceDepthWrite}}getClassName(){return"GaussianSplattingOverdrawMaterialPlugin"}isCompatible(M){return M===0||M===1}getCustomCode(M,P=0){if(M!=="fragment")return null;let D=P===1;return{CUSTOM_FRAGMENT_DEFINITIONS:D?`uniform splatOverdrawEnabled: f32;
uniform splatOverdrawIntensity: f32;`:`uniform float splatOverdrawEnabled;
uniform float splatOverdrawIntensity;`,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:D?"if (uniforms.splatOverdrawEnabled > 0.5) { if (finalColor.a <= 0.0) { discard; } finalColor = vec4f(vec3f(uniforms.splatOverdrawIntensity), 1.0); }":"if (splatOverdrawEnabled > 0.5) { if (finalColor.a <= 0.0) discard; finalColor = vec4(vec3(splatOverdrawIntensity), 1.0); }"}}getUniforms(){return{externalUniforms:["splatOverdrawEnabled","splatOverdrawIntensity"]}}bindForSubMesh(M,P,D,R){R.effect?.setFloat("splatOverdrawEnabled",this._isEnabled?1:0),R.effect?.setFloat("splatOverdrawIntensity",this._intensity)}dispose(){this.isEnabled=!1}serialize(){return{...super.serialize(),originalAlphaMode:this._originalAlphaMode,originalDisableDepthWrite:this._originalDisableDepthWrite,originalForceDepthWrite:this._originalForceDepthWrite}}parse(M,P,D){if(super.parse(M,P,D),!this._isEnabled)return;this._originalAlphaMode=M.originalAlphaMode??this._originalAlphaMode,this._originalDisableDepthWrite=M.originalDisableDepthWrite??this._originalDisableDepthWrite,this._originalForceDepthWrite=M.originalForceDepthWrite??this._originalForceDepthWrite,this._applyBlendState()}copyTo(M){let P=M;if(super.copyTo(M),!P._isEnabled)return;P._originalAlphaMode=this._originalAlphaMode,P._originalDisableDepthWrite=this._originalDisableDepthWrite,P._originalForceDepthWrite=this._originalForceDepthWrite,P._applyBlendState()}},(()=>{let b=typeof Symbol==="function"&&Symbol.metadata?Object.create(f[Symbol.metadata]??null):void 0;if(m=[s()],y=[s()],r(a,null,m,{kind:"getter",name:"isEnabled",static:!1,private:!1,access:{has:(M)=>("isEnabled"in M),get:(M)=>M.isEnabled},metadata:b},null,S),r(a,null,y,{kind:"getter",name:"intensity",static:!1,private:!1,access:{has:(M)=>("intensity"in M),get:(M)=>M.intensity},metadata:b},null,S),b)Object.defineProperty(a,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:b})})(),a})();var wt=!1;function _b(){if(!wt)wt=!0,o("BABYLON.GaussianSplattingOverdrawMaterialPlugin",$h)}var we=32,Ye=!1,Xe=null,$e=!1;async function ms(){try{await Promise.all([(u("kwv8p9qv"),import("./gpsPreprocess.compute-kwv8p9qv.js")),(u("c6ctx7py"),import("./gpsScanBlocks.compute-c6ctx7py.js")),(u("nh12trtj"),import("./gpsScanSums.compute-nh12trtj.js")),(u("2zpvkcfc"),import("./gpsScanAdd.compute-2zpvkcfc.js")),(u("3vpnay9r"),import("./gpsPartition.compute-3vpnay9r.js")),(u("t9xxt10k"),import("./gpsSplat.compute-t9xxt10k.js")),(u("wwk5h0np"),import("./gpsResolve.compute-wwk5h0np.js")),(u("0wwkv8t4"),import("./gpsHiZBuild.compute-0wwkv8t4.js")),(u("2r8dtry8"),import("./gaussianPointSplattingBlit.vertex-2r8dtry8.js")),(u("zhpk2qae"),import("./gaussianPointSplattingBlit.fragment-zhpk2qae.js")),(u("nrq91eet"),import("./gaussianPointSplattingDepthBlit.fragment-nrq91eet.js"))]),Ye=!0}catch(a){$e=!0,Xe=null,c.Error(`GaussianSplattingMesh: failed to load point-splatting shaders: ${String(a)}`)}}function gs(){if(!Ye&&!Xe)$e=!1,Xe=ms()}var Pt=new Float32Array(1),Ss=new Uint32Array(Pt.buffer);function He(a,f){return(kt(a)|kt(f)<<16)>>>0}class Dt{constructor(a){this._colorMode=!1,this._depthMode=!1,this._projectionClipRange=new Float64Array(2),this._scale=1,this._renderScale="auto",this._occlusionCulling=!1,this._autoN=2,this._autoMeasuredGeneration=-1,this._lastRenderedGeneration=-1,this._autoRequestId=0,this._budgetReadPending=!1,this._resultReady=!1,this._colorHistoryReady=!1,this._colorUsesCameraTransform=!1,this._cameraFrameId=-1,this._cameraId=-1,this._progressReady=!1,this._computedWidth=0,this._computedHeight=0,this._progressFrameCount=0,this._progressGeneration=-1,this._progressCycleLength=0,this._streamingWarned=!1,this._sourceWarned=!1,this._workloadWarned=!1,this._invalidProjectionWarned=!1,this._renderer=null,this._blit=null,this._blitMesh=null,this._depthBlit=null,this._depthBlitMesh=null,this._computeObserver=null,this._cameraObserver=null,this._restoreObserver=null,this._splatCount=0,this._partCount=1,this._decodedPartCount=0,this._decodedRevision=-1,this._decodedShDegree=-1,this._partLocalMin=new Float32Array(3),this._partLocalMax=new Float32Array(3),this._partScratch=new Float32Array(40),this._decodedSplatsData=null,this._vpMatrix=new l,this._cameraVpMatrix=new l,this._inverseProjection=new l,this._outputSize={width:1,height:1},this._depthSpan=[0,0],this._mesh=a,this._scene=a.getScene()}get colorRenderMode(){return this._colorMode}set colorRenderMode(a){if(a===this._colorMode)return;if(a&&!this._scene.getEngine().isWebGPU){c.Warn("GaussianSplattingMesh: point-splatting render mode requires a WebGPU engine; ignoring.");return}if(this._colorMode=a,!a)this._colorHistoryReady=!1;if(a)this._ensureCompute(),this._enableColorBlit();else this._blitMesh?.setEnabled(!1),this._releaseComputeIfIdle()}get depthRenderMode(){return this._depthMode}set depthRenderMode(a){if(a===this._depthMode)return;if(a&&!this._scene.getEngine().isWebGPU){c.Warn("GaussianSplattingMesh: point-splatting depth render mode requires a WebGPU engine; ignoring.");return}if(this._depthMode=a,a)this._ensureCompute(),this._enableDepthBlit();else this._depthBlitMesh?.setEnabled(!1),this._releaseComputeIfIdle()}get progress(){if(!this._computeActive||!this._progressReady||!this._renderer)return null;return{renderedFrameCount:this._progressFrameCount,accumulationVersion:this._progressGeneration,pixelCycleLength:this._progressCycleLength}}get _computeActive(){return(this._colorMode||this._depthMode)&&!$e&&!this._mesh._pointStreamingUnsupported&&!this._hasUnsupportedSource}get _hasUnsupportedSource(){return this._mesh.useSog||!this._mesh._splatsData&&this._mesh.getTotalVertices()>0}get pointScale(){return this._scale}set pointScale(a){if(a===this._scale)return;if(this._scale=a,this._renderer)this._renderer.pointScale=a,this._renderer.resetAccumulation()}get occlusionCulling(){return this._occlusionCulling}set occlusionCulling(a){if(a===this._occlusionCulling)return;if(this._occlusionCulling=a,this._renderer)this._renderer.occlusionCulling=a,this._renderer.resetAccumulation()}_ensureCompute(){let a=this._scene.getEngine();if(gs(),!this._renderer)eu(),this._renderer=new bp(a),this._renderer.pointScale=this._scale,this._renderer.occlusionCulling=this._occlusionCulling,this._decodedSplatsData=null;if(!this._mesh._pointStreamingUnsupported&&!this._hasUnsupportedSource&&this._isWorkloadSupported())this._syncData();if(!this._computeObserver)this._computeObserver=this._scene.onBeforeRenderObservable.add(()=>{this._resultReady=!1});if(!this._cameraObserver)this._cameraObserver=this._scene.onBeforeCameraRenderObservable.add((f)=>{this._cameraFrameId=this._scene.getFrameId(),this._cameraId=f.uniqueId,this._cameraVpMatrix.copyFrom(this._scene.getTransformMatrix())});if(!this._restoreObserver)this._restoreObserver=a.onContextRestoredObservable.add(()=>{if(this._releaseComputeResources(),this._releaseBlitResources(),this._ensureCompute(),this._colorMode)this._enableColorBlit();if(this._depthMode)this._enableDepthBlit()})}_releaseComputeIfIdle(){if(this._colorMode||this._depthMode)return;if(this._computeObserver)this._scene.onBeforeRenderObservable.remove(this._computeObserver),this._computeObserver=null;if(this._cameraObserver)this._scene.onBeforeCameraRenderObservable.remove(this._cameraObserver),this._cameraObserver=null;if(this._restoreObserver)this._scene.getEngine().onContextRestoredObservable.remove(this._restoreObserver),this._restoreObserver=null;this._releaseComputeResources()}_releaseComputeResources(){this._autoRequestId++,this._renderer?.dispose(),this._renderer=null,this._decodedSplatsData=null,this._resultReady=!1,this._colorHistoryReady=!1,this._cameraFrameId=-1,this._progressReady=!1,this._budgetReadPending=!1,this._autoN=2,this._autoMeasuredGeneration=-1,this._lastRenderedGeneration=-1}_releaseBlitResources(){this._blit?.dispose(),this._blitMesh?.dispose(),this._depthBlit?.dispose(),this._depthBlitMesh?.dispose(),this._blit=null,this._blitMesh=null,this._depthBlit=null,this._depthBlitMesh=null}_createBlitMesh(a,f){let S=new p(a,this._scene),m=new w;return m.positions=[-1,-1,0,3,-1,0,-1,3,0],m.indices=[0,1,2],m.applyToMesh(S),S.material=f,S.doNotSerialize=!0,S.isPickable=!1,S.doNotSyncBoundingInfo=!0,S.setEnabled(!1),S.reservedDataStore={hidden:!0},S.computeWorldMatrix(!0),S}_enableColorBlit(){if(!this._blit)this._blit=new gp(this._mesh.name+"_blit",this._scene),this._blit.doNotSerialize=!0;if(!this._blitMesh)this._blitMesh=this._createBlitMesh(this._mesh.name+"_blitMesh",this._blit)}_enableDepthBlit(){if(!this._depthBlit)this._depthBlit=new xp(this._mesh.name+"_depthBlit",this._scene),this._depthBlit.doNotSerialize=!0;if(!this._depthBlitMesh)this._depthBlitMesh=this._createBlitMesh(this._mesh.name+"_depthBlitMesh",this._depthBlit)}_isWorkloadSupported(){let a=this._mesh._splatsData,f=a?a.byteLength/we|0:0,S=this._mesh._shData?.length?this._mesh._shDegree:0,{width:m,height:y}=this._getOutputSize();if(this._renderer.supportsWorkload(f,S,m,y))return!0;if(!this._workloadWarned)this._workloadWarned=!0,c.Warn(`GaussianSplattingMesh: point splatting needs storage buffers larger than this device allows (${f} splats at ${m}x${y}); falling back to the classic renderer.`);return!1}_syncData(){if(this._mesh._splatDataPending)return;let a=this._mesh._splatsData,f=a?a.byteLength/we|0:0,S=this._mesh.isCompound?this._mesh.partCount:1,m=this._mesh._splatDataRevision,y=this._mesh._shDegree;if(a===this._decodedSplatsData&&f===this._splatCount&&S===this._decodedPartCount&&m===this._decodedRevision&&y===this._decodedShDegree)return;if(this._decodedSplatsData=a,this._decodedPartCount=S,this._decodedRevision=m,this._decodedShDegree=y,!a||f===0){this._splatCount=0;return}this._decode(a)}_decode(a){let f=new Uint8Array(a),S=new Float32Array(a),m=f.length/we|0,y=this._mesh._getPointDecodeInputs(),b=y.positions,M=y.flipY?-1:1,P=this._mesh.isCompound?y.partIndices:null,D=this._mesh.isCompound?this._mesh.partCount:1;if(P){for(let W=0;W<m;W++)if(P[W]+1>D)D=P[W]+1}let R=new Float32Array(m*4),B=new Uint32Array(m*4),O=new Uint32Array(m),T=this._packSh(this._mesh._shData??void 0,this._mesh._shDegree,m),A=new d,z=new l,V=new l,j=new l,E=new Float32Array(D*3).fill(1/0),q=new Float32Array(D*3).fill(-1/0),G=y.activeRanges,Y=G?new Uint8Array(m):null;if(G&&Y)for(let W=0;W<G.length;W+=2)Y.fill(1,G[W],Math.min(m,G[W]+G[W+1]));for(let W=0;W<m;W++){let k=!Y||Y[W]!==0,H=b?b[4*W]:S[8*W],N=b?b[4*W+1]:S[8*W+1]*M,K=b?b[4*W+2]:S[8*W+2],se=we*W+28;A.set((f[se+1]-127.5)/127.5,(f[se+2]-127.5)/127.5,(f[se+3]-127.5)/127.5,-(f[se+0]-127.5)/127.5),A.normalize(),A.toRotationMatrix(z),l.ScalingToRef(S[8*W+3]*2,S[8*W+4]*2,S[8*W+5]*2,V),z.multiplyToRef(V,j);let U=j.m,J=P?P[W]:0;R[4*W+0]=H,R[4*W+1]=N,R[4*W+2]=K,R[4*W+3]=J;let ee=J*3;if(k&&H<E[ee])E[ee]=H;if(k&&N<E[ee+1])E[ee+1]=N;if(k&&K<E[ee+2])E[ee+2]=K;if(k&&H>q[ee])q[ee]=H;if(k&&N>q[ee+1])q[ee+1]=N;if(k&&K>q[ee+2])q[ee+2]=K;let Q=U[0]*U[0]+U[1]*U[1]+U[2]*U[2],te=U[0]*U[4]+U[1]*U[5]+U[2]*U[6],re=U[0]*U[8]+U[1]*U[9]+U[2]*U[10],ie=U[4]*U[4]+U[5]*U[5]+U[6]*U[6],ae=U[4]*U[8]+U[5]*U[9]+U[6]*U[10],oe=U[8]*U[8]+U[9]*U[9]+U[10]*U[10],le=Math.max(Math.abs(Q),Math.abs(te),Math.abs(re),Math.abs(ie),Math.abs(ae),Math.abs(oe));if(!(le>0))le=1;let ue=1/le;B[4*W+0]=He(Q*ue,te*ue),B[4*W+1]=He(re*ue,ie*ue),B[4*W+2]=He(ae*ue,oe*ue),Pt[0]=le,B[4*W+3]=Ss[0];let fe=we*W+24;O[W]=f[fe]|f[fe+1]<<8|f[fe+2]<<16|(k?f[fe+3]:0)<<24}if(this._splatCount=m,this._partCount=D,this._partLocalMin=E,this._partLocalMax=q,this._partScratch.length!==D*40)this._partScratch=new Float32Array(D*40);this._renderer.updateSplats(R,B,O,T,this._mesh._shDegree,m)}_packSh(a,f,S){if(!a||a.length===0||f<1)return null;let m=vp(f),y=(f===1?3:f===2?8:f===3?15:24)*3,b=new Uint8Array(S*m);for(let M=0;M<S;M++){let P=M*m;for(let D=0;D<y;D++){let R=a[D/16|0];b[P+D]=R[M*16+D%16]}}return new Uint32Array(b.buffer)}_uploadParts(){this._renderer.debugActive=this._packParts()?1:0,this._renderer.setPartData(this._partScratch,this._partCount)}_packParts(){let a=this._partCount;if(this._partScratch.length!==a*40)this._partScratch=new Float32Array(a*40);let f=this._partScratch,S=this._mesh.isCompound,m=this._mesh.computeWorldMatrix(!0);if(S)this._mesh._syncPartProxyWorldMatrices();let y=this._mesh.material?.alpha??1,b=this._mesh.material?.pluginManager?.getPlugin("GaussianSplattingDebug"),M=b?.constructor,P=b instanceof Aa&&M===Aa&&b.isDebugActive,D=null,R=0;if(b&&P){let B=b.getResolvedPartData(a,this._scene.getEngine());D=B.data,R=B.maxPartCount}for(let B=0;B<a;B++){let O=(S?this._mesh.getWorldMatrixForPart(B):m).m,T=S?this._mesh.getPartVisibility(B):this._mesh.visibility,A=B*40;if(f.set(O,A),f[A+16]=T*y,f[A+17]=0,f[A+18]=0,f[A+19]=0,D)for(let z=0;z<5;z++){let V=(R*z+B)*4,j=A+20+z*4;f[j]=D[V],f[j+1]=D[V+1],f[j+2]=D[V+2],f[j+3]=D[V+3]}else f[A+20]=-1e9,f[A+21]=-1e9,f[A+22]=-1e9,f[A+23]=1e9,f[A+24]=1e9,f[A+25]=1e9,f[A+26]=0,f[A+27]=1,f[A+28]=0,f[A+29]=1e9,f[A+30]=1,f[A+31]=0,f[A+32]=1,f[A+33]=1,f[A+34]=1,f[A+35]=1,f[A+36]=1,f[A+37]=0,f[A+38]=0,f[A+39]=0}return P}_depthInputsMatchColorHistory(){let a=this._renderer;if(!this._colorHistoryReady||!a)return!0;let f=this._mesh.material,S=this._colorUsesCameraTransform?this._getCameraTransform():this._vpMatrix;if(this._decodedSplatsData!==this._mesh._splatsData||this._decodedRevision!==this._mesh._splatDataRevision||this._decodedShDegree!==this._mesh._shDegree||!S?.equalsWithEpsilon(this._scene.getTransformMatrix(),0.00001)||a.kernelSize!==(f.kernelSize||ut.KernelSize)||a.minPixelSize!==f.minPixelSize||a.compensation!==f.compensation)return!1;let m=this._packParts()?1:0;return a.debugActive===m&&a._matchesPartData(this._partScratch,this._partCount)}_getCameraTransform(){if(this._cameraFrameId===this._scene.getFrameId())return this._cameraId===this._scene.activeCamera?.uniqueId?this._cameraVpMatrix:null;return this._scene.activeCamera?.getTransformationMatrix()??null}_getProjectionClipRange(a){let f=this._scene.getEngine(),S=a.m,m=f.useReverseDepthBuffer?1:f.isNDCHalfZRange?0:-1,y=f.useReverseDepthBuffer?f.isNDCHalfZRange?0:-1:1,b=this._scene.useRightHandedSystem?-1:1,M=b*(S[14]-m*S[15])/(m*S[11]-S[10]),P=y*S[11]-S[10],D=P===0?1/0:b*(S[14]-y*S[15])/P;if(!Number.isFinite(M)||!(D>M)||!(D>0))return null;return this._projectionClipRange[0]=M,this._projectionClipRange[1]=D===1/0?0:D,this._projectionClipRange}_viewZSpan(a,f,S,m=!0){let y=1/0,b=-1/0,M=this._partScratch;for(let R=0;R<this._partCount;R++){let B=R*40,O=R*3,T=this._partLocalMin[O];if(!isFinite(T))continue;let A=this._partLocalMin[O+1],z=this._partLocalMin[O+2],V=this._partLocalMax[O],j=this._partLocalMax[O+1],E=this._partLocalMax[O+2];for(let q=0;q<8;q++){let G=q&1?V:T,Y=q&2?j:A,W=q&4?E:z,k=M[B+0]*G+M[B+4]*Y+M[B+8]*W+M[B+12],H=M[B+1]*G+M[B+5]*Y+M[B+9]*W+M[B+13],N=M[B+2]*G+M[B+6]*Y+M[B+10]*W+M[B+14],K=a[2]*k+a[6]*H+a[10]*N+a[14],se=this._scene.useRightHandedSystem?-K:K;if(se<y)y=se;if(se>b)b=se}}let P=m?f:-1/0,D=m&&S>0?S:1/0;if(y=Math.max(P,y),b=Math.min(D,b),!isFinite(y)||b<y)this._depthSpan[0]=f,this._depthSpan[1]=S>f?S:f+1;else if(b===y){let R=Math.max(Math.abs(y)*0.001,0.0001);this._depthSpan[0]=Math.max(P,y-R),this._depthSpan[1]=b+R}else this._depthSpan[0]=y,this._depthSpan[1]=b;return this._depthSpan}_coprimeStride(a){if(a<=2)return 1;let f=Math.max(1,Math.round(a*0.6180339887)),S=f,m=a;while(m!==0){let y=S%m;S=m,m=y}while(S!==1){f++,S=f,m=a;while(m!==0){let y=S%m;S=m,m=y}}return f}_budget(){if(!this._scene.getEngine().hostInformation?.isMobile)return 15000000;if(typeof navigator<"u"&&navigator.userAgent&&/iPad|iPhone|iPod/.test(navigator.userAgent))return 9000000;return 6000000}_updateAutoScale(a,f,S){if(this._budgetReadPending||!this._renderer)return;this._budgetReadPending=!0,this._convergeAutoScaleAsync(a,f,S,this._autoRequestId)}async _convergeAutoScaleAsync(a,f,S,m){let y=this._renderer;if(!y)return;try{let b=await y.readPointCountAsync();if(y!==this._renderer||!this._computeActive||m!==this._autoRequestId||this._renderScale!=="auto")return;if(b>0){let M=b*a*a,P=Math.max(1,Math.min(8,Math.ceil(Math.sqrt(M/this._budget())))),D=!S||y.accumulationVersion!==f,R=P!==this._autoN;if(this._autoN=P,R)y.resetAccumulation();if(D)return;this._autoMeasuredGeneration=y.accumulationVersion}}catch(b){if(y===this._renderer&&this._computeActive)c.Error(`GaussianSplattingMesh: point-splatting budget readback failed: ${String(b)}`)}finally{if(y===this._renderer)this._budgetReadPending=!1}}_getOutputSize(a=!1){let f=this._scene.getEngine(),S=this._scene.activeCamera,m=this._scene.postProcessesEnabled?S?._getFirstPostProcess():null,y=S?.outputRenderTarget,b,M,P=this._depthMode&&!a?this._getCurrentDepthRenderer()?.getDepthMap():null;if(P)b=P.getRenderWidth(),M=P.getRenderHeight();else if(m&&m.width>0&&m.height>0)b=m.width,M=m.height;else if(y)b=y.getRenderWidth(),M=y.getRenderHeight();else b=f.getRenderWidth(!0),M=f.getRenderHeight(!0);return this._outputSize.width=Math.max(1,b),this._outputSize.height=Math.max(1,M),this._outputSize}_syncRenderInputs(){if(this._syncData(),this._splatCount===0)return;let a=this._mesh.material,f=a?.kernelSize||ut.KernelSize,S=a?a.minPixelSize:ut.MinPixelSize,m=a?.compensation??ut.Compensation,y=this._renderer;if(y.kernelSize!==f||y.minPixelSize!==S||y.compensation!==m)y.kernelSize=f,y.minPixelSize=S,y.compensation=m,y.resetAccumulation();this._uploadParts()}_runCompute(){if(this._resultReady=!1,this._progressReady=!1,(this._colorMode||this._depthMode)&&this._mesh._pointStreamingUnsupported&&!this._streamingWarned)this._streamingWarned=!0,c.Warn("GaussianSplattingMesh: point splatting does not support streamed parts (their splats are GPU-decoded and never reach the retained CPU splat data); falling back to the classic renderer.");if((this._colorMode||this._depthMode)&&this._hasUnsupportedSource&&!this._sourceWarned)this._sourceWarned=!0,c.Warn("GaussianSplattingMesh: point splatting requires retained CPU splat data; GPU-only SOG textures and streams use the classic renderer.");if(!this._computeActive||!this._mesh.isEnabled()||!this._renderer||!Ye||this._hasUnsupportedView())return;if(!this._isWorkloadSupported())return;if(this._syncRenderInputs(),this._splatCount===0)return;let a=this._scene.activeCamera,f=this._scene.getEngine(),{width:S,height:m}=this._getOutputSize(),y=this._renderScale,b=y==="auto"?this._autoN:Math.max(1,Math.min(8,Math.round(1/Math.max(y,0.001)))),M=Math.max(1,Math.ceil(S/b)),P=Math.max(1,Math.ceil(m/b)),D=b*b,R=this._renderer.renderedFrameCount%D*this._coprimeStride(D)%D,B=R%b,O=Math.floor(R/b),T=this._scene.getViewMatrix(),A=this._scene.getProjectionMatrix(),z=A.determinant();if(!Number.isFinite(z)||z===0){if(!this._invalidProjectionWarned)this._invalidProjectionWarned=!0,c.Error("GaussianSplattingMesh: the camera projection matrix is not finite and invertible; point splatting skips the mesh.");return}this._invalidProjectionWarned=!1,A.invertToRef(this._inverseProjection),this._vpMatrix.copyFrom(this._scene.getTransformMatrix());let V=S*A.m[0]/(2*b),j=m*A.m[5]/(2*b),E=a.globalPosition;this._renderer.rightHandedSystem=this._scene.useRightHandedSystem,this._renderer.isOrthographic=Math.abs(A.m[15]-1)<0.001;let q=this._mesh.material,G=jh(A),Y=G?null:this._getProjectionClipRange(A),W=Y?.[0]??a.minZ,k=Y?.[1]??(a.ignoreCameraMaxZ?0:a.maxZ),[H,N]=this._viewZSpan(T.m,W,k,!G);if(this._renderer.setCamera(T,this._vpMatrix,W,k,V,j,E.x,E.y,E.z,H,N),this._renderer.setProjectionMatrix(A,this._inverseProjection,f.useReverseDepthBuffer),!this._renderer.renderToBuffer(M,P,S,m,b,B,O))return;this._resultReady=!0,this._progressReady=!0,this._computedWidth=S,this._computedHeight=m,this._progressFrameCount=this._renderer.renderedFrameCount,this._progressGeneration=this._renderer.accumulationVersion,this._progressCycleLength=this._renderer.pixelCycleLength;let K=this._renderer.accumulationVersion,se=K!==this._lastRenderedGeneration;if(this._lastRenderedGeneration=K,y==="auto"&&this._autoMeasuredGeneration!==K)this._updateAutoScale(b,K,!se);let U=this._renderer.accumBuffer,J=this._renderer.accumDepthBuffer;if(U&&J){if(this._colorMode&&this._blit)this._blit.setAccumBuffer(U),this._blit.setAccumDepthBuffer(J),this._blit.setResolution(this._renderer.outputWidth,this._renderer.outputHeight),this._blit.setInverseProjection(this._inverseProjection),this._blit.setLogarithmicDepthConstant(q?.useLogarithmicDepth?2/(Math.log(a.maxZ+1)/Math.LN2):0);if(this._depthMode&&this._depthBlit){this._depthBlit.setAccumBuffer(U),this._depthBlit.setAccumDepthBuffer(J),this._depthBlit.setResolution(this._renderer.outputWidth,this._renderer.outputHeight),this._depthBlit.setInverseProjection(this._inverseProjection);let ee,Q;if(a.mode===1)ee=!f.useReverseDepthBuffer&&f.isNDCHalfZRange?0:1,Q=f.useReverseDepthBuffer&&f.isNDCHalfZRange?0:1;else ee=f.useReverseDepthBuffer&&f.isNDCHalfZRange?a.minZ:f.isNDCHalfZRange?0:a.minZ,Q=f.useReverseDepthBuffer&&f.isNDCHalfZRange?0:a.maxZ;this._depthBlit.setDepthValues(ee,ee+Q),this._depthBlit.setReverseDepth(f.useReverseDepthBuffer)}}}_hasUnsupportedView(){let a=this._scene,f=a.activeCamera;if(!f||a.floatingOriginMode)return!0;let S=f.getProjectionMatrix();if(!jh(S)&&!this._getProjectionClipRange(S))return!0;let m=this._mesh.material;return(a.activeCameras?.length??0)>1||f._rigCameras.length>0||!!(m?.clipPlane||m?.clipPlane2||m?.clipPlane3||m?.clipPlane4||m?.clipPlane5||m?.clipPlane6)||!!(a.clipPlane||a.clipPlane2||a.clipPlane3||a.clipPlane4||a.clipPlane5||a.clipPlane6)}_isMainColorPass(){let a=this._scene.getEngine(),f=this._scene.activeCamera,S=f?.outputRenderTarget?.renderPassId??f?.renderPassId??0;return a.currentRenderPassId===S&&!this._mesh.getMaterialForRenderPass(a.currentRenderPassId)}_getCurrentDepthRenderer(){let a=this._scene._depthRenderer,f=this._scene.activeCamera;if(!a||!f)return null;let S=a[f.uniqueId];if(!S||!S.enabled)return null;return S.getDepthMap().renderPassIds.indexOf(this._scene.getEngine().currentRenderPassId)!==-1?S:null}_isDepthPass(){return!!this._getCurrentDepthRenderer()}dispose(){if(this._computeObserver)this._scene.onBeforeRenderObservable.remove(this._computeObserver),this._computeObserver=null;if(this._cameraObserver)this._scene.onBeforeCameraRenderObservable.remove(this._cameraObserver),this._cameraObserver=null;if(this._restoreObserver)this._scene.getEngine().onContextRestoredObservable.remove(this._restoreObserver),this._restoreObserver=null;this._releaseComputeResources(),this._releaseBlitResources(),this._colorMode=!1,this._depthMode=!1}get renderScale(){return this._renderScale}set renderScale(a){if(a===this._renderScale)return;this._renderScale=a,this._autoRequestId++,this._autoMeasuredGeneration=-1,this._renderer?.resetAccumulation()}invalidateDecodedSplats(){this._decodedSplatsData=null,this._renderer?.resetAccumulation()}_supportsSourceMaterialPlugins(){let a=this._mesh.material?.pluginManager?._plugins;if(!a)return!0;for(let f of a){let S=f.constructor;if(S===Aa&&f instanceof Aa||S===Hh&&f instanceof Hh&&!f.isEnabled||S===Xh&&f instanceof Xh&&!f.isEnabled||S===$h&&f instanceof $h&&!f.isEnabled)continue;return!1}return!0}get handlesCurrentPass(){let a=this._mesh.getMaterialForRenderPass(this._scene.getEngine().currentRenderPassId),f=this._depthMode?this._getCurrentDepthRenderer():null,S=this._scene.activeCamera?.viewport,m=!!S&&S.x===0&&S.y===0&&S.width===1&&S.height===1,y=!!f&&(m||f.getDepthMap().ignoreCameraViewport)&&!this._scene.forceWireframe&&!this._scene.forcePointsCloud;if(a&&!f?._isGaussianSplattingDepthMaterial(a))return!1;let b=this._scene.fogEnabled&&this._scene.fogMode!==C.FOGMODE_NONE&&this._mesh.applyFog&&!!this._mesh.material?.fogEnabled,M=this._colorMode&&m&&this._mesh.material?.alphaMode===2&&this._mesh.material.needAlphaBlendingForMesh(this._mesh)&&!this._mesh.material.needAlphaTestingForMesh(this._mesh)&&this._mesh._getRenderingFillMode(this._mesh.material.fillMode)===F.TriangleFillMode&&this._mesh.material.constructor===ut&&this._supportsSourceMaterialPlugins()&&!b;if(y&&f&&M){let D=f.getDepthMap(),R=this._getOutputSize(!0);y=D.getRenderWidth()===R.width&&D.getRenderHeight()===R.height&&this._depthInputsMatchColorHistory()}return(M&&this._isMainColorPass()||y)&&this._computeActive&&!this._hasUnsupportedView()&&(!this._renderer||this._isWorkloadSupported())}drawColorPass(a){if(!this.handlesCurrentPass){if(!this._computeActive)this._runCompute();return!1}let f=this._colorMode&&this._isMainColorPass(),S=this._depthMode&&this._isDepthPass(),{width:m,height:y}=this._getOutputSize();if(this._resultReady&&this._renderer){if(this._syncRenderInputs(),this._renderer.accumulationVersion!==this._progressGeneration)this._resultReady=!1}if(!this._resultReady||!this._vpMatrix.equalsWithEpsilon(this._scene.getTransformMatrix(),0.00001)||this._computedWidth!==m||this._computedHeight!==y)this._runCompute();if(!this._resultReady)return!0;if(f)this._colorHistoryReady=!0,this._colorUsesCameraTransform=this._getCameraTransform()?.equalsWithEpsilon(this._vpMatrix,0.00001)??!1;if(f&&this._blitMesh&&this._blitMesh.subMeshes.length>0&&this._blit?.isReady(this._blitMesh,!1,this._blitMesh.subMeshes[0])){let b=this._blitMesh,M=this._mesh.material;if(M){this._blit.disableColorWrite=M.disableColorWrite,this._blit.disableDepthWrite=M.disableDepthWrite,this._blit.forceDepthWrite=M.forceDepthWrite,this._blit.depthFunction=M.depthFunction,this._blit.zOffset=M.zOffset,this._blit.zOffsetUnits=M.zOffsetUnits;let P=M.stencil,D=this._blit.stencil;D.enabled=P.enabled,D.mask=P.mask,D.func=P.func,D.funcRef=P.funcRef,D.funcMask=P.funcMask,D.opStencilFail=P.opStencilFail,D.opDepthFail=P.opDepthFail,D.opStencilDepthPass=P.opStencilDepthPass,D.backFunc=P.backFunc,D.backOpStencilFail=P.backOpStencilFail,D.backOpDepthFail=P.backOpDepthFail,D.backOpStencilDepthPass=P.backOpStencilDepthPass}return b.render(b.subMeshes[0],a,b),!0}if(S&&this._depthBlitMesh){let b=this._depthBlitMesh;if(b.subMeshes.length>0&&this._depthBlit?.isReady(b,!1,b.subMeshes[0]))return this._scene.getEngine().setAlphaMode(0),b.render(b.subMeshes[0],!1,b),!0}return!0}}var Ct=!1;function Rt(){if(Ct)return;Ct=!0,bm((a)=>new Dt(a))}eu();Rt();Sm();Xu();function hb(a){let f=[],S=[],{lines:m,colors:y}=a,b=[],M=0;for(let D=0;D<m.length;D++){let R=m[D];for(let B=0;B<R.length;B++){let{x:O,y:T,z:A}=R[B];if(S.push(O,T,A),y){let z=y[D],{r:V,g:j,b:E,a:q}=z[B];b.push(V,j,E,q)}if(B>0)f.push(M-1),f.push(M);M++}}let P=new w;if(P.indices=f,P.positions=S,y)P.colors=b;return P}function fb(a){let f=a.dashSize||3,S=a.gapSize||1,m=a.dashNb||200,y=a.points,b=[],M=[],P=e.Zero(),D=0,R,B,O=0,T;for(T=0;T<y.length-1;T++)y[T+1].subtractToRef(y[T],P),D+=P.length();let A=D/m,z=f*A/(f+S);for(T=0;T<y.length-1;T++){y[T+1].subtractToRef(y[T],P),R=Math.floor(P.length()/A),P.normalize();for(let j=0;j<R;j++)B=A*j,b.push(y[T].x+B*P.x,y[T].y+B*P.y,y[T].z+B*P.z),b.push(y[T].x+(B+z)*P.x,y[T].y+(B+z)*P.y,y[T].z+(B+z)*P.z),M.push(O,O+1),O+=2}let V=new w;return V.positions=b,V.indices=M,V}function _n(a,f,S=null){let{instance:m,lines:y,colors:b}=f;if(m){let R=m.getVerticesData(n.PositionKind),B,O;if(b)B=m.getVerticesData(n.ColorKind);let T=0,A=0;for(let z=0;z<y.length;z++){let V=y[z];for(let j=0;j<V.length;j++){if(R[T]=V[j].x,R[T+1]=V[j].y,R[T+2]=V[j].z,b&&B)O=b[z],B[A]=O[j].r,B[A+1]=O[j].g,B[A+2]=O[j].b,B[A+3]=O[j].a,A+=4;T+=3}}if(m.updateVerticesData(n.PositionKind,R,!1,!1),b&&B)m.updateVerticesData(n.ColorKind,B,!1,!1);return m.refreshBoundingInfo(),m}let P=new xs(a,S,null,void 0,void 0,b?!0:!1,f.useVertexAlpha,f.material);return hb(f).applyToMesh(P,f.updatable),P}function qr(a,f,S=null){let m=f.colors?[f.colors]:null;return _n(a,{lines:[f.points],updatable:f.updatable,instance:f.instance,colors:m,useVertexAlpha:f.useVertexAlpha,material:f.material},S)}function Wh(a,f,S=null){let{points:m,instance:y}=f,b=f.gapSize||1,M=f.dashSize||3;if(y){let R=(B)=>{let O=e.Zero(),T=B.length/6,A=0,z,V,j=0,E,q;for(E=0;E<m.length-1;E++)m[E+1].subtractToRef(m[E],O),A+=O.length();let G=A/T,Y=y._creationDataStorage.dashSize,W=y._creationDataStorage.gapSize,k=Y*G/(Y+W);for(E=0;E<m.length-1;E++){m[E+1].subtractToRef(m[E],O),z=Math.floor(O.length()/G),O.normalize(),q=0;while(q<z&&j<B.length)V=G*q,B[j]=m[E].x+V*O.x,B[j+1]=m[E].y+V*O.y,B[j+2]=m[E].z+V*O.z,B[j+3]=m[E].x+(V+k)*O.x,B[j+4]=m[E].y+(V+k)*O.y,B[j+5]=m[E].z+(V+k)*O.z,j+=6,q++}while(j<B.length)B[j]=m[E].x,B[j+1]=m[E].y,B[j+2]=m[E].z,j+=3};if(f.dashNb||f.dashSize||f.gapSize||f.useVertexAlpha||f.material)c.Warn("You have used an option other than points with the instance option. Please be aware that these other options will be ignored.");return y.updateMeshPositions(R,!1),y}let P=new xs(a,S,null,void 0,void 0,void 0,f.useVertexAlpha,f.material);return fb(f).applyToMesh(P,f.updatable),P._creationDataStorage=new Xc,P._creationDataStorage.dashSize=M,P._creationDataStorage.gapSize=b,P}var Vw={CreateDashedLines:Wh,CreateLineSystem:_n,CreateLines:qr},Bt=!1;function db(){if(Bt)return;Bt=!0,w.CreateLineSystem=hb,w.CreateDashedLines=fb,p.CreateLines=(a,f,S=null,m=!1,y=null)=>qr(a,{points:f,updatable:m,instance:y},S),p.CreateDashedLines=(a,f,S,m,y,b=null,M,P)=>Wh(a,{points:f,dashSize:S,gapSize:m,dashNb:y,updatable:M,instance:P},b)}db();var Tt=0.28209479177387814;async function be(a,f,S){return await new Promise((y,b)=>{let M=S.createCanvasImage();if(!M)throw Error("Failed to create ImageBitmap");M.onload=()=>{try{let D=S.createCanvas(M.width,M.height);if(!D)throw Error("Failed to create canvas");let R=D.getContext("2d");if(!R)throw Error("Failed to get 2D context");R.drawImage(M,0,0);let B=R.getImageData(0,0,D.width,D.height);y({bits:new Uint8Array(B.data.buffer),width:B.width,height:B.height})}catch(D){b(`Error loading image ${M.src} with exception: ${D}`)}},M.onerror=(D)=>{b(`Error loading image ${M.src} with exception: ${D}`)},M.crossOrigin="anonymous";let P;if(typeof a==="string"){if(!f)throw Error("filename is required when using a URL");M.src=a+f}else{let D=new Blob([a],{type:"image/webp"});P=URL.createObjectURL(D),M.src=P}})}async function ys(a,f,S){let m=a.count?a.count:a.means.shape[0],y=32,b=new ArrayBuffer(32*m),M=new Float32Array(b),P=new Float32Array(b),D=new Uint8ClampedArray(b),R=new Uint8ClampedArray(b),B=(E)=>Math.sign(E)*(Math.exp(Math.abs(E))-1),O=f[0].bits,T=f[1].bits;if(!Array.isArray(a.means.mins)||!Array.isArray(a.means.maxs))throw Error("Missing arrays in SOG data.");for(let E=0;E<m;E++){let q=E*4;for(let G=0;G<3;G++){let Y=a.means.mins[G],W=a.means.maxs[G],k=T[q+G],H=O[q+G],N=k<<8|H,K=Tr.Lerp(Y,W,N/65535);M[E*8+G]=B(K)}}let A=f[2].bits;if(a.version===2){if(!a.scales.codebook)throw Error("Missing codebook in SOG version 2 scales data.");for(let E=0;E<m;E++){let q=E*4;for(let G=0;G<3;G++){let Y=a.scales.codebook[A[q+G]],W=Math.exp(Y);P[E*8+3+G]=W}}}else{if(!Array.isArray(a.scales.mins)||!Array.isArray(a.scales.maxs))throw Error("Missing arrays in SOG scales data.");for(let E=0;E<m;E++){let q=E*4;for(let G=0;G<3;G++){let Y=A[q+G],W=Tr.Lerp(a.scales.mins[G],a.scales.maxs[G],Y/255),k=Math.exp(W);P[E*8+3+G]=k}}}let z=f[4].bits;if(a.version===2){if(!a.sh0.codebook)throw Error("Missing codebook in SOG version 2 sh0 data.");for(let E=0;E<m;E++){let q=E*4;for(let G=0;G<3;G++){let Y=0.5+a.sh0.codebook[z[q+G]]*Tt;D[E*32+24+G]=Math.max(0,Math.min(255,Math.round(255*Y)))}D[E*32+24+3]=z[q+3]}}else{if(!Array.isArray(a.sh0.mins)||!Array.isArray(a.sh0.maxs))throw Error("Missing arrays in SOG sh0 data.");for(let E=0;E<m;E++){let q=E*4;for(let G=0;G<4;G++){let Y=a.sh0.mins[G],W=a.sh0.maxs[G],k=z[q+G],H=Tr.Lerp(Y,W,k/255),N;if(G<3)N=0.5+H*Tt;else N=1/(1+Math.exp(-H));D[E*32+24+G]=Math.max(0,Math.min(255,Math.round(255*N)))}}}let V=(E)=>(E/255-0.5)*2/Math.SQRT2,j=f[3].bits;for(let E=0;E<m;E++){let q=j[E*4+0],G=j[E*4+1],Y=j[E*4+2],W=j[E*4+3],k=V(q),H=V(G),N=V(Y),K=W-252,se=k*k+H*H+N*N,U=Math.sqrt(Math.max(0,1-se)),J;switch(K){case 0:J=[U,k,H,N];break;case 1:J=[k,U,H,N];break;case 2:J=[k,H,U,N];break;case 3:J=[k,H,N,U];break;default:throw Error("Invalid quaternion mode")}R[E*32+28+0]=J[0]*127.5+127.5,R[E*32+28+1]=J[1]*127.5+127.5,R[E*32+28+2]=J[2]*127.5+127.5,R[E*32+28+3]=J[3]*127.5+127.5}if(a.shN){let E=a.shN.bands?(a.shN.bands+1)**2-1:a.shN.shape[1]/3,q=a.shN.bands!==void 0&&a.shN.bands!==null?a.shN.bands:Math.round(Math.sqrt(E+1)-1),G=f[5].bits,Y=f[6].bits,W=f[5].width,k=E*3,H=Math.ceil(k/16),K=S.getEngine().getCaps().maxTextureSize,se=Math.ceil(m/K),U=Gn(H,se*K*4*4);if(a.version===2){if(!a.shN.codebook)throw Error("Missing codebook in SOG version 2 shN data.");for(let J=0;J<m;J++){let ee=Y[J*4+0]+(Y[J*4+1]<<8),Q=ee%64*E,te=Math.floor(ee/64);for(let re=0;re<E;re++)for(let ie=0;ie<3;ie++){let ae=re*3+ie,oe=Math.floor(ae/16),le=U[oe],ue=ae%16,fe=J*16,pe=a.shN.codebook[G[(Q+re)*4+ie+te*W*4]]*127.5+127.5;le[ue+fe]=Math.max(0,Math.min(255,pe))}}}else for(let J=0;J<m;J++){let ee=Y[J*4+0]+(Y[J*4+1]<<8),Q=ee%64*E,te=Math.floor(ee/64),re=a.shN.mins,ie=a.shN.maxs;for(let ae=0;ae<3;ae++)for(let oe=0;oe<E/3;oe++){let le=oe*3+ae,ue=Math.floor(le/16),fe=U[ue],pe=le%16,Se=J*16,Me=Tr.Lerp(re,ie,G[(Q+oe)*4+ae+te*W*4]/255)*127.5+127.5;fe[pe+Se]=Math.max(0,Math.min(255,Me))}}return await new Promise((J)=>{J({mode:0,data:b,hasVertexColors:!1,sh:U,shDegree:q})})}return await new Promise((E)=>{E({mode:0,data:b,hasVertexColors:!1})})}async function Et(a,f,S){let m,y;if(a instanceof Map){y=a;let P=y.get("meta.json");if(!P)throw Error("meta.json not found in files Map");m=JSON.parse(new TextDecoder().decode(P))}else m=a;let b=[...m.means.files,...m.scales.files,...m.quats.files,...m.sh0.files];if(m.shN)b.push(...m.shN.files);let M=await Promise.all(b.map(async(P)=>{if(y&&y.has(P)){let D=y.get(P);return await be(D,P,S.getEngine())}else return await be(f,P,S.getEngine())}));return await ys(m,M,S)}function bs(a,f,S,m){let y=new ce(f,S,m,g.TEXTUREFORMAT_RGBA,a,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_UNSIGNED_BYTE,g.TEXTURE_CREATIONFLAG_SAMPLED_DATA_ONLY);return y.wrapU=g.TEXTURE_CLAMP_ADDRESSMODE,y.wrapV=g.TEXTURE_CLAMP_ADDRESSMODE,y}function Ke(a,f){return bs(a,f.bits,f.width,f.height)}async function Qe(a,f,S){let m=S.getEngine();if(typeof createImageBitmap==="function")try{let b=f.toLowerCase().endsWith(".png")?"image/png":"image/webp",M;if(typeof a==="string"){let D=await v.LoadFileAsync(a+f,!0);M=new Blob([D],{type:b})}else M=new Blob([a],{type:b});let P=await createImageBitmap(M,{premultiplyAlpha:"none",colorSpaceConversion:"none"});try{let D=new ce(null,P.width,P.height,g.TEXTUREFORMAT_RGBA,S,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_UNSIGNED_BYTE);D.wrapU=g.TEXTURE_CLAMP_ADDRESSMODE,D.wrapV=g.TEXTURE_CLAMP_ADDRESSMODE;let R=D.getInternalTexture();if(R)m.updateDynamicTexture(R,P,!1,!1);return D}finally{P.close()}}catch{}let y=await be(a,f,m);return Ke(S,y)}function Ms(a,f,S,m){let y=(M)=>Math.sign(M)*(Math.exp(Math.abs(M))-1);if(!Array.isArray(a.means.mins)||!Array.isArray(a.means.maxs))throw Error("Missing arrays in SOG data.");let b=new Float32Array(m*4);for(let M=0;M<m;M++){let P=M*4;for(let D=0;D<3;D++){let R=S[P+D]<<8|f[P+D],B=Tr.Lerp(a.means.mins[D],a.means.maxs[D],R/65535);b[M*4+D]=y(B)}b[M*4+3]=1}return b}async function ve(a,f,S,m=!0,y,b){let M,P;if(a instanceof Map){P=a;let Q=P.get("meta.json");if(!Q)throw Error("meta.json not found in files Map");M=JSON.parse(new TextDecoder().decode(Q))}else M=a;let D=async(Q)=>{if(P&&P.has(Q))return await be(P.get(Q),Q,S.getEngine());if(y){let te=new Uint8Array(await y.loadFileAsync(f+Q,b));return await be(te,Q,S.getEngine())}return await be(f,Q,S.getEngine())},R=async(Q)=>{if(P&&P.has(Q))return await Qe(P.get(Q),Q,S);if(y){let te=new Uint8Array(await y.loadFileAsync(f+Q,b));return await Qe(te,Q,S)}return await Qe(f,Q,S)},B=[...M.scales.files,...M.quats.files,...M.sh0.files,...M.shN?.files??[]],O,T,A,z,V=null,j;if(m){let[Q,te]=await Promise.all([Promise.all(M.means.files.map(D)),Promise.all(B.map(R))]);V=[Q[0],Q[1]],j=te,O=Ke(S,Q[0]),T=Ke(S,Q[1]),A=Q[0].width,z=Q[0].height}else{let[Q,te]=await Promise.all([Promise.all(M.means.files.map(R)),Promise.all(B.map(R))]);j=te,O=Q[0],T=Q[1];let re=O.getSize();A=re.width,z=re.height}let E=M.count??M.means.shape[0],q=A*z;if(q<E)throw Error(`SOG texture contains ${q} texels, but metadata references ${E} splats.`);let G=j[0],Y=j[1],W=j[2],k,H,N=0,K=0;if(M.shN&&j.length>=5)k=j[3],H=j[4],N=M.shN.bands?(M.shN.bands+1)**2-1:M.shN.shape[1]/3,K=M.shN.bands??Math.round(Math.sqrt(N+1)-1);let se;if(M.version===2){let te=new Float32Array(768);if(M.scales.codebook)te.set(M.scales.codebook.slice(0,256),0);if(M.sh0.codebook)te.set(M.sh0.codebook.slice(0,256),256);if(M.shN?.codebook)te.set(M.shN.codebook.slice(0,256),512);se=new ce(te,768,1,g.TEXTUREFORMAT_R,S,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_FLOAT,g.TEXTURE_CREATIONFLAG_SAMPLED_DATA_ONLY),se.wrapU=g.TEXTURE_CLAMP_ADDRESSMODE,se.wrapV=g.TEXTURE_CLAMP_ADDRESSMODE}let U=M.means.mins,J=M.means.maxs,ee={version:M.version===2?2:1,splatCount:E,shDegree:K,meansTextureL:O,meansTextureU:T,scalesTexture:G,quatsTexture:Y,sh0Texture:W,shCentroidsTexture:k,shLabelsTexture:H,codebookTexture:se,meansMin:[U[0],U[1],U[2]],meansMax:[J[0],J[1],J[2]],scalesMin:Array.isArray(M.scales.mins)?[M.scales.mins[0],M.scales.mins[1],M.scales.mins[2]]:void 0,scalesMax:Array.isArray(M.scales.maxs)?[M.scales.maxs[0],M.scales.maxs[1],M.scales.maxs[2]]:void 0,sh0Min:Array.isArray(M.sh0.mins)?[M.sh0.mins[0],M.sh0.mins[1],M.sh0.mins[2],M.sh0.mins[3]]:void 0,sh0Max:Array.isArray(M.sh0.maxs)?[M.sh0.maxs[0],M.sh0.maxs[1],M.sh0.maxs[2],M.sh0.maxs[3]]:void 0,shnMin:typeof M.shN?.mins==="number"?M.shN.mins:void 0,shnMax:typeof M.shN?.maxs==="number"?M.shN.maxs:void 0,shCoeffCount:N,positions:V?Ms(M,V[0].bits,V[1].bits,E):new Float32Array(0)};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:K,sogTextures:ee}}Ip();var me=`precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,At=`precision highp float;
precision highp int;

uniform sampler2D sogMeansLTex;
uniform sampler2D sogMeansUTex;
uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogSh0Tex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogMeansMin;
uniform vec3 sogMeansMax;
uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform vec4 sogSh0Min;
uniform vec4 sogSh0Max;
uniform int uVersion;
uniform int uOffset;
uniform int uSourceOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[4];

mat3 transposeM(mat3 m) {
    return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);
}

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset + uSourceOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 mL = texelFetch(sogMeansLTex, src, 0).xyz;
    vec3 mU = texelFetch(sogMeansUTex, src, 0).xyz;
    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);
    vec4 c0 = texelFetch(sogSh0Tex, src, 0);

    // Position: q16 = (u<<8)|l normalized; n = lerp(min,max,q16); pos = sign(n)*(exp(|n|)-1)
    vec3 q16 = (mU * 256.0 + mL) * (255.0 / 65535.0);
    vec3 nPos = mix(sogMeansMin, sogMeansMax, q16);
    vec3 center = sign(nPos) * (exp(abs(nPos)) - vec3(1.0));

    // Scale (v1: lerp+exp ; v2: codebook lookup)
    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    // Quaternion (largest-omitted, mode in alpha as 252 + omitted-index)
    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    mat3 S2 = mat3(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    mat3 Sigma = R * S2 * transposeM(R);

    // Color (sh0)
    const float SH_C0 = 0.28209479177387814;
    vec3 colRgb;
    float colA;
    if (uVersion == 2) {
        vec3 c3;
        c3.x = texelFetch(sogCodebookTex, ivec2(256 + int(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = texelFetch(sogCodebookTex, ivec2(256 + int(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = texelFetch(sogCodebookTex, ivec2(256 + int(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        vec4 cLerp = mix(sogSh0Min, sogSh0Max, c0);
        colRgb = vec3(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    glFragData[0] = vec4(center, 1.0);
    glFragData[1] = vec4(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    glFragData[2] = vec4(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    glFragData[3] = vec4(colRgb, colA);
}
`,ge=`
attribute position : vec3<f32>;
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = vec4<f32>(input.position.xy, 0.0, 1.0);
}
`,Ot=`
var sogMeansLTexSampler : sampler;
var sogMeansLTex : texture_2d<f32>;
var sogMeansUTexSampler : sampler;
var sogMeansUTex : texture_2d<f32>;
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogSh0TexSampler : sampler;
var sogSh0Tex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogMeansMin : vec3<f32>;
uniform sogMeansMax : vec3<f32>;
uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform sogSh0Min : vec4<f32>;
uniform sogSh0Max : vec4<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uSourceOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset + uniforms.uSourceOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let mL : vec3<f32> = textureLoad(sogMeansLTex, src, 0).xyz;
    let mU : vec3<f32> = textureLoad(sogMeansUTex, src, 0).xyz;
    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);
    let c0 : vec4<f32> = textureLoad(sogSh0Tex, src, 0);

    let q16 : vec3<f32> = (mU * 256.0 + mL) * (255.0 / 65535.0);
    let nPos : vec3<f32> = mix(uniforms.sogMeansMin, uniforms.sogMeansMax, q16);
    let center : vec3<f32> = sign(nPos) * (exp(abs(nPos)) - vec3<f32>(1.0));

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    let S2 : mat3x3<f32> = mat3x3<f32>(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    let Sigma : mat3x3<f32> = R * S2 * transpose(R);

    let SH_C0 : f32 = 0.28209479177387814;
    var colRgb : vec3<f32>;
    var colA : f32;
    if (uniforms.uVersion == 2) {
        var c3 : vec3<f32>;
        c3.x = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3<f32>(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        let cLerp : vec4<f32> = mix(uniforms.sogSh0Min, uniforms.sogSh0Max, c0);
        colRgb = vec3<f32>(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    fragmentOutputs.fragData0 = vec4<f32>(center, 1.0);
    fragmentOutputs.fragData1 = vec4<f32>(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    fragmentOutputs.fragData2 = vec4<f32>(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    fragmentOutputs.fragData3 = vec4<f32>(colRgb, colA);
}
`,Lt="gsSogRotDecodeToWorkBuffer",Ft=`precision highp float;
precision highp int;

uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform int uVersion;
uniform int uOffset;
uniform int uSourceOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset + uSourceOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);

    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    glFragData[0] = vec4(R[0], R[1].x);
    glFragData[1] = vec4(R[1].y, R[1].z, R[2].x, R[2].y);
    glFragData[2] = vec4(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,Gt=`
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uSourceOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset + uniforms.uSourceOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    fragmentOutputs.fragData0 = vec4<f32>(R[0], R[1].x);
    fragmentOutputs.fragData1 = vec4<f32>(R[1].y, R[1].z, R[2].x, R[2].y);
    fragmentOutputs.fragData2 = vec4<f32>(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,zt="gsSogShDecodeToWorkBuffer",It=`precision highp float;
precision highp int;

uniform sampler2D sogShLabelsTex;
uniform sampler2D sogShCentroidsTex;
uniform sampler2D sogCodebookTex;
uniform float sogShnMin;
uniform float sogShnMax;
uniform int uVersion;
uniform int uOffset;
uniform int uSourceOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;
uniform int uCoeffs;
uniform int uShTextureIndex;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int kLocal = global - uOffset + uSourceOffset;

    // 16-bit label for this source splat (LSB in r, MSB in g), indexed over the labels texture's own width.
    ivec2 lsz = textureSize(sogShLabelsTex, 0);
    ivec2 lsrc = ivec2(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    vec4 labelRaw = texelFetch(sogShLabelsTex, lsrc, 0);
    int n = int(labelRaw.r * 255.0 + 0.5) + int(labelRaw.g * 255.0 + 0.5) * 256;
    int u = (n - (n / 64) * 64) * uCoeffs;
    int v = n / 64;

    uint packed0 = 0u;
    uint packed1 = 0u;
    uint packed2 = 0u;
    uint packed3 = 0u;

    for (int b = 0; b < 16; b++) {
        int s = uShTextureIndex * 16 + b; // flat SH scalar index
        int kc = s / 3;                    // higher-order coefficient (0-based)
        int j = s - kc * 3;                // channel (0=r,1=g,2=b)
        float byteVal = 128.0;             // neutral (decompose(128) ~= 0)
        if (kc < uCoeffs) {
            vec4 centroidRaw = texelFetch(sogShCentroidsTex, ivec2(u + kc, v), 0);
            float ch = (j == 0) ? centroidRaw.r : ((j == 1) ? centroidRaw.g : centroidRaw.b);
            float coeff;
            if (uVersion == 2) {
                int cidx = int(ch * 255.0 + 0.5);
                coeff = texelFetch(sogCodebookTex, ivec2(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(sogShnMin, sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        uint bv = uint(byteVal + 0.5);
        int comp = b / 4;
        uint contrib = bv << uint((b - comp * 4) * 8);
        if (comp == 0) { packed0 |= contrib; }
        else if (comp == 1) { packed1 |= contrib; }
        else if (comp == 2) { packed2 |= contrib; }
        else { packed3 |= contrib; }
    }
    outSh = uvec4(packed0, packed1, packed2, packed3);
}
`,qt=`
var sogShLabelsTexSampler : sampler;
var sogShLabelsTex : texture_2d<f32>;
var sogShCentroidsTexSampler : sampler;
var sogShCentroidsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogShnMin : f32;
uniform sogShnMax : f32;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uSourceOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;
uniform uCoeffs : i32;
uniform uShTextureIndex : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let kLocal : i32 = global - uniforms.uOffset + uniforms.uSourceOffset;

    let lsz : vec2<i32> = vec2<i32>(textureDimensions(sogShLabelsTex, 0));
    let lsrc : vec2<i32> = vec2<i32>(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    let labelRaw : vec4<f32> = textureLoad(sogShLabelsTex, lsrc, 0);
    let n : i32 = i32(labelRaw.r * 255.0 + 0.5) + i32(labelRaw.g * 255.0 + 0.5) * 256;
    let u : i32 = (n - (n / 64) * 64) * uniforms.uCoeffs;
    let v : i32 = n / 64;

    var packed : array<u32, 4> = array<u32, 4>(0u, 0u, 0u, 0u);

    for (var b : i32 = 0; b < 16; b = b + 1) {
        let s : i32 = uniforms.uShTextureIndex * 16 + b;
        let kc : i32 = s / 3;
        let j : i32 = s - kc * 3;
        var byteVal : f32 = 128.0;
        if (kc < uniforms.uCoeffs) {
            let centroidRaw : vec4<f32> = textureLoad(sogShCentroidsTex, vec2<i32>(u + kc, v), 0);
            var ch : f32 = centroidRaw.b;
            if (j == 0) { ch = centroidRaw.r; } else if (j == 1) { ch = centroidRaw.g; }
            var coeff : f32;
            if (uniforms.uVersion == 2) {
                let cidx : i32 = i32(ch * 255.0 + 0.5);
                coeff = textureLoad(sogCodebookTex, vec2<i32>(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(uniforms.sogShnMin, uniforms.sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        let bv : u32 = u32(byteVal + 0.5);
        let comp : i32 = b / 4;
        packed[comp] = packed[comp] | (bv << u32((b - comp * 4) * 8));
    }
    fragmentOutputs.fragData0 = vec4<u32>(packed[0], packed[1], packed[2], packed[3]);
}
`,Wt="gsWorkBufferRelayout",Nt=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform sampler2D uSrc3;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged):
//   uSrcBaseOffset — added to the map's (region-local) source index so pass 1 reads the correct GLOBAL atlas texel.
//   uDstBaseRow    — subtracted from the atlas destination row so pass 2's identity copy reads the region-local temp.
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[4];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
    glFragData[3] = texelFetch(uSrc3, s, 0);
}
`,Ut="gsWorkBufferShCopy",jt=`precision highp float;
precision highp int;
precision highp usampler2D;

uniform sampler2D uMapTex;
uniform usampler2D uSrcSh;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    outSh = texelFetch(uSrcSh, s, 0);
}
`,Vt=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
// Integer source sampled via textureLoad only — NO paired sampler (a sampler on a Uint texture fails WebGPU
// validation: "None of the supported sample types (Uint)"). Mirrors the draw shader's shTexture0 declaration.
var uSrcSh : texture_2d<u32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    // Wrap in an explicit vec4<u32> so the WGSL processor emits an integer fragData location (its detection keys
    // off a literal vec4<u32>/vec4u in the assignment; a bare textureLoad(...) would default to vec4<f32>).
    fragmentOutputs.fragData0 = vec4<u32>(textureLoad(uSrcSh, s, 0));
}
`,Zt="gsWorkBufferRotCopy",Ht=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
}
`,Xt=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
}
`,Yt=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;
var uSrc3Sampler : sampler;
var uSrc3 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged).
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
    fragmentOutputs.fragData3 = textureLoad(uSrc3, s, 0);
}
`;class Pe{get supportsAsyncCentersReadback(){let a=this._scene.getEngine();if(a.isWebGPU)return!0;let f=a;return!!f._gl&&typeof f._readPixelsAsync==="function"&&(f.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map((a)=>a.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(a,f,S,m,y){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=a,this._shaderLanguage=a.getEngine().isWebGPU?1:0,this._capacity=Math.max(1,f),S)this._mrt=S.mrt,this._textureSize=S.width,this._baseOffset=S.baseOffset,this._ownsMrt=!1;else this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,f)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt("gsWorkBuffer",!0);if(m&&m.textureCount>0){if(m.externalMrts)this._shMrts=m.externalMrts.slice(0,m.textureCount),this._ownsShMrts=!1;else{for(let b=0;b<m.textureCount;b++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${b}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}if(y){if(y.externalMrt)this._rotMrt=y.externalMrt,this._ownsRotMrt=!1;else this._rotMrt=this._createRotMrt("gsWorkBufferRot",!0),this._ownsRotMrt=!0;this._rotMaterial=this._createRotMaterial()}if(this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,!this._ownsMrt)this.isRelayoutReady()}rebindAtlas(a){if(!this._ownsMrt)this._mrt=a}rebindShAtlas(a){if(!this._ownsShMrts&&a&&this._shMrts.length)this._shMrts=a.slice(0,this._shMrts.length)}rebindRotAtlas(a){if(!this._ownsRotMrt&&a&&this._rotMrt)this._rotMrt=a}setBaseOffset(a){if(!this._ownsMrt)this._baseOffset=a}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){c.Warn("GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.");return}let a=this._textureSize,f=Math.max(1,Math.floor(this._capacity/a)),S=Math.floor(this._baseOffset/a);if(!this._backupMrt)this._backupMrt=this._createMrt("gsAtlasBackup",!1,a,f);if(this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,a,a,0,-S),this._shMrts.length&&this._shCopyMaterial){if(!this._backupShMrts)this._backupShMrts=this._shMrts.map((m,y)=>this._createShMrt(`gsShAtlasBackup${y}`,!1,a,f));for(let m=0;m<this._shMrts.length;m++)this._renderShCopyPass(this._backupShMrts[m],this._shMrts[m].textures[0],this._mrt.textures[0],0,a,a,0,-S)}if(this._rotMrt&&this._rotCopyMaterial){if(!this._backupRotMrt)this._backupRotMrt=this._createRotMrt("gsRotAtlasBackup",!1,a,f);this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,a,a,0,-S)}this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let a=this._textureSize,f=Math.max(1,Math.floor(this._capacity/a)),S=Math.floor(this._baseOffset/a),m=this._scene.getEngine();m.enableScissor(0,S,a,f);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,a,a,0,S),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let y=0;y<this._shMrts.length&&y<this._backupShMrts.length;y++)this._renderShCopyPass(this._shMrts[y],this._backupShMrts[y].textures[0],this._mrt.textures[0],0,a,a,0,S);if(this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial)this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,a,a,0,S)}finally{m.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let y of this._backupShMrts)y.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(a,f,S=this._textureSize,m=this._textureSize){let y=this._scene.getEngine()._caps.textureHalfFloatRender?g.TEXTURETYPE_HALF_FLOAT:g.TEXTURETYPE_FLOAT,b=new Cr(a,{width:S,height:m},4,this._scene,{types:[g.TEXTURETYPE_FLOAT,y,y,g.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE],formats:[g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${a}Centers`,`${a}CovA`,`${a}CovB`,`${a}Colors`]);if(b.clearColor=new x(0,0,0,0),b.renderList=[],f)b.onClearObservable.add(()=>{});return b}_createShMrt(a,f,S=this._textureSize,m=this._textureSize){let y=new Cr(a,{width:S,height:m},1,this._scene,{types:[g.TEXTURETYPE_UNSIGNED_INTEGER],formats:[g.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[g.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[a]);if(y.clearColor=new x(0,0,0,0),y.renderList=[],f)y.onClearObservable.add(()=>{});return y}_createRotMrt(a,f,S=this._textureSize,m=this._textureSize){let y=this._scene.getEngine()._caps.textureHalfFloatRender?g.TEXTURETYPE_HALF_FLOAT:g.TEXTURETYPE_FLOAT,b=new Cr(a,{width:S,height:m},3,this._scene,{types:[y,y,y],formats:[g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA],samplingModes:[g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${a}A`,`${a}B`,`${a}Scale`]);if(b.clearColor=new x(0,0,0,0),b.renderList=[],f)b.onClearObservable.add(()=>{});return b}async decodeAsync(a,f,S,m){if(this._disposed)return;let y=S??0,b=m??a.splatCount-y;if(S!==void 0||m!==void 0){if(!Number.isSafeInteger(a.splatCount)||a.splatCount<0||!Number.isSafeInteger(y)||y<0||!Number.isSafeInteger(b)||b<0||y+b>a.splatCount||!Number.isSafeInteger(f)||f<0||f+b>this._capacity)throw RangeError("GaussianSplattingWorkBuffer: invalid source or destination decode range.");if(b===0)return}this._applyPack(a,y,b);let M=this._shMaterial!==null&&this._shMrts.length>0;if(M)this._applyShPack(a,y,b);let P=this._rotMaterial!==null&&this._rotMrt!==null;if(P)this._applyRotPack(a,y,b);await new Promise((D)=>{let R=()=>{if(this._disposed){D();return}if(!this._material.isReady(this._quad)||M&&!this._shMaterial.isReady(this._quad)||P&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(R);return}let B=this._textureSize,O=this._baseOffset+f;if(this._material.setInt("uOffset",O),M)this._shMaterial.setInt("uOffset",O);if(P)this._rotMaterial.setInt("uOffset",O);let T=Math.floor(O/B),A=Math.max(1,Math.ceil((O+b)/B)-T),z=this._scene.getEngine();z.enableScissor(0,T,B,A);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),M){for(let V=0;V<this._shMrts.length;V++)this._shMaterial.setInt("uShTextureIndex",V),this._quad.material=this._shMaterial,this._shMrts[V].renderList=[this._quad],this._shMrts[V].render();this._quad.material=this._material}if(P)this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material}finally{z.disableScissor()}D()};this._scene.onBeforeRenderObservable.addOnce(R)})}isRelayoutReady(){if(this._disposed)return!1;if(!this._copyMaterial)this._copyMaterial=this._createCopyMaterial();if(this._shMrts.length&&!this._shCopyMaterial)this._shCopyMaterial=this._createShCopyMaterial();if(this._rotMrt&&!this._rotCopyMaterial)this._rotCopyMaterial=this._createRotCopyMaterial();this._bindCopyMaterialsToAtlas();let a=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),f=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&a&&f}_bindCopyMaterialsToAtlas(){let a=this._mrt.textures;if(this._copyMaterial)this._copyMaterial.setTexture("uMapTex",a[0]),this._copyMaterial.setTexture("uSrc0",a[0]),this._copyMaterial.setTexture("uSrc1",a[1]),this._copyMaterial.setTexture("uSrc2",a[2]),this._copyMaterial.setTexture("uSrc3",a[3]);if(this._shCopyMaterial&&this._shMrts.length)this._shCopyMaterial.setTexture("uMapTex",a[0]),this._shCopyMaterial.setTexture("uSrcSh",this._shMrts[0].textures[0]);if(this._rotCopyMaterial&&this._rotMrt){let f=this._rotMrt.textures;this._rotCopyMaterial.setTexture("uMapTex",a[0]),this._rotCopyMaterial.setTexture("uSrc0",f[0]),this._rotCopyMaterial.setTexture("uSrc1",f[1]),this._rotCopyMaterial.setTexture("uSrc2",f[2])}}relayoutSync(a){if(this._disposed||!this._copyMaterial)return;let f=this._textureSize,S=f,m=this._ownsMrt?f:Math.max(1,Math.floor(this._capacity/f));if(!this._relayoutMapData)this._relayoutMapData=new Float32Array(S*m);let y=this._relayoutMapData;if(y.fill(-1),y.set(a.subarray(0,Math.min(a.length,y.length))),!this._relayoutMapTexture)this._relayoutMapTexture=new ce(y,S,m,g.TEXTUREFORMAT_R,this._scene,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_FLOAT,g.TEXTURE_CREATIONFLAG_SAMPLED_DATA_ONLY);else this._relayoutMapTexture.update(y);let b=this._relayoutMapTexture;if(this._ownsMrt){let T=this._createMrt("gsRelayoutTemp",!1);try{this._renderRelayoutPass(T,this._mrt.textures,b,1),this._renderRelayoutPass(this._mrt,T.textures,b,0)}finally{T.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let A=0;A<this._shMrts.length;A++){let z=this._createShMrt("gsShRelayoutTemp",!1);try{this._renderShCopyPass(z,this._shMrts[A].textures[0],b,1),this._renderShCopyPass(this._shMrts[A],z.textures[0],b,0)}finally{z.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let A=this._createRotMrt("gsRotRelayoutTemp",!1);try{this._renderRotCopyPass(A,this._rotMrt.textures,b,1),this._renderRotCopyPass(this._rotMrt,A.textures,b,0)}finally{A.dispose()}}this._quad.material=this._material;return}let M=Math.floor(this._baseOffset/f),P=m,D=this._scene.getEngine(),R=this._createMrt("gsRelayoutTemp",!1,f,P),B=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((T,A)=>this._createShMrt(`gsShRelayoutTemp${A}`,!1,f,P)):[],O=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt("gsRotRelayoutTemp",!1,f,P):null;try{this._renderRelayoutPass(R,this._mrt.textures,b,1,f,f,this._baseOffset,0);for(let T=0;T<B.length;T++)this._renderShCopyPass(B[T],this._shMrts[T].textures[0],b,1,f,f,this._baseOffset,0);if(O)this._renderRotCopyPass(O,this._rotMrt.textures,b,1,f,f,this._baseOffset,0);D.enableScissor(0,M,f,P);try{this._renderRelayoutPass(this._mrt,R.textures,b,0,f,f,0,M);for(let T=0;T<B.length;T++)this._renderShCopyPass(this._shMrts[T],B[T].textures[0],b,0,f,f,0,M);if(O)this._renderRotCopyPass(this._rotMrt,O.textures,b,0,f,f,0,M)}finally{D.disableScissor()}}finally{R.dispose();for(let T of B)T.dispose();O?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(a,f,S,m,y=this._textureSize,b=this._textureSize,M=0,P=0){let D=this._copyMaterial;D.setTexture("uMapTex",S),D.setTexture("uSrc0",f[0]),D.setTexture("uSrc1",f[1]),D.setTexture("uSrc2",f[2]),D.setTexture("uSrc3",f[3]),D.setInt("uDstWidth",y),D.setInt("uSrcWidth",b),D.setInt("uUseMap",m),D.setInt("uSrcBaseOffset",M),D.setInt("uDstBaseRow",P),this._quad.material=D,a.renderList=[this._quad],a.render()}_createCopyMaterial(){let a=this._shaderLanguage===1,f=new de(Wt,this._scene,{vertexSource:a?ge:me,fragmentSource:a?Yt:Nt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2","uSrc3"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_renderShCopyPass(a,f,S,m,y=this._textureSize,b=this._textureSize,M=0,P=0){let D=this._shCopyMaterial;D.setTexture("uMapTex",S),D.setTexture("uSrcSh",f),D.setInt("uDstWidth",y),D.setInt("uSrcWidth",b),D.setInt("uUseMap",m),D.setInt("uSrcBaseOffset",M),D.setInt("uDstBaseRow",P),this._quad.material=D,a.renderList=[this._quad],a.render()}_createShCopyMaterial(){let a=this._shaderLanguage===1,f=new de(Ut,this._scene,{vertexSource:a?ge:me,fragmentSource:a?Vt:jt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrcSh"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_renderRotCopyPass(a,f,S,m,y=this._textureSize,b=this._textureSize,M=0,P=0){let D=this._rotCopyMaterial;D.setTexture("uMapTex",S),D.setTexture("uSrc0",f[0]),D.setTexture("uSrc1",f[1]),D.setTexture("uSrc2",f[2]),D.setInt("uDstWidth",y),D.setInt("uSrcWidth",b),D.setInt("uUseMap",m),D.setInt("uSrcBaseOffset",M),D.setInt("uDstBaseRow",P),this._quad.material=D,a.renderList=[this._quad],a.render()}_createRotCopyMaterial(){let a=this._shaderLanguage===1,f=new de(Zt,this._scene,{vertexSource:a?ge:me,fragmentSource:a?Xt:Ht},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}async readCentersRangeAsync(a,f){if(this._disposed||f<=0||!this.supportsAsyncCentersReadback)return null;let S=this._textureSize,m=this._baseOffset+a,y=Math.floor(m/S),M=Math.ceil((m+f)/S)-y,P=(m-y*S)*4,D=P+f*4,R=this._mrt.textures[0],B=this._scene.getEngine();if(B.isWebGPU){let E=await R.readPixels(0,0,null,!0,!0,0,y,S,M);if(this._disposed||!E)return null;let q=E instanceof Float32Array?E:new Float32Array(E.buffer,E.byteOffset,E.byteLength/4);return q.length>=D?q.subarray(P,D):null}let O=B,T=O._gl,A=R.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!A)return null;let z=new Float32Array(S*M*4);if(!this._readFbo)this._readFbo=T.createFramebuffer();let V=O._currentFramebuffer;T.bindFramebuffer(T.FRAMEBUFFER,this._readFbo),T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,A,0),T.readBuffer(T.COLOR_ATTACHMENT0);let j=O._readPixelsAsync(0,y,S,M,T.RGBA,T.FLOAT,z);if(T.bindFramebuffer(T.FRAMEBUFFER,V),!V)T.readBuffer(T.BACK);if(!j)return null;if(await j,this._disposed||z.length<D)return null;return z.subarray(P,D)}dispose(){if(this._disposed=!0,this._readFbo)this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),this._readFbo=null;if(this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let a of this._backupShMrts)a.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt)this._mrt.dispose();if(this._ownsShMrts)for(let a of this._shMrts)a.dispose();if(this._shMrts=[],this._ownsRotMrt)this._rotMrt?.dispose();this._rotMrt=null}_createQuad(){let a=new p("gsWorkBufferQuad",this._scene),f=new w;return f.positions=[-1,-1,0,3,-1,0,-1,3,0],f.indices=[0,1,2],f.applyToMesh(a),this._scene.removeMesh(a),a}_createMaterial(){let a=this._shaderLanguage===1,f=new de("gsSogDecode",this._scene,{vertexSource:a?ge:me,fragmentSource:a?Ot:At},{attributes:["position"],uniforms:["sogMeansMin","sogMeansMax","sogScalesMin","sogScalesMax","sogSh0Min","sogSh0Max","uVersion","uOffset","uSourceOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogMeansLTex","sogMeansUTex","sogScalesTex","sogQuatsTex","sogSh0Tex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_applyPack(a,f,S){let m=this._material,y=a.meansTextureL.getSize().width;m.setTexture("sogMeansLTex",a.meansTextureL),m.setTexture("sogMeansUTex",a.meansTextureU),m.setTexture("sogScalesTex",a.scalesTexture),m.setTexture("sogQuatsTex",a.quatsTexture),m.setTexture("sogSh0Tex",a.sh0Texture),m.setTexture("sogCodebookTex",a.codebookTexture??a.sh0Texture),m.setVector3("sogMeansMin",new e(a.meansMin[0],a.meansMin[1],a.meansMin[2])),m.setVector3("sogMeansMax",new e(a.meansMax[0],a.meansMax[1],a.meansMax[2]));let b=a.scalesMin??[0,0,0],M=a.scalesMax??[0,0,0];m.setVector3("sogScalesMin",new e(b[0],b[1],b[2])),m.setVector3("sogScalesMax",new e(M[0],M[1],M[2]));let P=a.sh0Min??[0,0,0,0],D=a.sh0Max??[0,0,0,0];m.setVector4("sogSh0Min",new I(P[0],P[1],P[2],P[3])),m.setVector4("sogSh0Max",new I(D[0],D[1],D[2],D[3])),m.setInt("uVersion",a.version),m.setInt("uSourceOffset",f),m.setInt("uCount",S),m.setInt("uDestWidth",this._textureSize),m.setInt("uSrcWidth",y)}_createShMaterial(){let a=this._shaderLanguage===1,f=new de(zt,this._scene,{vertexSource:a?ge:me,fragmentSource:a?qt:It},{attributes:["position"],uniforms:["sogShnMin","sogShnMax","uVersion","uOffset","uSourceOffset","uCount","uDestWidth","uSrcWidth","uCoeffs","uShTextureIndex"],samplers:["sogShLabelsTex","sogShCentroidsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_applyShPack(a,f,S){let m=this._shMaterial,y=!!a.shLabelsTexture&&!!a.shCentroidsTexture,b=a.shLabelsTexture??a.sh0Texture,M=a.shCentroidsTexture??a.sh0Texture;m.setTexture("sogShLabelsTex",b),m.setTexture("sogShCentroidsTex",M),m.setTexture("sogCodebookTex",a.codebookTexture??b),m.setFloat("sogShnMin",a.shnMin??0),m.setFloat("sogShnMax",a.shnMax??0),m.setInt("uVersion",a.version),m.setInt("uSourceOffset",f),m.setInt("uCount",S),m.setInt("uDestWidth",this._textureSize),m.setInt("uSrcWidth",b.getSize().width),m.setInt("uCoeffs",y?a.shCoeffCount:0)}_createRotMaterial(){let a=this._shaderLanguage===1,f=new de(Lt,this._scene,{vertexSource:a?ge:me,fragmentSource:a?Gt:Ft},{attributes:["position"],uniforms:["sogScalesMin","sogScalesMax","uVersion","uOffset","uSourceOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogScalesTex","sogQuatsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return f.backFaceCulling=!1,f.disableDepthWrite=!0,f}_applyRotPack(a,f,S){let m=this._rotMaterial,y=a.scalesTexture.getSize().width;m.setTexture("sogScalesTex",a.scalesTexture),m.setTexture("sogQuatsTex",a.quatsTexture),m.setTexture("sogCodebookTex",a.codebookTexture??a.scalesTexture);let b=a.scalesMin??[0,0,0],M=a.scalesMax??[0,0,0];m.setVector3("sogScalesMin",new e(b[0],b[1],b[2])),m.setVector3("sogScalesMax",new e(M[0],M[1],M[2])),m.setInt("uVersion",a.version),m.setInt("uSourceOffset",f),m.setInt("uCount",S),m.setInt("uDestWidth",this._textureSize),m.setInt("uSrcWidth",y)}}class Je{constructor(a){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,a?.maxConcurrent??2),this.maxRetries=Math.max(0,a?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(a,f){if(this._disposed)throw Error("GaussianSplattingDownloadManager has been disposed.");let S=this._pending.get(a),m=!S;if(!S)S={url:a,consumers:new Set,settled:!1,cancelled:!1,started:!1,slotReleased:!1},this._pending.set(a,S),this._queue.push(S);let y={task:S,groupId:f};if(y.promise=new Promise((b,M)=>{y.resolve=b,y.reject=M}),S.consumers.add(y),f!==void 0){let b=this._groups.get(f);if(!b)b=new Set,this._groups.set(f,b);b.add(y)}if(m)this._pump();return await y.promise}cancel(a){let f=this._pending.get(a);if(!f)return;this._abort(f,Error(`GaussianSplattingDownloadManager: download cancelled (${a}).`))}cancelGroup(a){let f=this._groups.get(a);if(!f)return;for(let S of Array.from(f))this._cancelConsumer(S,Error(`GaussianSplattingDownloadManager: download cancelled (${S.task.url}).`))}dispose(){if(this._disposed)return;this._disposed=!0,this._queue.length=0;for(let a of Array.from(this._pending.values()))this._abort(a,Error("GaussianSplattingDownloadManager has been disposed."))}_abort(a,f){if(a.settled)return;a.cancelled=!0;let S=this._queue.indexOf(a);if(S!==-1)this._queue.splice(S,1);if(a.request?.abort(),a.cancelAttempt?.(f),this._settle(a,(m)=>m.reject(f)),a.started)this._releaseSlot(a)}_cancelConsumer(a,f){let S=a.task;if(!S.consumers.has(a))return;if(this._removeConsumer(a),a.reject(f),S.consumers.size===0)this._abort(S,f)}_removeConsumer(a){if(a.task.consumers.delete(a),a.groupId!==void 0){let f=this._groups.get(a.groupId);if(f?.delete(a),f?.size===0)this._groups.delete(a.groupId)}}_settle(a,f){if(a.settled)return;if(a.settled=!0,this._pending.get(a.url)===a)this._pending.delete(a.url);for(let S of a.consumers)this._removeConsumer(S),f(S)}_releaseSlot(a){if(a.slotReleased)return;a.slotReleased=!0,this._activeCount--,this._pump()}_pump(){while(!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0){let a=this._queue.shift();if(a.settled)continue;a.started=!0,this._activeCount++,this._runTaskAsync(a).finally(()=>{this._releaseSlot(a)})}}async _runTaskAsync(a){let f;for(let S=0;S<=this.maxRetries;S++){if(this._disposed||a.cancelled)return;try{let m=await this._downloadAttemptAsync(a);this._settle(a,(y)=>y.resolve(m));return}catch(m){if(a.cancelAttempt=void 0,this._disposed||a.cancelled)return;f=m}}this._settle(a,(S)=>S.reject(f))}async _downloadAttemptAsync(a){return await new Promise((f,S)=>{a.cancelAttempt=S,a.request=v.LoadFile(a.url,(m)=>f(m),void 0,void 0,!0,(m,y)=>S(y instanceof Error?y:Error(`GaussianSplattingDownloadManager: failed to load ${a.url}.`)))})}}class $t{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}}class et{constructor(a=0,f=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=f,a>0){this._capacity=a,this._freeSize=a;let S=this._obtain(0,a,!0);this._headAll=S,this._tailAll=S,this._addToBucket(S)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(a){if(a<=0)return null;let f=this._findFreeBlock(a);if(!f)return null;if(this._usedSize+=a,this._freeSize-=a,f._size===a)return f._free=!1,this._removeFromBucket(f),f;let S=this._obtain(f._offset,a,!1);return f._offset+=a,f._size-=a,this._rebucket(f),this._insertAfterInMainList(S,f._prev),S}free(a){if(!a||a._free)return;a._free=!0,this._usedSize-=a._size,this._freeSize+=a._size;let{_prev:f,_next:S}=a,m=f&&f._free,y=S&&S._free;if(m&&y)f._size+=a._size+S._size,this._removeFromMainList(a),this._removeFromMainList(S),this._removeFromBucket(S),this._release(a),this._release(S),this._rebucket(f);else if(m)f._size+=a._size,this._removeFromMainList(a),this._release(a),this._rebucket(f);else if(y)a._size+=S._size,this._removeFromMainList(S),this._removeFromBucket(S),this._release(S),this._addToBucket(a);else this._addToBucket(a)}grow(a){if(a<=this._capacity)return;let f=a-this._capacity;if(this._capacity=a,this._freeSize+=f,this._tailAll&&this._tailAll._free)this._tailAll._size+=f,this._rebucket(this._tailAll);else{let S=this._obtain(this._capacity-f,f,!0);this._insertAfterInMainList(S,this._tailAll),this._addToBucket(S)}}defrag(a=0,f=new Set){if(f.clear(),this._freeRegionCount===0)return f;if(a===0)this._defragFull(f);else this._defragIncremental(a,f);return f}updateAllocation(a,f){for(let S=0;S<a.length;S++)this.free(a[S]);for(let S=0;S<f.length;S++){let m=f[S],y=this.allocate(m);if(y)f[S]=y;else{let b=m;for(let D=S+1;D<f.length;D++)b+=f[D];let M=this._usedSize+b,P=Math.ceil(M*this._growMultiplier);if(P>this._capacity)this.grow(P);this.defrag(0);for(let D=S;D<f.length;D++)f[D]=this.allocate(f[D]);return!0}}return!1}_bucketFor(a){return 31-Math.clz32(a)}_addToBucket(a){let f=this._bucketFor(a._size);a._bucket=f;while(f>=this._freeBucketHeads.length)this._freeBucketHeads.push(null);if(a._prevFree=null,a._nextFree=this._freeBucketHeads[f],this._freeBucketHeads[f])this._freeBucketHeads[f]._prevFree=a;this._freeBucketHeads[f]=a,this._freeRegionCount++}_removeFromBucket(a){let f=a._bucket;if(a._prevFree)a._prevFree._nextFree=a._nextFree;else this._freeBucketHeads[f]=a._nextFree;if(a._nextFree)a._nextFree._prevFree=a._prevFree;a._prevFree=null,a._nextFree=null,a._bucket=-1,this._freeRegionCount--}_rebucket(a){if(this._bucketFor(a._size)!==a._bucket)this._removeFromBucket(a),this._addToBucket(a)}_obtain(a,f,S){let m=this._pool.length>0?this._pool.pop():new $t;return m._offset=a,m._size=f,m._free=S,m._prev=null,m._next=null,m._prevFree=null,m._nextFree=null,m._bucket=-1,m}_release(a){a._prev=null,a._next=null,a._prevFree=null,a._nextFree=null,a._bucket=-1,this._pool.push(a)}_insertAfterInMainList(a,f){if(f===null){if(a._prev=null,a._next=this._headAll,this._headAll)this._headAll._prev=a;if(this._headAll=a,!this._tailAll)this._tailAll=a}else{if(a._prev=f,a._next=f._next,f._next)f._next._prev=a;if(f._next=a,this._tailAll===f)this._tailAll=a}}_removeFromMainList(a){if(a._prev)a._prev._next=a._next;else this._headAll=a._next;if(a._next)a._next._prev=a._prev;else this._tailAll=a._prev;a._prev=null,a._next=null}_findFreeBlock(a){let f=this._bucketFor(a),S=this._freeBucketHeads.length;if(f<S){let m=null,y=this._freeBucketHeads[f];while(y){if(y._size>=a){if(!m||y._size<m._size){if(m=y,y._size===a)break}}y=y._nextFree}if(m)return m}for(let m=f+1;m<S;m++)if(this._freeBucketHeads[m])return this._freeBucketHeads[m];return null}_defragFull(a){for(let y=0;y<this._freeBucketHeads.length;y++){let b=this._freeBucketHeads[y];while(b){let M=b._nextFree;this._removeFromMainList(b),b._prevFree=null,b._nextFree=null,b._bucket=-1,this._pool.push(b),b=M}this._freeBucketHeads[y]=null}this._freeRegionCount=0;let f=0,S=this._headAll;while(S){if(S._offset!==f)S._offset=f,a.add(S);f+=S._size,S=S._next}let m=this._capacity-f;if(m>0){let y=this._obtain(f,m,!0);this._insertAfterInMainList(y,this._tailAll),this._addToBucket(y)}}_defragIncremental(a,f){let S=Math.ceil(a/2),m=a-S;for(let b=0;b<S;b++){let M=this._tailAll;while(M&&M._free)M=M._prev;if(!M)break;let P=this._findFreeBlock(M._size);if(!P||P._offset>=M._offset)break;this._moveBlock(M,P),f.add(M)}let y=this._headAll;for(let b=0;b<m&&y;){let M=y._next;if(y._free&&M&&!M._free){let P=M,D=y;P._offset=D._offset,D._offset=P._offset+P._size;let R=D._prev,B=P._next;if(P._prev=R,P._next=D,D._prev=P,D._next=B,R)R._next=P;else this._headAll=P;if(B)B._prev=D;else this._tailAll=D;if(D._next&&D._next._free){let O=D._next;D._size+=O._size,this._removeFromMainList(O),this._removeFromBucket(O),this._release(O),this._rebucket(D)}f.add(P),b++,y=D._next}else y=M}}_moveBlock(a,f){let S=a._size,m=f._offset,y=a._prev;this._removeFromMainList(a);let b=this._obtain(a._offset,S,!0);if(this._insertAfterInMainList(b,y),this._addToBucket(b),b._next&&b._next._free){let M=b._next;b._size+=M._size,this._removeFromMainList(M),this._removeFromBucket(M),this._release(M),this._rebucket(b)}if(b._prev&&b._prev._free){let M=b._prev;M._size+=b._size,this._removeFromMainList(b),this._removeFromBucket(b),this._release(b),this._rebucket(M)}if(a._offset=m,f._size===S){let M=f._prev;this._removeFromMainList(f),this._removeFromBucket(f),this._release(f),this._insertAfterInMainList(a,M)}else f._offset+=S,f._size-=S,this._rebucket(f),this._insertAfterInMainList(a,f._prev)}}class tt{constructor(a,f,S){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new et(a),this._cooldownFrames=Math.max(0,f),this._onEvict=S}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(a){return this._blocks.has(a)}offset(a){return this._blocks.get(a)?.offset}allocate(a,f){let S=this._blocks.get(a);if(S)return S.offset;let m=this._allocator.allocate(f);if(!m){if(this._evictAllCooled(),m=this._allocator.allocate(f),!m)return null}return this._blocks.set(a,m),m.offset}pin(a,f){let S=this.allocate(a,f);if(S!==null)this._pinned.add(a);return S}free(a){if(this._pinned.has(a))return;let f=this._blocks.get(a);if(!f)return;this._allocator.free(f),this._blocks.delete(a),this._cooldown.delete(a)}compact(){let a=new Map;for(let[S,m]of Array.from(this._blocks))a.set(S,m.offset);this._allocator.defrag(0);let f=[];for(let[S,m]of Array.from(this._blocks)){let y=a.get(S);if(y!==m.offset)f.push({file:S,oldOffset:y,newOffset:m.offset,count:m.size})}return f}getResidentBlocks(){let a=[];for(let[f,S]of Array.from(this._blocks))a.push({file:f,offset:S.offset,count:S.size});return a}scheduleEviction(a){if(this._pinned.has(a)||!this._blocks.has(a))return;this._cooldown.set(a,this._cooldownFrames)}cancelEviction(a){this._cooldown.delete(a)}tick(){if(this._cooldown.size===0)return[];let a=[];for(let[f,S]of Array.from(this._cooldown))if(S<=1)a.push(f);else this._cooldown.set(f,S-1);for(let f of a)this._evict(f);return a}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let a=Array.from(this._cooldown.keys());for(let f of a)this._evict(f)}_evict(a){let f=this._blocks.get(a);if(f)this._allocator.free(f),this._blocks.delete(a);this._cooldown.delete(a),this._onEvict(a)}}function Qt(a,f,S,m,y){if(!Number.isSafeInteger(m)||m<0||!Number.isSafeInteger(y)||y<m)throw RangeError("Invalid residency page ID range.");let b=new Map,M=new Set,P=[],D=new Set;for(let B of a){if(D.has(B))continue;D.add(B);let O=B.file;if(!Number.isSafeInteger(O)||O<0||O>=m){if(!M.has(O))M.add(O),P.push(O);continue}if(S.has(O))continue;let T=f.get(O);if(T===void 0)continue;if(!Number.isSafeInteger(T)||T<0||!Number.isSafeInteger(B.offset)||B.offset<0||!Number.isSafeInteger(B.count)||B.count<0||B.offset+B.count>T){if(!M.has(O))M.add(O),P.push(O);continue}if(B.count===0)continue;let A=b.get(O);if(!A)A=[],b.set(O,A);A.push(B)}let R=[];for(let[B,O]of b){if(M.has(B))continue;O.sort((A,z)=>A.offset-z.offset||A.count-z.count);let T;for(let A of O)if(T&&A.offset<T.source.offset+T.source.count)T.source={file:B,offset:T.source.offset,count:Math.max(T.source.offset+T.source.count,A.offset+A.count)-T.source.offset},T.entries.push(A);else{let z=y+R.length;if(!Number.isSafeInteger(z))throw RangeError("Residency page ID overflow.");T={id:z,source:{file:B,offset:A.offset,count:A.count},entries:[A]},R.push(T)}}return{pages:R,invalidFiles:P}}var ws=Math.tan(22.5*Math.PI/180),Cs=-2,De=-1,Ps=84,Re=4,Ds=5,Rs=32,Bs=512,Ts=256,st=new l,Es=new e,As=new e,Kt=new e,Os=new e(0,0,1),es=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],Jt=es.length*2,Be=[new x(1,0.2,0.2,1),new x(1,0.6,0.1,1),new x(1,1,0.2,1),new x(0.3,1,0.3,1),new x(0.2,1,1,1),new x(0.4,0.5,1,1),new x(0.9,0.4,1,1),new x(1,1,1,1)];class ne extends vs{static IsLODMetadata(a){if(typeof a!=="object"||a===null)return!1;let f=a;return typeof f.lodLevels==="number"&&Array.isArray(f.filenames)&&typeof f.tree==="object"&&f.tree!==null}constructor(a,f,S,m,y={}){let b=ne._NormalizeResidentLimit(y.maxResidentSplats??0,"maxResidentSplats",!0),M=ne._NormalizeResidentLimit(y.memoryBudgetMb??0,"memoryBudgetMb",!1);if(y.rangePack&&!y.rangeResidency)throw Error("GaussianSplattingStream: rangePack requires rangeResidency.");super(a,null,m,!1);this._leafNodes=[],this._lod0SplatCount=Object.freeze({status:"pending"}),this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=0.5,this._maxDetailLod=0,this._lodPixelThreshold=1,this._hostBudgetAllocation=null,this._frustumCulling=!0,this._frustumPlanes=[new _i(0,0,0,0),new _i(0,0,0,0),new _i(0,0,0,0),new _i(0,0,0,0),new _i(0,0,0,0),new _i(0,0,0,0)],this._cullCameraViewProj=new l,this._cullViewProj=new l,this._frustumScratch=[],this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._residencyPages=new Map,this._splitPacks=new Map,this._nextPageId=0,this._rangeSourcePack=null,this._activeRangeSource=null,this._rangeSourcePackLoads=0,this._rangeSourcePackReuses=0,this._rangeSplitPackLoads=0,this._baseFileIds=new Set,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._minimumResidentSplats=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._metadataReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPositions=[],this._lastLodSignature="",this._forceLodUpdate=!1,this._boundsMin=new e(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new e(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource="optimal",this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=y.rangeResidency?ne._CloneLodMetadata(f):f,this._nextPageId=f.filenames.length,this._rootUrl=S,this._streamOptions=y,this._hostCompound=y.hostCompound??null,this._decodeSh=y.decodeSh??!0,this._needsRotationScale=y.needsRotationScale??!1;let P=Math.max(0,f.lodLevels-1);if(this._lodRangeMax=P,y.lodBaseDistance!==void 0)this._lodBaseDistance=Math.max(0.1,y.lodBaseDistance);if(y.lodMultiplier!==void 0)this._lodMultiplier=Math.max(1.2,y.lodMultiplier);if(y.lodBehindPenalty!==void 0)this._lodBehindPenalty=Math.max(1,y.lodBehindPenalty);if(y.lodRangeMin!==void 0)this._lodRangeMin=Math.max(0,Math.min(y.lodRangeMin,P));if(y.lodRangeMax!==void 0)this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(y.lodRangeMax,P));if(y.maxDecodesPerFrame!==void 0)this._maxDecodesPerFrame=Math.max(1,y.maxDecodesPerFrame);if(y.lodCooldownFrames!==void 0)this._lodCooldownFrames=Math.max(0,y.lodCooldownFrames);if(y.lodUpdateInterval!==void 0)this._lodUpdateInterval=Math.max(1,y.lodUpdateInterval);if(y.lodUpdateDistance!==void 0)this._lodUpdateDistance=Math.max(0,y.lodUpdateDistance);if(y.maxDetailLod!==void 0)this._maxDetailLod=Math.max(0,Math.floor(y.maxDetailLod));if(this._splatBudget=this._resolveSplatBudget(y.splatBudget),y.frustumCulling!==void 0)this._frustumCulling=y.frustumCulling;if(y.debugLodSource)this._debugLodSource=y.debugLodSource;if(y.evictionCooldownFrames!==void 0)this._evictionCooldownFrames=Math.max(0,Math.floor(y.evictionCooldownFrames));if(this._maxResidentSplats=b,this._memoryBudgetMb=M,this._downloadManager=new Je({maxConcurrent:y.maxConcurrentDownloads,maxRetries:y.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((R,B)=>{this._partReadyResolve=R,this._partReadyReject=B}),this._partReadyPromise.catch(()=>{});let D=this._hostCompound.onDisposeObservable.add(()=>{if(!this._disposed)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(D)}if(this._collectLodEntries(this._metadata.tree),y.debugDisplay)this.debugDisplay=!0;this._streamAllAsync().then(()=>{let D=this._partReadySettled;if(this._rejectPartReady("GaussianSplattingStream: stream produced no splats."),!D&&this._hostCompound&&!this._disposed)this._disposeAndReclaim()},(D)=>{if(this._lod0SplatCount=Object.freeze({status:"unavailable"}),c.Error("GaussianSplattingStream: streaming failed: "+(D?.message??D)),this._rejectPartReady("GaussianSplattingStream: streaming failed: "+(D?.message??D)),!this._disposed)this._disposeAndReclaim()})}getClassName(){return"GaussianSplattingStream"}isReady(a=!1){if(this._hostCompound)return!0;return super.isReady(a)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyResolve?.()}_rejectPartReady(a){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyReject?.(Error(a))}async whenSettledAsync(a=3){if(this._disposed)return;this._forceLodUpdate=!0;let f=Math.max(1,a),S=this._scene,m=0,y=()=>{if(this._isLoadingIdle()&&this._sinkIsDepthSortSettled)return++m>=f;return m=0,!1};if(S.getEngine().activeRenderLoops.length>0){await new Promise((P)=>{let D=null;D=S.onAfterRenderObservable.add(()=>{if(this._disposed||y()){if(D)S.onAfterRenderObservable.remove(D),D=null;P()}})});return}let b=S.getEngine(),M=globalThis.requestAnimationFrame;while(!this._disposed){if(b.beginFrame(),S.render(),b.endFrame(),y())return;await new Promise((P)=>{if(typeof M==="function")M(()=>P());else setTimeout(P,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._metadataReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(a){let f=Math.max(0,Math.floor(a));if(this._maxDetailLod===f)return;this._maxDetailLod=f,this._forceLodUpdate=!0}get splatBudget(){return this._splatBudget}set splatBudget(a){let f=a>0?Math.floor(a):0;if(f===this._splatBudget)return;this._splatBudget=f,this._forceLodUpdate=!0}get effectiveSplatBudget(){return this._effectiveSplatBudget()}get residentSplatBudget(){return this._residentBudget}get minimumResidentSplats(){return this._minimumResidentSplats}get lod0SplatCount(){return this._lod0SplatCount}getSourceRange(a){return this._residencyPages.get(a)??null}isSplitPage(a){return this._splitPacks.has(a)}cancelRangeLoads(a,f=[]){let S=new Set;for(let m of a){let y=this._residencyPages.get(m);if(!y||!this._loadingFiles.has(m))continue;if(this._cancelledDecodes.add(m),this._splitPacks.has(m))this._downloadManager.cancelGroup(m);else S.add(y.file)}if(S.size===0)return;for(let m of f)S.delete(m);for(let m of this._loadingFiles){if(this._cancelledDecodes.has(m)||this._splitPacks.has(m))continue;let y=this._residencyPages.get(m);if(y)S.delete(y.file)}for(let m of S)this._downloadManager.cancelGroup(m)}get rangeResidencyStats(){return{enabled:this._streamOptions.rangeResidency===!0,pages:this._residencyPages.size,sourcePackLoads:this._rangeSourcePackLoads,sourcePackReuses:this._rangeSourcePackReuses,splitPackLoads:this._rangeSplitPackLoads,cachedSourceSplats:this._rangeSourcePack?.pack.splatCount??0}}_resolveSplatBudget(a){if(a===void 0)return 0;if(a==="auto")return this._computeDefaultSplatBudget();return a>0?Math.floor(a):0}_computeDefaultSplatBudget(){if(!this._scene.getEngine().hostInformation?.isMobile)return 2500000;if(typeof navigator<"u"&&navigator.userAgent&&/iPad|iPhone|iPod/.test(navigator.userAgent))return 1500000;return 1e6}_effectiveSplatBudget(){if(this._hostBudgetAllocation!==null){let a=Math.max(1,this._hostBudgetAllocation);return this._residentBudget>0?Math.min(a,this._residentBudget):a}if(this._splatBudget<=0)return 0;return this._residentBudget>0?Math.min(this._splatBudget,this._residentBudget):this._splatBudget}_splatBudgetEnabled(){return this._effectiveSplatBudget()>0}getBudgetDemand(){if(!this._baseLayerReady)return 0;let a=this._environmentSplatCount();for(let f of this._leafNodes){let S=f.optimalLod??f.baseLod;a+=this._countAtLevel(f,this._cappedLevelForNode(f,S))}return a}setBudgetAllocation(a){if(a===null){if(this._hostBudgetAllocation!==null)this._hostBudgetAllocation=null,this._forceLodUpdate=!0;return}let f=this._hostBudgetAllocation;if(this._hostBudgetAllocation=a,f===null||a!==f)this._forceLodUpdate=!0}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(a){if(this._frustumCulling===a)return;this._frustumCulling=a,this._forceLodUpdate=!0}get debugDisplay(){return this._debugDisplay}set debugDisplay(a){if(this._debugDisplay===a)return;if(this._debugDisplay=a,a)this._refreshDebugDisplay();else this._clearDebugDisplay()}get debugLodSource(){return this._debugLodSource}set debugLodSource(a){if(this._debugLodSource===a)return;if(this._debugLodSource=a,this._debugDisplay)this._refreshDebugDisplay()}dispose(a){if(this._disposed)return;if(this._disposed=!0,this._rejectPartReady("GaussianSplattingStream: disposed before the part was ready."),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._hostCompound&&!this._hostCompound.isDisposed())this._hostCompound.unregisterLodBudgetParticipant(this);if(this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed())this._hostCompound.removePart(this._host.partIndex);if(this._host=null,this._lodObserver)this._scene.onBeforeRenderObservable.remove(this._lodObserver),this._lodObserver=null;this._clearDebugDisplay(),this._downloadManager.dispose(),this._disposeRangeSourcePack(),this._splitPacks.clear(),this._residencyPages.clear(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(a)}_disposeAndReclaim(){let a=this._hostCompound,f=!!this._host&&!this._partReleasedByHost;if(this.dispose(),f&&a&&!a.isDisposed())a.compactAtlas()}_getEffectiveWorldMatrix(a){if(this._host)return this._host.proxy.computeWorldMatrix(a);return this.computeWorldMatrix(a)}_getActiveLodCameras(){return((this._scene.activeCameras?.length)?this._scene.activeCameras:this._scene.activeCamera?[this._scene.activeCamera]:[]).filter((f)=>!!f)}evaluateOptimalLods(a=null){let f=a?[a]:this._getActiveLodCameras();if(f.length===0||this._leafNodes.length===0)return;let S=Math.max(0,this._metadata.lodLevels-1),m=this._lodBaseDistance,y=this._lodMultiplier,b=this._lodBehindPenalty,M=this._lodRangeMin,P=this._lodRangeMax,D=this._splatBudgetEnabled(),R=this._scene.getEngine().getRenderHeight()||1,B=this._scene.getEngine();this._getEffectiveWorldMatrix(!1).invertToRef(st);let O=f.map((T)=>{let A=B.getAspectRatio(T)||1,z=Math.tan(T.fov*0.5);if(T.fovMode===Z.FOVMODE_HORIZONTAL_FIXED)z/=A;let V=z*A,j=Math.min(z,V)/ws,E=R*(T.viewport?T.viewport.height:1),q=e.TransformCoordinatesToRef(T.globalPosition,st,Es),G={px:q.x,py:q.y,pz:q.z,fwx:0,fwy:0,fwz:0,fovScale:j,tanHalfV:z,pixelHeight:E};if(b>1){T.getDirectionToRef(Os,Kt);let Y=e.TransformNormalToRef(Kt,st,As);Y.normalize(),G.fwx=Y.x,G.fwy=Y.y,G.fwz=Y.z}return G});for(let T of this._leafNodes){let A=T.bound.min,z=T.bound.max,V=(A[0]+z[0])*0.5,j=(A[1]+z[1])*0.5,E=(A[2]+z[2])*0.5,q=z[0]-A[0],G=z[1]-A[1],Y=z[2]-A[2],W=0.5*Math.sqrt(q*q+G*G+Y*Y),k=Number.POSITIVE_INFINITY,H=0;for(let N of O){let K=N.px<A[0]?A[0]:N.px>z[0]?z[0]:N.px,se=N.py<A[1]?A[1]:N.py>z[1]?z[1]:N.py,U=N.pz<A[2]?A[2]:N.pz>z[2]?z[2]:N.pz,J=K-N.px,ee=se-N.py,Q=U-N.pz,te=Math.sqrt(J*J+ee*ee+Q*Q),re=te;if(b>1&&te>0.01){let oe=(N.fwx*J+N.fwy*ee+N.fwz*Q)/te;if(oe<0)re=te*(1+-oe*(b-1))}let ie=re*N.fovScale,ae;if(S===0||ie<m)ae=0;else{ae=S;while(ae>1&&ie<m*Math.pow(y,ae-1))ae--}if(ae<k)k=ae;if(D){let oe=V-N.px,le=j-N.py,ue=E-N.pz,fe=Math.sqrt(oe*oe+le*le+ue*ue),pe=W*N.pixelHeight/(Math.max(fe,0.0001)*N.tanHalfV);if(pe>H)H=pe}}if(k<M)k=M;else if(k>P)k=P;if(this._frustumCulling&&T.inFrustum===!1)k=P;if(T.optimalLod=k,D)T.pixelSize=H}}_displayedLodLevel(a){if(this._debugLodSource==="optimal")return a.optimalLod??a.activeLod??0;return a.activeLod??0}_refreshDebugDisplay(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();this._buildDebugMesh();let a=this._debugDisplay;if(a&&!this._debugObserver)this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame());else if(!a&&this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null}_onDebugFrame(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();if(this._computeDebugSignature()!==this._debugSignature)this._updateDebugColors()}_buildDebugMesh(){if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null;let a=[],f=[];for(let m of this._leafNodes){let y=Be[this._displayedLodLevel(m)%Be.length],b=m.bound.min,M=m.bound.max,P=[new e(b[0],b[1],b[2]),new e(M[0],b[1],b[2]),new e(M[0],M[1],b[2]),new e(b[0],M[1],b[2]),new e(b[0],b[1],M[2]),new e(M[0],b[1],M[2]),new e(M[0],M[1],M[2]),new e(b[0],M[1],M[2])];for(let D of es)a.push([P[D[0]],P[D[1]]]),f.push([y,y])}if(this._debugSignature=this._computeDebugSignature(),a.length===0)return;let S=_n(this.name+"_lodDebug",{lines:a,colors:f,updatable:!0,useVertexAlpha:!1},this._scene);S.parent=this,S.isPickable=!1,S.doNotSerialize=!0,S.reservedDataStore={hidden:!0},this._debugMesh=S,this._debugColorData=new Float32Array(this._leafNodes.length*Jt*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let a=this._debugColorData,f=0;for(let S of this._leafNodes){let m=Be[this._displayedLodLevel(S)%Be.length];for(let y=0;y<Jt;y++)a[f++]=m.r,a[f++]=m.g,a[f++]=m.b,a[f++]=m.a}this._debugMesh.updateVerticesData(n.ColorKind,a),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let a=0;for(let f of this._leafNodes)a=a*31+this._displayedLodLevel(f)|0;return a}_clearDebugDisplay(){if(this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null;if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null,this._debugSignature=0}_collectLodEntries(a){if(a.children){for(let T of a.children)this._collectLodEntries(T);return}if(!a.lods)return;let f=a.bound?.min,S=a.bound?.max;if(!f||!S||f.length<3||S.length<3||!f.every((T)=>Number.isFinite(T))||!S.every((T)=>Number.isFinite(T)))return;let m=S[0]-f[0],y=S[1]-f[1],b=S[2]-f[2],M=Math.sqrt(m*m+y*y+b*b);if(!Number.isFinite(M)||M<=0)return;let P=Math.floor(Number(this._metadata.lodLevels)),D=Number.isFinite(P)&&P>0?P-1:0,R=[];for(let T of Object.keys(a.lods)){let A=Number(T),z=a.lods[T],V=z?Math.floor(Number(z.count)):NaN;if(Number.isInteger(A)&&String(A)===T&&A>=0&&A<=D&&z&&Number.isFinite(V)&&V>0){if(this._streamOptions.rangeResidency&&(!Number.isSafeInteger(z.file)||z.file<0||z.file>=this._metadata.filenames.length)){c.Warn(`GaussianSplattingStream: invalid LOD file index ${z.file}; skipping level ${A}.`);continue}z.count=V,R.push(A)}}if(R.length===0)return;R.sort((T,A)=>T-A);let B=[],O=1/0;for(let T of R){let A=a.lods[String(T)].count;if(A<=O)B.push(T),O=A}a.availableLevels=B,a.baseLod=B[B.length-1],a.activeLod=void 0,a.lodCooldown=0,a.inFrustum=!0,a.cullBounds=new di(e.FromArray(f),e.FromArray(S)),this._leafNodes.push(a)}async _streamAllAsync(){let a=this._collectAllFileIds(),f=this._collectBaseFileIds();this._baseFileIds.clear();for(let D of f)this._baseFileIds.add(D);if(this._leafNodes.length>0&&f.length===0)throw Error("GaussianSplattingStream: no valid coarse source files were referenced.");let S=a.length>Rs&&f.length<a.length;if(S&&this._decodeSh)this._streamShDegree=Re,this._shTextureCount=Ds;let m=S?f:a,y=await this._gatherCountsAsync(m);if(this._disposed)return;for(let D of f){let R=this._fileCounts.get(D);if(!this._fileMeta.has(D)||R===void 0||R<=0)throw Error(`GaussianSplattingStream: required coarse metadata for file ${D} is unavailable or invalid.`)}if(this._resolveMinimumResidentSplats(f,y),!S)this._resolveLod0SplatCount(),this._metadataReady=!0;let b=null;if(!S){b=1+y;for(let D of a){let R=this._fileCounts.get(D);if(R!==void 0&&R>0)b=ne._SafeAddCounts(b,R,"stream capacity")}}if(this._minimumResidentSplats<=1)throw Error("GaussianSplattingStream: stream produced no splats.");let M=0;for(let D of f)M=Math.max(M,this._fileCounts.get(D));let P=this._resolveResidentBudget(b,M);if(this._evictionEnabled=S||b!==null&&P<b,this._residency=new tt(P,this._evictionCooldownFrames,(D)=>this._onFileEvicted(D)),this._residency.pin(Cs,1),y>0){let D=this._residency.allocate(De,y);if(D!==null)this._environmentRange={offset:D,count:y};else c.Warn("GaussianSplattingStream: environment does not fit the memory budget; skipping it."),this._environmentFiles=null}if(this._hostCompound){let D=l.Compose(new e(1,-1,1),d.RotationYawPitchRoll(0,-Math.PI/2,0),e.ZeroReadOnly),R=this._hostCompound.reserveStreamingPart(P,D,this.name+"_part",this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=R,this._positionBase=R.base,this._hostCompound.registerLodBudgetParticipant(this);let B=this._hostCompound,O=B.onPartRemovedObservable.add((V)=>{if(!this._disposed&&this._host&&V===this._host.partIndex)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubRemove=()=>B.onPartRemovedObservable.remove(O);let T=this._shTextureCount>0&&R.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:R.shMrtAtlas}:void 0,A=this._needsRotationScale&&R.rotMrtAtlas?{externalMrt:R.rotMrtAtlas}:void 0;this._workBuffer=new Pe(this._scene,R.capacity,{mrt:R.mrtAtlas,width:R.atlasWidth,baseOffset:R.base},T,A),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=R.splatPositions,this._vertexCount=P;let z=this._workBuffer;this._unsubBeforeRebuild=R.onBeforeAtlasRebuild(()=>{z.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=R.onAfterAtlasRebuild(()=>{if(R.mrtAtlas)z.rebindAtlas(R.mrtAtlas);if(z.rebindShAtlas(R.shMrtAtlas),z.rebindRotAtlas(R.rotMrtAtlas),this._positionBase=R.base,z.setBaseOffset(R.base),z.restoreRegion(),this._splatPositions=R.splatPositions,this._positionSnapshot&&this._splatPositions)this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null}),R.setActiveRanges([])}else{let D=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,R=this._needsRotationScale?{}:void 0;this._workBuffer=new Pe(this._scene,P,void 0,D,R),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let B=new Float32Array(P*4),O=this._workBuffer.textures,T=D?this._workBuffer.shTextures:void 0,A=R?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(O[0],O[1],O[2],O[3],B,P,T,this._streamShDegree,A),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer){if(await this._waitForCanBackupAsync(this._workBuffer),this._disposed)return}if(this._environmentRange&&this._environmentFiles)await this._decodeEnvironmentAsync();this._environmentFiles=null;for(let D of f){if(this._disposed)return;if(!await this._decodeFileAsync(D))throw Error(`GaussianSplattingStream: required coarse file ${D} failed to decode.`)}if(this._disposed)return;for(let D of this._leafNodes)if(D.activeLod!==D.baseLod||D.activeFile===void 0)throw Error("GaussianSplattingStream: the complete coarse layer could not be activated.");if(this._baseLayerReady=!0,this._resolvePartReady(),S){let D=a.filter((R)=>!this._baseFileIds.has(R));if(await this._gatherCountsAsync(D,!1),this._resolveLod0SplatCount(),this._metadataReady=!0,this._disposed)return}if(!this._lodObserver)this._lodObserver=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame())}async _waitForCanBackupAsync(a){for(let f=0;f<600&&!this._disposed;f++){if(a.canBackup)return;await new Promise((S)=>this._scene.onBeforeRenderObservable.addOnce(()=>S()))}if(!this._disposed&&!a.canBackup)c.Warn("GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.")}_resolveResidentBudget(a=null,f=0){let S=this._maxResidentSplats>0||this._memoryBudgetMb>0,m=this._maxResidentSplats>0?this._maxResidentSplats:Number.POSITIVE_INFINITY,y=this._bytesPerResidentSplat();if(this._memoryBudgetMb>0){let b=Math.floor(this._memoryBudgetMb*1024*1024/y);m=Math.min(m,b)}if(!S&&a!==null)m=a;else if(!S){let b=this._scene.getEngine().hostInformation?.isMobile?Ts:Bs,M=Math.floor(b*1024*1024/y),P=Math.max(0,Math.floor(f)),D=ne._SafeAddCounts(this._minimumResidentSplats,P,"automatic resident capacity");m=Math.max(M,D)}else if(m<this._minimumResidentSplats)c.Warn(`GaussianSplattingStream: the requested initial residency (${m} splats) is below the complete coarse minimum (${this._minimumResidentSplats}); using the minimum.`);if(m=Math.max(this._minimumResidentSplats,Math.floor(m)),a!==null)m=Math.min(m,a);if(a!==null||this._minimumResidentSplats>0){let b=Math.floor(this._scene.getEngine().getCaps().maxTextureSize),M=b*b;if(!Number.isSafeInteger(M)||this._minimumResidentSplats>M)throw Error(`GaussianSplattingStream: minimum resident splat count ${this._minimumResidentSplats} exceeds the device texture capacity ${M}.`);if(m>M)m=M;if(m<this._minimumResidentSplats)throw Error(`GaussianSplattingStream: minimum resident splat count ${this._minimumResidentSplats} exceeds the device texture capacity ${M}.`)}if(!Number.isSafeInteger(m)||m<this._minimumResidentSplats||m<1)throw Error("GaussianSplattingStream: resolved resident capacity is invalid.");return this._residentBudget=m,m}_bytesPerResidentSplat(){let a=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48;return Ps+this._shTextureCount*16+(this._needsRotationScale?a:0)}_collectAllFileIds(){let a=new Set;for(let f of this._leafNodes)for(let S of f.availableLevels){let m=f.lods[String(S)];if(m)a.add(m.file)}return Array.from(a).sort((f,S)=>f-S)}_collectBaseFileIds(){let a=new Set;for(let f of this._leafNodes){let S=f.lods?.[String(f.baseLod)];if(S)a.add(S.file)}return Array.from(a).sort((f,S)=>f-S)}_resolveMinimumResidentSplats(a,f){let S=ne._SafeAddCounts(1,Math.max(0,Math.floor(f)),"minimum resident splats");for(let m of a){let y=this._fileCounts.get(m);if(y===void 0||!Number.isSafeInteger(y)||y<=0)throw Error(`GaussianSplattingStream: required coarse metadata for file ${m} is unavailable or invalid.`);S=ne._SafeAddCounts(S,y,"minimum resident splats")}this._minimumResidentSplats=S}_resolveLod0SplatCount(){let a=0,f=!1;for(let S of this._leafNodes){if(S.availableLevels?.[0]!==0)continue;let m=S.lods?.["0"];if(!m){this._lod0SplatCount=Object.freeze({status:"unavailable"});return}if(f=!0,!this._fileCounts.has(m.file)||!this._fileMeta.has(m.file)){this._lod0SplatCount=Object.freeze({status:"unavailable"});return}if(a+=m.count,!Number.isSafeInteger(a)){this._lod0SplatCount=Object.freeze({status:"unavailable"});return}}this._lod0SplatCount=f?Object.freeze({status:"available",count:a}):Object.freeze({status:"unavailable"})}async _gatherCountsAsync(a,f=!0){let S=0,m=0,y=0,b=(M)=>{let P=ne._GetShInfo(M);if(P.degree>m)m=P.degree;if(P.coeffs>y)y=P.coeffs};if(f&&this._metadata.environment)try{let M=this._rootUrl+this._metadata.environment,P=await this._downloadManager.loadFileAsync(M),D=await this._unzipAsync(new Uint8Array(P)),R=D.get("meta.json");if(R){let B=JSON.parse(new TextDecoder().decode(R));S=ne._GetSplatCount(B),b(B),this._environmentFiles=D}}catch(M){c.Warn("GaussianSplattingStream: failed to load environment: "+(M?.message??M))}await Promise.all(a.map(async(M)=>{let P=this._metadata.filenames[M];if(!P){c.Warn(`GaussianSplattingStream: missing filename for file index ${M}.`);return}try{let D=this._rootUrl+P,R=D.substring(0,D.lastIndexOf("/")+1),B=await this._downloadManager.loadFileAsync(D),O=JSON.parse(new TextDecoder().decode(new Uint8Array(B)));this._fileCounts.set(M,ne._GetSplatCount(O)),this._fileMeta.set(M,{sogData:O,subRootUrl:R})}catch(D){c.Warn(`GaussianSplattingStream: failed to load metadata for ${P}: ${D?.message??D}`)}}));for(let{sogData:M}of this._fileMeta.values())b(M);if(this._decodeSh&&m>0&&y>0)this._streamShDegree=Math.max(this._streamShDegree,m),this._shTextureCount=Math.max(this._shTextureCount,Math.ceil(y*3/16));if(this._streamOptions.rangeResidency)this._initializeResidencyPages(a);return S}_initializeResidencyPages(a){let f=new Set(a),S=[];for(let b of this._leafNodes)for(let M of b.availableLevels){let P=b.lods[String(M)];if(f.has(P.file))S.push(P)}let{pages:m,invalidFiles:y}=Qt(S,this._fileCounts,this._baseFileIds,this._metadata.filenames.length,this._nextPageId);for(let b of y)c.Warn(`GaussianSplattingStream: invalid LOD interval in file ${b}; keeping it as one resident file.`);for(let b of m){let M=this._fileMeta.get(b.source.file);this._fileMeta.set(b.id,M),this._fileCounts.set(b.id,b.source.count);let P=Object.freeze({...b.source});this._residencyPages.set(b.id,P);let D=this._resolveSplitPack(b.id,P,M.sogData);if(D)this._splitPacks.set(b.id,D);for(let R of b.entries)R.file=b.id,R.offset-=b.source.offset}if(this._nextPageId+=m.length,m.length)this._forceLodUpdate=!0}_resolveSplitPack(a,f,S){let m=this._streamOptions.rangePack;if(!m)return null;try{let y=m(f,S);if(!y)return null;if(ne._GetSplatCount(y.sogData)!==f.count)return c.Warn(`GaussianSplattingStream: split pack for page ${a} does not hold ${f.count} splats; using the source pack.`),null;return y}catch(y){return c.Warn(`GaussianSplattingStream: rangePack failed for page ${a}: ${y?.message??y}; using the source pack.`),null}}async _loadPrefetchedPackAsync(a,f){let S=a.sogData,m=new Set([...S.means?.files??[],...S.scales?.files??[],...S.quats?.files??[],...S.sh0?.files??[],...S.shN?.files??[]]),y=new Map;if(await Promise.all(Array.from(m,async(M)=>{y.set(M,new Uint8Array(await this._downloadManager.loadFileAsync(a.subRootUrl+M,f)))})),this._disposed)return null;y.set("meta.json",new TextEncoder().encode(JSON.stringify(S)));let b=(await ve(y,"",this._scene,!this._useGpuPositionReadback)).sogTextures;if(!b)return null;if(this._disposed)return ne._DisposePack(b),null;return b}async _getRangeSourcePackAsync(a,f){if(this._rangeSourcePack?.file===a)return this._rangeSourcePackReuses++,this._rangeSourcePack.pack;this._disposeRangeSourcePack();let S=await this._loadPrefetchedPackAsync(f,a);if(!S)return null;if(this._disposed)return ne._DisposePack(S),null;return this._rangeSourcePackLoads++,this._rangeSourcePack={file:a,pack:S},S}_disposeRangeSourcePack(){if(this._rangeSourcePack)ne._DisposePack(this._rangeSourcePack.pack),this._rangeSourcePack=null}static _CloneLodMetadata(a){return{...a,tree:ne._CloneLodNode(a.tree)}}static _CloneLodNode(a){let f={};if(a.bound)f.bound={min:Array.isArray(a.bound.min)?a.bound.min.slice():a.bound.min,max:Array.isArray(a.bound.max)?a.bound.max.slice():a.bound.max};if(Array.isArray(a.children))f.children=a.children.map((S)=>ne._CloneLodNode(S));if(a.lods){f.lods={};for(let S of Object.keys(a.lods)){let m=a.lods[S];f.lods[S]=m&&typeof m==="object"?{...m}:m}}return f}_enqueueDecode(a){if(this._decodedFiles.has(a)||this._loadingFiles.has(a)||!this._fileMeta.has(a))return;if(this._decodeQueue.indexOf(a)===-1)this._decodeQueue.push(a)}_pumpDecodeQueue(){let a=0;while(this._decodeQueue.length>0&&a<this._maxDecodesPerFrame){let f=this._decodeQueue.shift();if(this._decodedFiles.has(f)||this._loadingFiles.has(f))continue;a++,this._decodeFileAsync(f).catch((S)=>{c.Warn("GaussianSplattingStream: decode failed: "+(S?.message??S))})}}_applyPositions(a,f,S){this._splatPositions.set(a,(this._positionBase+f)*4),this._updateBounds(a,S),this._sinkPostPositionsRange(f,S)}_sinkSetActiveRanges(a){if(this._host)this._host.setActiveRanges(a);else this.setSplatIndexRanges(a)}_sinkPostPositionsRange(a,f){if(this._host)this._host.postPositionsRange(a,f);else this._postWorkerPositionsRange(a,f)}_sinkNotifyDataChanged(){if(this._host)this._host.notifyDataChanged();else this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(a,f,S){if(this._readbackProbed=!0,!this._workBuffer)return;let m=Math.min(f,1024),y=!1;try{let b=await this._workBuffer.readCentersRangeAsync(a,m);if(this._disposed)return;if(b&&b.length>=m*4){y=!0;for(let M=0;M<m&&y;M++)for(let P=0;P<3;P++){let D=b[M*4+P],R=S[M*4+P];if(Math.abs(D-R)>0.01*(1+Math.abs(R))){y=!1;break}}}}catch{y=!1}this._useGpuPositionReadback=y,c.Log(y?"GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.":"GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.")}async _applyDecodedPositionsAsync(a,f,S,m=0){if(this._useGpuPositionReadback&&this._workBuffer){let b=await this._workBuffer.readCentersRangeAsync(f,S);if(this._disposed)return!1;if(b&&this._splatPositions)return this._applyPositions(b,f,S),!0}let y=a.positions.length>=(m+S)*4?a.positions.subarray(m*4,(m+S)*4):null;if(!y||!this._splatPositions)return!1;if(this._applyPositions(y,f,S),!this._readbackProbed&&this._readbackCandidate)await this._probeReadbackAsync(f,S,y);return!0}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let a=this._environmentRange,f=!1;try{let m=(await ve(this._environmentFiles,"",this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!m){c.Warn("GaussianSplattingStream: environment decoding produced no texture data.");return}try{if(this._disposed||!this._workBuffer)return;if(await this._workBuffer.decodeAsync(m,a.offset),this._disposed)return;let y=await this._applyDecodedPositionsAsync(m,a.offset,a.count);if(this._disposed)return;if(!y){c.Warn("GaussianSplattingStream: decoded positions could not be applied for the environment.");return}if(this._residency?.pin(De,a.count)!==a.offset)throw Error("GaussianSplattingStream: decoded environment could not be pinned.");f=!0,this._refreshActiveRanges()}finally{ne._DisposePack(m)}}catch(S){c.Warn("GaussianSplattingStream: failed to decode environment: "+(S?.message??S))}finally{if(!f)this._residency?.free(De),this._environmentRange=null}}async _decodeFileAsync(a){if(this._decodedFiles.has(a))return!0;if(this._loadingFiles.has(a)||!this._residency)return!1;let f=this._fileMeta.get(a),S=this._fileCounts.get(a);if(!f||S===void 0)return!1;this._loadingFiles.add(a),this._cancelledDecodes.delete(a);let m=!1,y=this._residencyPages.get(a),b=this._splitPacks.get(a),M=null;try{let P,D=!0;if(b)P=await this._loadPrefetchedPackAsync(b,a);else if(y){if(M=await this._acquireDecodeGateAsync(),this._disposed||this._cancelledDecodes.has(a))return!1;if(P=await this._getRangeSourcePackAsync(y.file,f),D=!1,P)this._activeRangeSource=y.file}else P=(await ve(f.sogData,f.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,a)).sogTextures??null;if(!P)return!1;if(b)this._rangeSplitPackLoads++;let R=y&&!b?y.offset:0;M??(M=await this._acquireDecodeGateAsync());try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(a))return!1;let B=this._residency;if(!B)return!1;let O=B.allocate(a,S);if(O===null)O=await this._relayoutAndAllocateAsync(a,S);if(O===null){if(!this._cancelledDecodes.has(a))c.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${a}.`);return!1}if(m=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(a))return!1;if(y)await this._workBuffer.decodeAsync(P,O,R,S);else await this._workBuffer.decodeAsync(P,O);if(this._disposed||this._cancelledDecodes.has(a))return!1;let T=await this._applyDecodedPositionsAsync(P,O,S,R);if(this._disposed||this._cancelledDecodes.has(a))return!1;if(!T)return c.Warn(`GaussianSplattingStream: decoded positions could not be applied for LOD file ${a}.`),!1;if(this._baseFileIds.has(a)){if(B.pin(a,S)!==O)throw Error(`GaussianSplattingStream: required coarse file ${a} could not be pinned.`)}if(this._decodedFiles.add(a),this._applyDesiredLods())this._refreshActiveRanges();return!0}finally{if(D)ne._DisposePack(P)}}catch(P){if(!this._cancelledDecodes.has(a))throw P;return!1}finally{if(y&&!b&&M)this._activeRangeSource=null;if(M?.(),m&&!this._decodedFiles.has(a))this._residency?.free(a);let P=this._cancelledDecodes.has(a);if(this._loadingFiles.delete(a),this._cancelledDecodes.delete(a),P&&!this._disposed&&(this._fileRefs.get(a)??0)>0)this._enqueueDecode(a)}}async _acquireDecodeGateAsync(){let a=this._decodeGate,f;return this._decodeGate=new Promise((S)=>{f=S}),await a,f}async _relayoutAndAllocateAsync(a,f){if(!this._residency||!this._workBuffer)return null;if(this._residency.freeSize<f)return null;return await new Promise((S)=>{let m=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(a)){S(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(m);return}this._performRelayout(),S(this._residency.allocate(a,f))};this._scene.onBeforeRenderObservable.addOnce(m)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let a=this._relayoutOldOffsets;a.clear();for(let P of this._residency.getResidentBlocks())a.set(P.file,P.offset);if(this._residency.compact().length===0)return;let S=this._residency.capacity;if(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==S)this._relayoutSrcIndex=new Float32Array(S);let m=this._relayoutSrcIndex;m.fill(-1);let y=this._residency.getResidentBlocks();for(let P of y){let D=a.get(P.file);for(let R=0;R<P.count;R++)m[P.offset+R]=D+R}this._workBuffer.relayoutSync(m);let b=this._splatPositions,M=this._positionBase;y.sort((P,D)=>P.offset-D.offset);for(let P of y){let D=a.get(P.file);if(D!==P.offset)b.copyWithin((M+P.offset)*4,(M+D)*4,(M+D+P.count)*4)}if(this._environmentRange){let P=this._residency.offset(De);if(P!==void 0)this._environmentRange.offset=P}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(a){this._decodedFiles.delete(a)}_cappedLevelForNode(a,f){let S=a.availableLevels,m=this._maxDetailLod,y=-1,b=Number.POSITIVE_INFINITY;for(let M of S){if(M<m)continue;let P=Math.abs(M-f);if(P<b)y=M,b=P}return y<0?a.baseLod:y}_computeTargetLevels(){let a=this._effectiveSplatBudget();if(a<=0){for(let m of this._leafNodes){let y=m.optimalLod??m.baseLod;m.targetLevel=this._cappedLevelForNode(m,y)}return}let f=Math.max(0,a-this._environmentSplatCount());this._convergePixelThreshold(f);let S=this._lodPixelThreshold;for(let m of this._leafNodes)m.targetLevel=this._budgetedLevel(m,S)}_environmentSplatCount(){let a=this._environmentRange?Math.floor(Number(this._environmentRange.count)):0;return Number.isFinite(a)&&a>0?a:0}_budgetedLevel(a,f){let S=a.optimalLod??a.baseLod,m=a.pixelSize??0,y=0;if(m>0&&f>m)y=Math.max(0,Math.round(Math.log(f/m)/Math.log(this._lodMultiplier)));return this._cappedLevelForNode(a,S+y)}_countAtLevel(a,f){let S=a.lods[String(f)];return S?S.count:0}_totalSplatsAtThreshold(a){let f=0;for(let S of this._leafNodes)f+=this._countAtLevel(S,this._budgetedLevel(S,a));return f}_convergePixelThreshold(a){if(this._totalSplatsAtThreshold(1)<=a){this._lodPixelThreshold=1;return}let S=1;for(let P of this._leafNodes)if(P.pixelSize&&P.pixelSize>S)S=P.pixelSize;let m=Math.min(32,Math.max(1,this._metadata.lodLevels)),y=S*Math.pow(this._lodMultiplier,m+1);if(this._totalSplatsAtThreshold(y)>a){this._lodPixelThreshold=y;return}let b=1,M=y;for(let P=0;P<40&&M-b>0.001*M;P++){let D=0.5*(b+M);if(this._totalSplatsAtThreshold(D)<=a)M=D;else b=D}this._lodPixelThreshold=M}_residentLevelAtLeast(a,f){for(let S of a.availableLevels)if(S>=f&&this._decodedFiles.has(a.lods[String(S)].file))return S;return null}_applyDesiredLods(){let a=!1;for(let f of this._leafNodes){let S=f.targetLevel??f.baseLod;if(this._splatBudgetEnabled()&&f.activeLod!==void 0&&f.activeLod<S){let y=this._residentLevelAtLeast(f,S);if(y!==null&&y!==f.activeLod)this._switchActiveFile(f,f.lods[String(y)].file),f.activeLod=y,f.lodCooldown=this._lodCooldownFrames,a=!0}if(f.lodCooldown&&f.lodCooldown>0)continue;let m;if(S!==f.activeLod){let y=f.lods[String(S)];if(y)if(this._decodedFiles.has(y.file))this._switchActiveFile(f,y.file),f.activeLod=S,f.lodCooldown=this._lodCooldownFrames,a=!0;else m=y.file}if(f.pendingFile!==m){if(f.pendingFile!==void 0)this._releaseFileRef(f.pendingFile);if(m!==void 0)this._acquirePendingFile(m);f.pendingFile=m}}return a}_switchActiveFile(a,f){if(a.activeFile===f)return;if(a.activeFile!==void 0)this._releaseFileRef(a.activeFile);this._acquireFileRef(f),a.activeFile=f}_acquireFileRef(a){let f=(this._fileRefs.get(a)??0)+1;if(this._fileRefs.set(a,f),f===1)this._residency?.cancelEviction(a)}_acquirePendingFile(a){this._acquireFileRef(a),this._enqueueDecode(a)}_releaseFileRef(a){let f=(this._fileRefs.get(a)??0)-1;if(f>0){this._fileRefs.set(a,f);return}if(this._fileRefs.delete(a),this._decodedFiles.has(a)){if(this._evictionEnabled)this._residency?.scheduleEviction(a);return}let S=this._decodeQueue.indexOf(a);if(S!==-1)this._decodeQueue.splice(S,1);if(this._loadingFiles.has(a)){let m=this._residencyPages.get(a);if(m){let y=!1;for(let b of this._decodeQueue)if(!this._splitPacks.has(b)&&this._residencyPages.get(b)?.file===m.file){y=!0;break}this.cancelRangeLoads([a],y?[m.file]:[])}else this._cancelledDecodes.add(a),this._downloadManager.cancelGroup(a)}else if(S!==-1){let m=this._residencyPages.get(a);if(m&&!this._splitPacks.has(a)){let y=!1,b=!1;for(let M of this._loadingFiles){if(this._splitPacks.has(M)||this._residencyPages.get(M)?.file!==m.file)continue;if(this._cancelledDecodes.has(M))b=!0;else{y=!0;break}}if(b&&!y){for(let M of this._decodeQueue)if(!this._splitPacks.has(M)&&this._residencyPages.get(M)?.file===m.file){y=!0;break}if(!y)this._downloadManager.cancelGroup(m.file)}}}}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;if(this._rangeSourcePack){let m=this._rangeSourcePack.file,y=this._activeRangeSource===m;if(!y){for(let b of this._loadingFiles)if(!this._cancelledDecodes.has(b)&&!this._splitPacks.has(b)&&this._residencyPages.get(b)?.file===m){y=!0;break}}if(!y){for(let b of this._decodeQueue)if(!this._splitPacks.has(b)&&this._residencyPages.get(b)?.file===m){y=!0;break}}if(!y)this._disposeRangeSourcePack()}let a=!1;for(let m of this._leafNodes)if(m.lodCooldown&&m.lodCooldown>0){if(m.lodCooldown--,m.lodCooldown===0&&m.targetLevel!==void 0&&m.targetLevel!==m.activeLod)a=!0}if(this._evictionEnabled)this._residency?.tick();this._pumpDecodeQueue();let f=this._updateNodeFrustum(),S=this._forceLodUpdate||f||a;if(!S&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let m=this._getActiveLodCameras(),y=this._lodUpdateDistance;if(m.length!==this._lastLodCamPositions.length||this._computeLodSignature(m)!==this._lastLodSignature)S=!0;else for(let b=0;b<m.length;b++)if(e.DistanceSquared(m[b].globalPosition,this._lastLodCamPositions[b])>=y*y){S=!0;break}}if(S){this._forceLodUpdate=!1,this._framesSinceLodUpdate=0;let m=this._getActiveLodCameras();this._lastLodCamPositions.length=0;for(let y of m)this._lastLodCamPositions.push(y.globalPosition.clone());if(this._lastLodSignature=this._computeLodSignature(m),this.evaluateOptimalLods(),this._computeTargetLevels(),this._applyDesiredLods())this._refreshActiveRanges()}}_computeLodSignature(a){let f=this._scene.getEngine(),S=`${f.getRenderWidth()}x${f.getRenderHeight()}#${this._getEffectiveWorldMatrix(!1).updateFlag}`;for(let m of a){let y=m.viewport;S+=`|${m.uniqueId}:${m.fov}:${m.fovMode}:${y.x},${y.y},${y.width},${y.height}`}return S}_updateNodeFrustum(){let a=this._getActiveLodCameras(),f=!1;if(!this._frustumCulling||a.length===0){for(let b of this._leafNodes)if(b.inFrustum===!1)b.inFrustum=!0,f=!0;return f}let S=this._leafNodes,m=this._frustumScratch,y=this._getEffectiveWorldMatrix(!1);for(let b=0;b<S.length;b++)m[b]=!1;for(let b of a){b.getViewMatrix().multiplyToRef(b.getProjectionMatrix(),this._cullCameraViewProj),y.multiplyToRef(this._cullCameraViewProj,this._cullViewProj),fs.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);let M=!0;for(let P of this._frustumPlanes)if(!Number.isFinite(P.normal.x)||!Number.isFinite(P.normal.y)||!Number.isFinite(P.normal.z)||!Number.isFinite(P.d)||P.normal.lengthSquared()===0){M=!1;break}if(!M){for(let P=0;P<S.length;P++)m[P]=!0;continue}for(let P=0;P<S.length;P++)if(!m[P]&&S[P].cullBounds.isInFrustum(this._frustumPlanes))m[P]=!0}for(let b=0;b<S.length;b++)if(m[b]!==S[b].inFrustum)S[b].inFrustum=m[b],f=!0;return f}static _NormalizeResidentLimit(a,f,S){if(!Number.isFinite(a))throw RangeError(`GaussianSplattingStream: ${f} must be finite.`);if(a<=0)return 0;let m=S?Math.max(1,Math.floor(a)):a;if(m>Number.MAX_SAFE_INTEGER)throw RangeError(`GaussianSplattingStream: ${f} is outside the supported range.`);return m}static _SafeAddCounts(a,f,S){let m=a+f;if(!Number.isSafeInteger(a)||a<0||!Number.isSafeInteger(f)||f<0||!Number.isSafeInteger(m))throw Error(`GaussianSplattingStream: ${S} exceeds the supported integer range.`);return m}static _GetSplatCount(a){let f=a.count??(Array.isArray(a.means.shape)?a.means.shape[0]:0),S=Math.floor(Number(f));return Number.isFinite(S)&&S>0?S:0}static _GetShInfo(a){if(!a.shN)return{degree:0,coeffs:0};let f=0,S=a.shN.bands;if(typeof S==="number"&&Number.isFinite(S)&&S>0)f=Math.floor(S);else if(Array.isArray(a.shN.shape)&&Number.isFinite(a.shN.shape[1])&&a.shN.shape[1]>0){let m=Math.floor(a.shN.shape[1]/3);f=m>0?Math.round(Math.sqrt(m+1)-1):0}if(!(f>0))return{degree:0,coeffs:0};if(f>Re)c.Warn(`GaussianSplattingStream: SH degree ${f} exceeds the maximum supported (${Re}); clamping.`),f=Re;return{degree:f,coeffs:(f+1)**2-1}}static _DisposePack(a){a.meansTextureL.dispose(),a.meansTextureU.dispose(),a.scalesTexture.dispose(),a.quatsTexture.dispose(),a.sh0Texture.dispose(),a.shCentroidsTexture?.dispose(),a.shLabelsTexture?.dispose(),a.codebookTexture?.dispose()}_updateBounds(a,f){let S=this._boundsMin,m=this._boundsMax;for(let y=0;y<f;y++){let b=a[y*4+0],M=a[y*4+1],P=a[y*4+2];S.minimizeInPlaceFromFloats(b,M,P),m.maximizeInPlaceFromFloats(b,M,P)}if(this._host)this._host.expandBounds(S,m);else this.setBoundingInfo(new di(S,m))}_refreshActiveRanges(){let a=[];if(this._environmentRange)a.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let f of this._leafNodes){if(f.activeLod===void 0)continue;let S=f.lods[String(f.activeLod)];if(!S)continue;let m=this._residency?.offset(S.file);if(m===void 0)continue;a.push({offset:m+S.offset,count:S.count})}this._sinkSetActiveRanges(ne._CoalesceRanges(a))}static _CoalesceRanges(a){if(a.length<=1)return a;let f=a.slice().sort((m,y)=>m.offset-y.offset),S=[{offset:f[0].offset,count:f[0].count}];for(let m=1;m<f.length;m++){let y=S[S.length-1],b=f[m],M=y.offset+y.count;if(b.offset<=M){let P=Math.max(M,b.offset+b.count);y.count=P-y.offset}else S.push({offset:b.offset,count:b.count})}return S}async _unzipAsync(a){let f=this._streamOptions.fflate;if(!f){if(typeof window.fflate>"u")await v.LoadScriptAsync(this._streamOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");f=window.fflate}let S=f.unzipSync(a),m=new Map;for(let[y,b]of Object.entries(S))m.set(y,b);return m}}var Te=0;async function Yh(a,f){return await new Promise((S,m)=>{let y,b;if(yi())y=window,b="window";else if(typeof self<"u")y=self,b="self";else{m(Error("Cannot load script module outside of a window or a worker"));return}if(!y._LoadScriptModuleResolve)y._LoadScriptModuleResolve={};y._LoadScriptModuleResolve[Te]=S,a+=`
            ${b}._LoadScriptModuleResolve[${Te}](returnedValue);
            ${b}._LoadScriptModuleResolve[${Te}] = undefined;
        `,Te++,v.LoadScript(a,void 0,(M,P)=>{m(P||Error(M))},f,!0)})}var Ls=32768,Ee=0.28209479177387814,it=null,ts=null;function ss(a,f,S){let m=new Uint8Array(a),y=new Uint32Array(a.slice(0,12)),b=y[2],M=m[12],P=m[13],D=m[14],R=m[15],B=y[1];if(R||y[0]!=1347635022||B<2||B>4)return new Promise((k)=>{k({mode:3,data:new ArrayBuffer(0),hasVertexColors:!1})});let T=new ArrayBuffer(32*b),A=1/(1<<P),z=new Int32Array(1),V=new Uint8Array(z.buffer),j=function(k,H){return V[0]=k[H+0],V[1]=k[H+1],V[2]=k[H+2],V[3]=k[H+2]&128?255:0,z[0]*A},E=16,q=new Float32Array(T),G=new Float32Array(T),Y=new Uint8ClampedArray(T),W=new Uint8ClampedArray(T);for(let k=0;k<b;k++)q[k*8+0]=j(m,E+0),q[k*8+1]=j(m,E+3),q[k*8+2]=j(m,E+6),E+=9;for(let k=0;k<b;k++){for(let H=0;H<3;H++){let K=(m[E+b+k*3+H]-127.5)/38.25;Y[k*32+24+H]=Tr.Clamp((0.5+Ee*K)*255,0,255)}Y[k*32+24+3]=m[E+k]}E+=b*4;for(let k=0;k<b;k++)G[k*8+3+0]=Math.exp(m[E+0]/16-10),G[k*8+3+1]=Math.exp(m[E+1]/16-10),G[k*8+3+2]=Math.exp(m[E+2]/16-10),E+=3;if(B>=3){let k=Math.SQRT1_2;for(let H=0;H<b;H++){let N=[m[E+0],m[E+1],m[E+2],m[E+3]],K=N[0]+(N[1]<<8)+(N[2]<<16)+(N[3]<<24),se=511,U=[],J=K>>>30,ee=K,Q=0;for(let ie=3;ie>=0;--ie)if(ie!==J){let ae=ee&511,oe=ee>>>9&1;if(ee=ee>>>10,U[ie]=k*(ae/511),oe===1)U[ie]=-U[ie];Q+=U[ie]*U[ie]}let te=1-Q;U[J]=Math.sqrt(Math.max(te,0));let re=[3,0,1,2];for(let ie=0;ie<4;ie++)W[H*32+28+ie]=Math.round(127.5+U[re[ie]]*127.5);E+=4}}else for(let k=0;k<b;k++){let H=m[E+0],N=m[E+1],K=m[E+2],se=H/127.5-1,U=N/127.5-1,J=K/127.5-1;W[k*32+28+1]=H,W[k*32+28+2]=N,W[k*32+28+3]=K;let ee=1-(se*se+U*U+J*J);W[k*32+28+0]=127.5+Math.sqrt(ee<0?0:ee)*127.5,E+=3}if(M){let H=((M+1)*(M+1)-1)*3,N=Math.ceil(H/16),K=E,U=f.getEngine().getCaps().maxTextureSize,J=Math.ceil(b/U),ee=Gn(N,J*U*4*4);for(let Q=0;Q<b;Q++)for(let te=0;te<H;te++){let re=m[K++],ie=Math.floor(te/16),ae=ee[ie],oe=te%16,le=Q*16;ae[oe+le]=re}return new Promise((Q)=>{Q({mode:0,data:T,hasVertexColors:!1,sh:ee,shDegree:M,trainedWithAntialiasing:!!D})})}return new Promise((k)=>{k({mode:0,data:T,hasVertexColors:!1,trainedWithAntialiasing:!!D})})}async function is(a){if(it&&ts===a)return await it;let f=Yh(`import createSpzModule from '${a}';
         const module = await createSpzModule();
         const returnedValue = module;`);return ts=a,it=f,await f}function*Fs(a,f,S=!1){let m=a.numPoints,y=32,b=new ArrayBuffer(32*m),M=new Float32Array(b),P=new Uint8Array(b),{positions:D,scales:R,colors:B,alphas:O,rotations:T}=a,A=null,z=a.shDegree,V=null,j=0,E=null,q=null,G=null;if(z>0&&a.sh.length>0){j=((z+1)*(z+1)-1)*3;let H=Math.ceil(j/16),K=f.getEngine().getCaps().maxTextureSize,se=Math.ceil(m/K);A=Gn(H,se*K*4*4),E=new Int32Array(H),q=new Int32Array(H);for(let U=0;U<H;U++)E[U]=U*16,q[U]=Math.min((U+1)*16,j);G=A,V=a.sh}for(let k=0;k<m;k++){let H=k*8,N=k*32,K=k*3,se=k*4;M[H+0]=D[K+0],M[H+1]=D[K+1],M[H+2]=D[K+2],M[H+3]=Math.exp(R[K+0]),M[H+4]=Math.exp(R[K+1]),M[H+5]=Math.exp(R[K+2]);let U=(0.5+Ee*B[K+0])*255,J=(0.5+Ee*B[K+1])*255,ee=(0.5+Ee*B[K+2])*255;P[N+24]=U<=0?0:U>=255?255:U+0.5|0,P[N+25]=J<=0?0:J>=255?255:J+0.5|0,P[N+26]=ee<=0?0:ee>=255?255:ee+0.5|0,P[N+27]=1/(1+Math.exp(-O[k]))*255+0.5|0;let Q=T[se+3]*127.5+127.5,te=T[se+0]*127.5+127.5,re=T[se+1]*127.5+127.5,ie=T[se+2]*127.5+127.5;if(P[N+28]=Q<=0?0:Q>=255?255:Q+0.5|0,P[N+29]=te<=0?0:te>=255?255:te+0.5|0,P[N+30]=re<=0?0:re>=255?255:re+0.5|0,P[N+31]=ie<=0?0:ie>=255?255:ie+0.5|0,V&&G&&E&&q){let ae=k*j,oe=k*16;for(let le=0;le<G.length;le++){let ue=G[le],fe=E[le],pe=q[le];for(let Se=fe;Se<pe;Se++){let Me=V[ae+Se]*128+128;ue[oe+Se-fe]=Me<=0?0:Me>=255?255:Me+0.5|0}}}if(k%Ls===0&&S)yield}let Y,W;if(a.extensions)for(let k of a.extensions){let H=k;if(H.safeOrbitRadiusMin!==void 0){Y=H.safeOrbitRadiusMin,W=[H.safeOrbitElevationMin,H.safeOrbitElevationMax];break}}return{mode:0,data:b,hasVertexColors:!1,sh:A!==null?A:void 0,shDegree:z>0?z:void 0,trainedWithAntialiasing:!!a.antialiased,safeOrbitCameraRadiusMin:Y,safeOrbitCameraElevationMinMax:W}}async function rs(a,f){return await wn(Fs(a,f,!0),Jo())}class Io{constructor(a={}){this.name=Ce.name,this._assetContainer=null,this.extensions=Ce.extensions,this._loadingOptions={...Io._DefaultLoadingOptions,...a}}createPlugin(a){return new Io(a[Ce.name])}async importMeshAsync(a,f,S,m,y,b){let M=this._tryCreateLODStream(f,S,m);if(M)return{meshes:[M],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]};return await this._parseAsync(a,f,S,m).then((P)=>({meshes:P,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(a,f,S){if(typeof f!=="string")return null;let m;try{m=JSON.parse(f)}catch{return null}if(!ne.IsLODMetadata(m))return null;return a._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let y=new ne("GaussianSplattingStream",m,S,a,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return y._parentContainer=this._assetContainer,y})}static _BuildPointCloud(a,f,S){if(!f.byteLength)return null;return a._executeWithBlockedEntityCollection(!!S,()=>{let m=new Uint8Array(f),y=new Float32Array(f),b=32,M=m.length/32,P=new Float32Array(M*3),D=new Float32Array(M*4);for(let T=0;T<M;T++)P[T*3+0]=y[8*T+0],P[T*3+1]=y[8*T+1],P[T*3+2]=y[8*T+2],D[T*4+0]=m[32*T+24+0]/255,D[T*4+1]=m[32*T+24+1]/255,D[T*4+2]=m[32*T+24+2]/255,D[T*4+3]=1;let R=new p("PointCloud",a);R._parentContainer=S;let B=new w;B.positions=P,B.colors=D,B.applyToMesh(R),R.geometry._parentContainer=S,S?.geometries.push(R.geometry);let O=new L("point cloud material",a);return O.emissiveColor=h.White(),O.disableLighting=!0,O.pointsCloud=!0,O.pointSize=1,O._parentContainer=S,S?.materials.push(O),R.material=O,R})}static _BuildMesh(a,f){let S=new p("PLYMesh",a),m=new Uint8Array(f.data),y=new Float32Array(f.data),b=32,M=m.length/32,P=[],D=new w;for(let R=0;R<M;R++){let B=y[8*R+0],O=y[8*R+1],T=y[8*R+2];P.push(B,O,T)}if(f.hasVertexColors){let R=new Float32Array(M*4);for(let B=0;B<M;B++){let O=m[32*B+24+0]/255,T=m[32*B+24+1]/255,A=m[32*B+24+2]/255;R[B*4+0]=O,R[B*4+1]=T,R[B*4+2]=A,R[B*4+3]=1}D.colors=R}return D.positions=P,D.indices=f.faces,D.applyToMesh(S),S}async _unzipWithFFlateAsync(a){let f=this._loadingOptions.fflate;if(!f){if(typeof window.fflate>"u")await v.LoadScriptAsync(this._loadingOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");f=window.fflate}let{unzipSync:S}=f,m=S(a),y=new Map;for(let[b,M]of Object.entries(m))y.set(b,M);return y}_parseAsync(a,f,S,m){let y=[],b=(E)=>{f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let q=this._loadingOptions.gaussianSplattingMesh??new vs("GaussianSplatting",null,f,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(q._parentContainer=this._assetContainer,y.push(q),E.sogTextures)q.setSogTextureData(E.sogTextures);else q.updateData(E.data,E.sh,{flipY:!1},void 0,E.shDegree);q.scaling.y*=-1,q.computeWorldMatrix(!0),q.safeOrbitCameraLimits=Io._ExtractSafeOrbitLimits(E)})},M=f.getEngine(),P=this._loadingOptions.useSogTextures;if(P&&!M.isWebGPU&&M.version<2)c.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path."),P=!1;let D=P?ve:Et;if(typeof S==="string"){let E=JSON.parse(S);if(E&&E.means&&E.scales&&E.quats&&E.sh0)return new Promise((q,G)=>{D(E,m,f).then((Y)=>{b(Y),q(y)}).catch((Y)=>{G(Error("Failed to parse SOG data.",{cause:Y}))})})}let R=S instanceof ArrayBuffer?new Uint8Array(S):S;if(R[0]===80&&R[1]===75)return new Promise((E,q)=>{this._unzipWithFFlateAsync(R).then((G)=>{D(G,m,f).then((Y)=>{b(Y),E(y)}).catch((Y)=>{q(Error("Failed to parse SOG zip data.",{cause:Y}))})})});let B=(E)=>{Io._ConvertPLYToSplat(S).then((q)=>{switch(q.mode){case 0:f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let G=this._loadingOptions.gaussianSplattingMesh??new vs("GaussianSplatting",null,f,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(G._parentContainer=this._assetContainer,y.push(G),G.updateData(q.data,q.sh,{flipY:!1},void 0,q.shDegree),G.scaling.y*=-1,q.chirality==="RightHanded")G.scaling.y*=-1;switch(q.upAxis){case"X":G.rotation=new e(0,0,Math.PI/2);break;case"Y":G.rotation=new e(0,0,Math.PI);break;case"Z":G.rotation=new e(-Math.PI/2,Math.PI,0);break}G.computeWorldMatrix(!0),G.safeOrbitCameraLimits=Io._ExtractSafeOrbitLimits(q)});break;case 1:{let G=Io._BuildPointCloud(f,q.data,this._assetContainer);if(G)y.push(G);break}case 2:f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{if(q.faces)y.push(Io._BuildMesh(f,q));else throw Error("PLY mesh doesn't contain face informations.")});break;default:throw Error("Unsupported Splat mode")}this.applyAutoCameraLimits(Io._ExtractSafeOrbitLimits(q),f),E(y)})},O=R[0]===31&&R[1]===139,T=R[0]===78&&R[1]===71&&R[2]===83&&R[3]===80;if(!O&&!T)return new Promise((E)=>{B(E)});let A=(E,q)=>{f._executeWithBlockedEntityCollection(!!this._assetContainer,()=>{let G=this._loadingOptions.gaussianSplattingMesh??new vs("GaussianSplatting",null,f,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(E.trainedWithAntialiasing){let W=G.material;W.kernelSize=0.1,W.compensation=!0}if(G._parentContainer=this._assetContainer,y.push(G),G.updateData(E.data,E.sh,{flipY:!1},void 0,E.shDegree),!this._loadingOptions.flipY)G.scaling.y*=-1,G.computeWorldMatrix(!0);let Y=Io._ExtractSafeOrbitLimits(E);G.safeOrbitCameraLimits=Y,this.applyAutoCameraLimits(Y,f)}),q(y)};if(this._loadingOptions.spzLibraryUrl)return is(this._loadingOptions.spzLibraryUrl).then((E)=>{let q=E.loadSpzFromBuffer(new Uint8Array(S),{to:E.CoordinateSystem.RUB});return rs(q,f).then((G)=>new Promise((Y)=>{A(G,Y)}))});if(T)return Promise.reject(Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment."));let z=new ReadableStream({start(E){E.enqueue(new Uint8Array(S)),E.close()}}),V=new DecompressionStream("gzip"),j=z.pipeThrough(V);return new Promise((E)=>{new Response(j).arrayBuffer().then((q)=>{ss(q,f,this._loadingOptions).then((G)=>{A(G,E)})}).catch(()=>{B(E)})})}static _ExtractSafeOrbitLimits(a){if(a.safeOrbitCameraRadiusMin===void 0&&a.safeOrbitCameraElevationMinMax===void 0)return null;return{radiusMin:a.safeOrbitCameraRadiusMin,elevationMinMax:a.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(a,f){if(this._loadingOptions.disableAutoCameraLimits||!a)return;if(f.activeCamera?.getClassName()==="ArcRotateCamera"){let S=f.activeCamera;if(a.elevationMinMax)S.lowerBetaLimit=Math.PI*0.5-a.elevationMinMax[1],S.upperBetaLimit=Math.PI*0.5-a.elevationMinMax[0];if(a.radiusMin)S.lowerRadiusLimit=a.radiusMin}}loadAssetContainerAsync(a,f,S){let m=new Or(a);return this._assetContainer=m,this.importMeshAsync(null,a,f,S).then((y)=>{for(let b of y.meshes)m.meshes.push(b);return this._assetContainer=null,m}).catch((y)=>{throw this._assetContainer=null,y})}loadAsync(a,f,S){return this.importMeshAsync(null,a,f,S).then(()=>{})}static _ConvertPLYToSplat(a){let f=new Uint8Array(a),S=new TextDecoder().decode(f.slice(0,10240)),m=`end_header
`,y=S.indexOf(`end_header
`);if(y<0||!S)return new Promise((W)=>{W({mode:0,data:a,rawSplat:!0})});let b=parseInt(/element vertex (\d+)\n/.exec(S)[1]),M=/element face (\d+)\n/.exec(S),P=0;if(M)P=parseInt(M[1]);let D=/element chunk (\d+)\n/.exec(S),R=0;if(D)R=parseInt(D[1]);let B=0,O=0,T={double:8,int:4,uint:4,float:4,short:2,ushort:2,uint16:2,uchar:1,list:0},A={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},z=A.Chunk,V=[],j=[],E=S.slice(0,y).split(`
`),q={};for(let W of E)if(W.startsWith("property ")){let[,k,H]=W.split(" ");if(z==A.Chunk)j.push({name:H,type:k,offset:O}),O+=T[k];else if(z==A.Vertex)V.push({name:H,type:k,offset:B}),B+=T[k];else if(z==A.SH)V.push({name:H,type:k,offset:B});else if(z==A.Float_Tuple){let N=new DataView(a,O,T.float*2);q.safeOrbitCameraElevationMinMax=[N.getFloat32(0,!0),N.getFloat32(4,!0)]}else if(z==A.Float){let N=new DataView(a,O,T.float);q.safeOrbitCameraRadiusMin=N.getFloat32(0,!0)}else if(z==A.Uchar){let N=new DataView(a,O,T.uchar);if(H=="up_axis")q.upAxis=N.getUint8(0)==0?"X":N.getUint8(0)==1?"Y":"Z";else if(H=="chirality")q.chirality=N.getUint8(0)==0?"LeftHanded":"RightHanded"}if(!T[k])c.Warn(`Unsupported property type: ${k}.`)}else if(W.startsWith("element ")){let[,k]=W.split(" ");if(k=="chunk")z=A.Chunk;else if(k=="vertex")z=A.Vertex;else if(k=="sh")z=A.SH;else if(k=="safe_orbit_camera_elevation_min_max_radians")z=A.Float_Tuple;else if(k=="safe_orbit_camera_radius_min")z=A.Float;else if(k=="up_axis"||k=="chirality")z=A.Uchar}let G=B,Y=O;return vs.ConvertPLYWithSHToSplatAsync(a).then(async(W)=>{let k=new DataView(a,y+11),H=Y*R+G*b,N=[];if(P)for(let te=0;te<P;te++){let re=k.getUint8(H);if(re!=3)continue;H+=1;for(let ie=0;ie<re;ie++){let ae=k.getUint32(H+(2-ie)*4,!0);N.push(ae)}H+=12}if(R)return await new Promise((te)=>{te({mode:0,data:W.buffer,sh:W.sh,shDegree:W.shDegree,faces:N,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let K=0,se=0,U=["x","y","z","scale_0","scale_1","scale_2","opacity","rot_0","rot_1","rot_2","rot_3"],J=["red","green","blue","f_dc_0","f_dc_1","f_dc_2"];for(let te=0;te<V.length;te++){let re=V[te];if(U.includes(re.name))K++;if(J.includes(re.name))se++}let ee=K==U.length&&se>=3,Q=P?2:ee?0:1;return await new Promise((te)=>{te({...q,mode:Q,data:W.buffer,sh:W.sh,shDegree:W.shDegree,faces:N,hasVertexColors:!!se,compressed:!1,rawSplat:!1})})})}}Io._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==="object"?"https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js":void 0};var as=!1;function xb(){if(as)return;as=!0,Xr(new Io)}
export{hb,fb,_n,qr,Wh,Vw,db,gp,LO,NO,xp,FO,Hh,pb,Xh,mb,$h,_b,Aa,gb,Yh,jh,vp,bp,BO,kO,VO,GO,zO,UO,WO,HO,Io,xb};

//# debugId=778F1B2410BDF98964756E2164756E21
//# sourceMappingURL=site-qr3rp0pf.js.map
