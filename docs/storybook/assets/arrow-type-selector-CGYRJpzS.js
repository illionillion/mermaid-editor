import{R as e,P as i}from"./iframe-Cnjz5Urv.js";import{C as n}from"./chunk-PQIMNVG7-DfOnY86g.js";import{a as l}from"./mermaid-DJDY5Okz.js";import{A as o}from"./types-CqnIvgx0.js";import{M as m,a as c,b as s,c as u}from"./chunk-3UTYG3XF-DoC50_A6.js";import{I as d}from"./createLucideIcon-T42Pvfjq.js";function b({currentArrowType:a,onArrowTypeChange:t}){return e.createElement(m,null,e.createElement(c,{className:"arrow-type-selector-button",as:d,"aria-label":"Select arrow type",icon:e.createElement(n,null),size:"xs",variant:"outline",bg:"white",border:"1px solid",borderColor:"gray.300",_hover:{bg:"gray.50"}}),e.createElement(i,null,e.createElement(s,{bg:"white",boxShadow:"lg",border:"1px solid",borderColor:"gray.200"},o.map(r=>e.createElement(u,{key:r,onClick:()=>t(r),bg:a===r?"blue.50":"white",color:a===r?"blue.600":"gray.700",fontSize:"sm"},l(r))))))}b.__docgenInfo={description:"",methods:[],displayName:"ArrowTypeSelector",props:{currentArrowType:{required:!0,tsType:{name:"union",raw:`| "arrow" // -->
| "thick" // ==>
| "dotted" // -.->
| "invisible" // ~~~
| "bidirectional" // <-->
| "bidirectional-thick"`,elements:[{name:"literal",value:'"arrow"'},{name:"literal",value:'"thick"'},{name:"literal",value:'"dotted"'},{name:"literal",value:'"invisible"'},{name:"literal",value:'"bidirectional"'},{name:"literal",value:'"bidirectional-thick"'}]},description:""},onArrowTypeChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arrowType: MermaidArrowType) => void",signature:{arguments:[{type:{name:"union",raw:`| "arrow" // -->
| "thick" // ==>
| "dotted" // -.->
| "invisible" // ~~~
| "bidirectional" // <-->
| "bidirectional-thick"`,elements:[{name:"literal",value:'"arrow"'},{name:"literal",value:'"thick"'},{name:"literal",value:'"dotted"'},{name:"literal",value:'"invisible"'},{name:"literal",value:'"bidirectional"'},{name:"literal",value:'"bidirectional-thick"'}]},name:"arrowType"}],return:{name:"void"}}},description:""}}};export{b as A};
