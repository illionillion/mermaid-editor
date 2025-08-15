import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { LabelEditor } from "../../../components/editor/label-editor";

const meta: Meta<typeof LabelEditor> = {
  title: "components/editor/LabelEditor",
  component: LabelEditor,
};
export default meta;

export const Default = {
  render: () => {
    const [value, setValue] = useState("ラベル");
    const [isEditing, setIsEditing] = useState(true);
    return (
      <LabelEditor
        value={value}
        isEditing={isEditing}
        onDoubleClick={() => setIsEditing(true)}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={() => {}}
        onCompositionStart={() => {}}
        onCompositionEnd={() => {}}
        onBlur={() => setIsEditing(false)}
      />
    );
  },
};
