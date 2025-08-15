import{r as o}from"./iframe-CSJgqtUE.js";import{L as a}from"./label-editor-BER8qYxZ.js";import"./preload-helper-C1FmrZbK.js";import"./chunk-2SDIXUVN-nrXmNFqZ.js";import"./chunk-HZUFQ4E7-CjTRi08W.js";const C={title:"components/editor/LabelEditor",component:a},e={render:()=>{const[i,u]=o.useState("ラベル"),[l,t]=o.useState(!0);return React.createElement(a,{value:i,isEditing:l,onDoubleClick:()=>t(!0),onChange:d=>u(d.target.value),onKeyDown:()=>{},onCompositionStart:()=>{},onCompositionEnd:()=>{},onBlur:()=>t(!1)})}};var n,r,s;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("ラベル");
    const [isEditing, setIsEditing] = useState(true);
    return <LabelEditor value={value} isEditing={isEditing} onDoubleClick={() => setIsEditing(true)} onChange={e => setValue(e.target.value)} onKeyDown={() => {}} onCompositionStart={() => {}} onCompositionEnd={() => {}} onBlur={() => setIsEditing(false)} />;
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const f=["Default"];export{e as Default,f as __namedExportsOrder,C as default};
