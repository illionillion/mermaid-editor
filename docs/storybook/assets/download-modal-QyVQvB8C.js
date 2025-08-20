import{f as c,j as l,I as m,b as i,r as p,R as e}from"./iframe-CUU_ex75.js";import{D as E,M as C}from"./mermaid-highlight-Bsh84ixT.js";import{C as b}from"./chunk-PQIMNVG7-D-4o9JZK.js";import{c as d}from"./createLucideIcon-tYQa-QW9.js";import{C as I}from"./copy-button-CLWMKGp1.js";import{b as k}from"./mermaid-DJDY5Okz.js";import{u as A}from"./index-DVNkvxqO.js";import{M as v,a as D,b as R,c as _}from"./chunk-OPXWQC3M-Cas1NSGr.js";import{H as g}from"./chunk-KNFS6H5K-DvokjAB9.js";import{T as j}from"./chunk-HZUFQ4E7-BegUSI5y.js";import{B as u}from"./chunk-AFVGPBIP-CDKxgkL1.js";import{M as L,a as N,b as B,c as T}from"./chunk-3UTYG3XF-D3OjH4ZM.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],H=d("ArrowDown",z);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],O=d("ArrowLeft",U);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],q=d("ArrowRight",S);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],G=d("ArrowUp",$);var V=c(({className:r,...a},t)=>l.jsx(m,{ref:t,as:G,className:i("ui-lucide-icon",r),...a})),W=c(({className:r,...a},t)=>l.jsx(m,{ref:t,as:O,className:i("ui-lucide-icon",r),...a})),F=c(({className:r,...a},t)=>l.jsx(m,{ref:t,as:q,className:i("ui-lucide-icon",r),...a})),J=c(({className:r,...a},t)=>l.jsx(m,{ref:t,as:H,className:i("ui-lucide-icon",r),...a}));const K=[{type:"TD",arrow:J},{type:"LR",arrow:F},{type:"RL",arrow:W},{type:"BT",arrow:V}],P=({open:r,onClose:a,flowData:t})=>{const[n,w]=p.useState("TD"),s=p.useMemo(()=>k(t,n),[t,n]),y=p.useCallback(()=>{const o=document.createElement("a"),x=new Blob([s],{type:"text/plain"});o.href=URL.createObjectURL(x),o.download="flowchart.mmd",document.body.appendChild(o),o.click(),document.body.removeChild(o)},[s]),{open:f,onOpen:M,onClose:h}=A();return e.createElement(v,{open:r,onClose:a,size:"2xl"},e.createElement(D,null,e.createElement(g,{justify:{base:"space-between",md:"flex-start"},display:{base:"flex",md:"inline-flex"},flexWrap:"wrap",alignItems:"center"},e.createElement(j,null,"生成されたMermaidコード"),e.createElement(u,{startIcon:e.createElement(E,null),colorScheme:"blue",size:"sm",onClick:y,ml:{base:0,md:"auto"}},"ダウンロード"),e.createElement(L,{open:f,onOpen:M,onClose:h},e.createElement(N,{size:"sm",as:u,rightIcon:e.createElement(b,{fontSize:"xl"})},n),e.createElement(B,null,K.map(o=>e.createElement(T,{key:o.type,icon:e.createElement(o.arrow,null),bgColor:o.type===n?"primary.50":"transparent",onClick:()=>w(o.type)},o.type)))))),e.createElement(R,null),e.createElement(_,{pb:6,position:"relative"},e.createElement(I,{value:s,position:"absolute",top:2,right:6,zIndex:1}),e.createElement(C,{code:s})))};P.__docgenInfo={description:"",methods:[],displayName:"DownloadModal"};export{P as D};
