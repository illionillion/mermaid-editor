import{R as e,P as c,r as m}from"./iframe-BClDxSdX.js";import{C as u}from"./chunk-PQIMNVG7-0oqEjWRZ.js";import{g as d}from"./mermaid-TRHq53KC.js";import{A as p}from"./types-CqnIvgx0.js";import{M as w,a as b,b as y,c as v}from"./chunk-3UTYG3XF-BghBXnur.js";import{I as g}from"./createLucideIcon-Dm5MWXbI.js";import"./preload-helper-C1FmrZbK.js";import"./chunk-AFVGPBIP-VQi4iD-y.js";function n({currentArrowType:t,onArrowTypeChange:o}){return e.createElement(w,null,e.createElement(b,{className:"arrow-type-selector-button",as:g,"aria-label":"Select arrow type",icon:e.createElement(u,null),size:"xs",variant:"outline",bg:"white",border:"1px solid",borderColor:"gray.300",_hover:{bg:"gray.50"}}),e.createElement(c,null,e.createElement(y,{bg:"white",boxShadow:"lg",border:"1px solid",borderColor:"gray.200"},p.map(r=>e.createElement(v,{key:r,onClick:()=>o(r),bg:t===r?"blue.50":"white",color:t===r?"blue.600":"gray.700",fontSize:"sm"},d(r))))))}n.__docgenInfo={description:"",methods:[],displayName:"ArrowTypeSelector",props:{currentArrowType:{required:!0,tsType:{name:"union",raw:`| "arrow" // -->
| "thick" // ==>
| "dotted" // -.->
| "invisible" // ~~~
| "bidirectional" // <-->
| "bidirectional-thick"`,elements:[{name:"literal",value:'"arrow"'},{name:"literal",value:'"thick"'},{name:"literal",value:'"dotted"'},{name:"literal",value:'"invisible"'},{name:"literal",value:'"bidirectional"'},{name:"literal",value:'"bidirectional-thick"'}]},description:""},onArrowTypeChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arrowType: MermaidArrowType) => void",signature:{arguments:[{type:{name:"union",raw:`| "arrow" // -->
| "thick" // ==>
| "dotted" // -.->
| "invisible" // ~~~
| "bidirectional" // <-->
| "bidirectional-thick"`,elements:[{name:"literal",value:'"arrow"'},{name:"literal",value:'"thick"'},{name:"literal",value:'"dotted"'},{name:"literal",value:'"invisible"'},{name:"literal",value:'"bidirectional"'},{name:"literal",value:'"bidirectional-thick"'}]},name:"arrowType"}],return:{name:"void"}}},description:""}}};const x={title:"components/flow/ArrowTypeSelector",component:n},a={render:()=>{const[t,o]=m.useState("arrow");return e.createElement(n,{currentArrowType:t,onArrowTypeChange:o})}};var i,l,s;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    const [arrow, setArrow] = useState<MermaidArrowType>("arrow");
    return <ArrowTypeSelector currentArrowType={arrow} onArrowTypeChange={setArrow} />;
  }
}`,...(s=(l=a.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};const M=["Default"];export{a as Default,M as __namedExportsOrder,x as default};
