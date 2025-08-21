import{r as i,R as t}from"./iframe-DaopR4Cl.js";import{N as n}from"./node-menu-D9XHStXV.js";import{C as m}from"./chunk-4BKHXCBQ-DFoJhKk9.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-BixSnWz0.js";import"./chunk-AFVGPBIP-DQ7re-ih.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-B-6jxGwD.js";import"./chunk-FVWMS4CP-Ci2C_nyD.js";import"./index-qpgD9iiY.js";import"./chunk-ZJJ7XTJB-eaudIUl_.js";import"./chunk-HZUFQ4E7-CwKk7O0m.js";const D={title:"components/node/NodeMenu",component:n},e={render:()=>{const[p,s]=i.useState("rectangle");return t.createElement(m,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:p,onShapeChange:s,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,D as default};
