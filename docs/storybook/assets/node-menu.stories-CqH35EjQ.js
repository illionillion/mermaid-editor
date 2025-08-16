import{r as i,R as t}from"./iframe-B0pyN9P4.js";import{N as n}from"./node-menu-BsdpgggJ.js";import{C as m}from"./chunk-4BKHXCBQ-DEvSpEFz.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-3yn87STw.js";import"./chunk-AFVGPBIP-Z4a0uDJe.js";import"./types-CqnIvgx0.js";import"./chunk-3UTYG3XF-Co8kQaFT.js";import"./chunk-FVWMS4CP-DcwLrdLC.js";import"./index-uCLQ8KRJ.js";import"./chunk-ZJJ7XTJB-CqYoxPeD.js";import"./chunk-HZUFQ4E7-DH2UGXRT.js";const D={title:"components/node/NodeMenu",component:n},e={render:()=>{const[p,s]=i.useState("rectangle");return t.createElement(m,{w:"full",h:"100vh",position:"relative"},t.createElement(n,{currentShape:p,onShapeChange:s,onEdit:()=>alert("ラベル編集"),onEditVariableName:()=>alert("変数名編集"),onDelete:()=>alert("削除")}))}};var r,a,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return <Center w="full" h="100vh" position="relative">
        <NodeMenu currentShape={shape} onShapeChange={setShape} onEdit={() => alert("ラベル編集")} onEditVariableName={() => alert("変数名編集")} onDelete={() => alert("削除")} />
      </Center>;
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const x=["Default"];export{e as Default,x as __namedExportsOrder,D as default};
