import{r as i,R as t}from"./iframe-BQ98GxP0.js";import{N as n}from"./node-menu-D58989f6.js";import{C as m}from"./chunk-4BKHXCBQ-DFkic-V6.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-B20JSMho.js";import"./chunk-AFVGPBIP-BjfAiLYD.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-B5ns_RcE.js";import"./chunk-FVWMS4CP-ZkN7D6FS.js";import"./index-lZWdrqFJ.js";import"./chunk-ZJJ7XTJB-DxBV-137.js";import"./chunk-HZUFQ4E7-Ul2JuzWa.js";const D={title:"components/node/NodeMenu",component:n},e={render:()=>{const[p,s]=i.useState("rectangle");return t.createElement(m,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:p,onShapeChange:s,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,D as default};
