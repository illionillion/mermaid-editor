import{r as s}from"./iframe-CSJgqtUE.js";import{N as o}from"./node-menu-CCcgEWJD.js";import{C as i}from"./chunk-4BKHXCBQ-C4ScjGoy.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-DYY_HxMG.js";import"./chunk-AFVGPBIP-DlxD1NpB.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-jT-JhrqE.js";import"./chunk-ZJJ7XTJB-C7m4rLoy.js";import"./chunk-HZUFQ4E7-CjTRi08W.js";const N={title:"components/node/NodeMenu",component:o},e={render:()=>{const[n,p]=s.useState("rectangle");return React.createElement(i,{w:"full",h:"100vh",position:"relative"},React.createElement(o,{currentShape:n,onShapeChange:p,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var t,r,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(a=(r=e.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,N as default};
