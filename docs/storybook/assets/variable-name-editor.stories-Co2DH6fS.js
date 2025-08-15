import{r as o,R as n}from"./iframe-BClDxSdX.js";import{V as s}from"./variable-name-editor-lRQNOF_Q.js";import{C as p}from"./chunk-4BKHXCBQ-CVlrPHcT.js";import"./preload-helper-C1FmrZbK.js";import"./mermaid-TRHq53KC.js";import"./chunk-ZJJ7XTJB-FdQtK2Ok.js";import"./chunk-2SDIXUVN-BeQEuqVg.js";const V={title:"components/editor/VariableNameEditor",component:s},e={render:()=>{const[l,m]=o.useState("variable_name"),[u,t]=o.useState(!0);return n.createElement(p,{w:"full",h:"100vh",position:"relative"},n.createElement(s,{value:l,isEditing:u,onClick:()=>t(!0),onChange:d=>m(d.target.value),onKeyDown:()=>{},onCompositionStart:()=>{},onCompositionEnd:()=>{},onBlur:()=>t(!1)}))}};var r,a,i;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("variable_name");
    const [isEditing, setIsEditing] = useState(true);
    return <Center w="full" h="100vh" position="relative">
        <VariableNameEditor value={value} isEditing={isEditing} onClick={() => setIsEditing(true)} onChange={e => setValue(e.target.value)} onKeyDown={() => {}} onCompositionStart={() => {}} onCompositionEnd={() => {}} onBlur={() => setIsEditing(false)} />
      </Center>;
  }
}`,...(i=(a=e.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};const h=["Default"];export{e as Default,h as __namedExportsOrder,V as default};
