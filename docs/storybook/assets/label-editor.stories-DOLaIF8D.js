import{r as o,R as c}from"./iframe-BClDxSdX.js";import{L as a}from"./label-editor-BSpcvamg.js";import"./preload-helper-C1FmrZbK.js";import"./chunk-2SDIXUVN-BeQEuqVg.js";import"./chunk-HZUFQ4E7-DilHWIlN.js";const f={title:"components/editor/LabelEditor",component:a},e={render:()=>{const[i,u]=o.useState("ラベル"),[l,t]=o.useState(!0);return c.createElement(a,{value:i,isEditing:l,onDoubleClick:()=>t(!0),onChange:d=>u(d.target.value),onKeyDown:()=>{},onCompositionStart:()=>{},onCompositionEnd:()=>{},onBlur:()=>t(!1)})}};var n,r,s;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = useState("ラベル");
    const [isEditing, setIsEditing] = useState(true);
    return <LabelEditor value={value} isEditing={isEditing} onDoubleClick={() => setIsEditing(true)} onChange={e => setValue(e.target.value)} onKeyDown={() => {}} onCompositionStart={() => {}} onCompositionEnd={() => {}} onBlur={() => setIsEditing(false)} />;
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const S=["Default"];export{e as Default,S as __namedExportsOrder,f as default};
