import{r as i,R as t}from"./iframe-BClDxSdX.js";import{N as n}from"./node-menu-S-g9JIbY.js";import{C as l}from"./chunk-4BKHXCBQ-CVlrPHcT.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-Dm5MWXbI.js";import"./chunk-AFVGPBIP-VQi4iD-y.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-BghBXnur.js";import"./chunk-ZJJ7XTJB-FdQtK2Ok.js";import"./chunk-HZUFQ4E7-DilHWIlN.js";const g={title:"components/node/NodeMenu",component:n},e={render:()=>{const[s,p]=i.useState("rectangle");return t.createElement(l,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:s,onShapeChange:p,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const v=["Default"];export{e as Default,v as __namedExportsOrder,g as default};
