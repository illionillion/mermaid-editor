import{r as o}from"./iframe-CSJgqtUE.js";import{V as i}from"./variable-name-editor-CP-PMbZc.js";import{C as c}from"./chunk-4BKHXCBQ-C4ScjGoy.js";import"./preload-helper-C1FmrZbK.js";import"./mermaid-TRHq53KC.js";import"./chunk-ZJJ7XTJB-C7m4rLoy.js";import"./chunk-2SDIXUVN-nrXmNFqZ.js";const S={title:"components/editor/VariableNameEditor",component:i},e={render:()=>{const[s,l]=o.useState("variable_name"),[m,t]=o.useState(!0);return React.createElement(c,{w:"full",h:"100vh",position:"relative"},React.createElement(i,{value:s,isEditing:m,onClick:()=>t(!0),onChange:u=>l(u.target.value),onKeyDown:()=>{},onCompositionStart:()=>{},onCompositionEnd:()=>{},onBlur:()=>t(!1)}))}};var n,r,a;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("variable_name");
    const [isEditing, setIsEditing] = useState(true);
    return <Center w="full" h="100vh" position="relative">
        <VariableNameEditor value={value} isEditing={isEditing} onClick={() => setIsEditing(true)} onChange={e => setValue(e.target.value)} onKeyDown={() => {}} onCompositionStart={() => {}} onCompositionEnd={() => {}} onBlur={() => setIsEditing(false)} />
      </Center>;
  }
}`,...(a=(r=e.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};const V=["Default"];export{e as Default,V as __namedExportsOrder,S as default};
