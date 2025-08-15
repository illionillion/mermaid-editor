import{r as i,R as t}from"./iframe-Cnjz5Urv.js";import{N as n}from"./node-menu-DR58oFST.js";import{C as l}from"./chunk-4BKHXCBQ-BbeW23nz.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-T42Pvfjq.js";import"./chunk-AFVGPBIP-DCQxvsqD.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-DoC50_A6.js";import"./chunk-ZJJ7XTJB-785uJcQD.js";import"./chunk-HZUFQ4E7-DnmRoNNj.js";const g={title:"components/node/NodeMenu",component:n},e={render:()=>{const[s,p]=i.useState("rectangle");return t.createElement(l,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:s,onShapeChange:p,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const v=["Default"];export{e as Default,v as __namedExportsOrder,g as default};
