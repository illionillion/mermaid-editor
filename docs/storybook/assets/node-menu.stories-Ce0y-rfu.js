import{r as i,R as t}from"./iframe-BUKdPNoR.js";import{N as n}from"./node-menu--0GfZn-R.js";import{C as m}from"./chunk-4BKHXCBQ-DCQaL6s8.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-BKa91mbu.js";import"./chunk-AFVGPBIP-CeKa4Rwc.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-BJ1uSEWQ.js";import"./chunk-FVWMS4CP-BzX1FldU.js";import"./index-CRx3Uk0X.js";import"./chunk-ZJJ7XTJB-MdwzxMpb.js";import"./chunk-HZUFQ4E7-BQGg28aj.js";const D={title:"components/node/NodeMenu",component:n},e={render:()=>{const[p,s]=i.useState("rectangle");return t.createElement(m,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:p,onShapeChange:s,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,D as default};
