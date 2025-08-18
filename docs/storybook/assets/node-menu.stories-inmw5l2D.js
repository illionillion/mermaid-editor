import{r as i,R as t}from"./iframe-BUjWjKwL.js";import{N as n}from"./node-menu-DWhpoPBF.js";import{C as m}from"./chunk-4BKHXCBQ-CFY63YqV.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-BL_TnK8f.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-DrNYvnAd.js";import"./chunk-FVWMS4CP-BB-5zPws.js";import"./index-lsaZBvwd.js";import"./chunk-ZJJ7XTJB-CYto-gWx.js";import"./chunk-HZUFQ4E7-C5WvJNVl.js";import"./chunk-QQERBTQW-BVEa9W6g.js";import"./chunk-AFVGPBIP-_bZBFQaB.js";const x={title:"components/node/NodeMenu",component:n},e={render:()=>{const[p,s]=i.useState("rectangle");return t.createElement(m,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:p,onShapeChange:s,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const M=["Default"];export{e as Default,M as __namedExportsOrder,x as default};
