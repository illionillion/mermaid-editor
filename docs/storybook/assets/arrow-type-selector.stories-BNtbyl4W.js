import{P as c,r as s}from"./iframe-CSJgqtUE.js";import{C as m}from"./chunk-PQIMNVG7-BU-bKpUb.js";import{g as u}from"./mermaid-TRHq53KC.js";import{A as d}from"./types-CqnIvgx0.js";import{M as p,a as w,b,c as y}from"./chunk-3UTYG3XF-jT-JhrqE.js";import{I as v}from"./createLucideIcon-DYY_HxMG.js";import"./preload-helper-C1FmrZbK.js";import"./chunk-AFVGPBIP-DlxD1NpB.js";function o({currentArrowType:r,onArrowTypeChange:a}){return React.createElement(p,null,React.createElement(w,{className:"arrow-type-selector-button",as:v,"aria-label":"Select arrow type",icon:React.createElement(m,null),size:"xs",variant:"outline",bg:"white",border:"1px solid",borderColor:"gray.300",_hover:{bg:"gray.50"}}),React.createElement(c,null,React.createElement(b,{bg:"white",boxShadow:"lg",border:"1px solid",borderColor:"gray.200"},d.map(e=>React.createElement(y,{key:e,onClick:()=>a(e),bg:r===e?"blue.50":"white",color:r===e?"blue.600":"gray.700",fontSize:"sm"},u(e))))))}o.__docgenInfo={description:"",methods:[],displayName:"ArrowTypeSelector",props:{currentArrowType:{required:!0,tsType:{name:"union",raw:`| "arrow" // -->
| "thick" // ==>
| "dotted" // -.->
| "invisible" // ~~~
| "bidirectional" // <-->
| "bidirectional-thick"`,elements:[{name:"literal",value:'"arrow"'},{name:"literal",value:'"thick"'},{name:"literal",value:'"dotted"'},{name:"literal",value:'"invisible"'},{name:"literal",value:'"bidirectional"'},{name:"literal",value:'"bidirectional-thick"'}]},description:""},onArrowTypeChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(arrowType: MermaidArrowType) => void",signature:{arguments:[{type:{name:"union",raw:`| "arrow" // -->
| "thick" // ==>
| "dotted" // -.->
| "invisible" // ~~~
| "bidirectional" // <-->
| "bidirectional-thick"`,elements:[{name:"literal",value:'"arrow"'},{name:"literal",value:'"thick"'},{name:"literal",value:'"dotted"'},{name:"literal",value:'"invisible"'},{name:"literal",value:'"bidirectional"'},{name:"literal",value:'"bidirectional-thick"'}]},name:"arrowType"}],return:{name:"void"}}},description:""}}};const R={title:"components/flow/ArrowTypeSelector",component:o},t={render:()=>{const[r,a]=s.useState("arrow");return React.createElement(o,{currentArrowType:r,onArrowTypeChange:a})}};var n,i,l;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [arrow, setArrow] = useState<MermaidArrowType>("arrow");
    return <ArrowTypeSelector currentArrowType={arrow} onArrowTypeChange={setArrow} />;
  }
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const C=["Default"];export{t as Default,C as __namedExportsOrder,R as default};
