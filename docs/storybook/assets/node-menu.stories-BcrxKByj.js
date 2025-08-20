import{r as i,R as t}from"./iframe-CUU_ex75.js";import{N as n}from"./node-menu-Brdf5ObQ.js";import{C as m}from"./chunk-4BKHXCBQ-DdG_qyQ3.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-tYQa-QW9.js";import"./chunk-AFVGPBIP-CDKxgkL1.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-D3OjH4ZM.js";import"./chunk-FVWMS4CP-BQI7EHSI.js";import"./index-DVNkvxqO.js";import"./index-DhXhJyD1.js";import"./chunk-ZJJ7XTJB-CsAKm2kW.js";import"./chunk-HZUFQ4E7-BegUSI5y.js";const x={title:"components/node/NodeMenu",component:n},e={render:()=>{const[p,s]=i.useState("rectangle");return t.createElement(m,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:p,onShapeChange:s,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const M=["Default"];export{e as Default,M as __namedExportsOrder,x as default};
