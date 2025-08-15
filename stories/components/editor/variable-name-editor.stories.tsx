import type { Meta } from "@storybook/react-vite";
import { Center } from "@yamada-ui/react";
import { useState } from "react";
import { VariableNameEditor } from "../../../components/editor/variable-name-editor";

const meta: Meta<typeof VariableNameEditor> = {
  title: "components/editor/VariableNameEditor",
  component: VariableNameEditor,
};
export default meta;

export const Default = {
  render: () => {
    const [value, setValue] = useState("variable_name");
    const [isEditing, setIsEditing] = useState(true);
    return (
      <Center w="full" h="100vh" position="relative">
        <VariableNameEditor
          value={value}
          isEditing={isEditing}
          onClick={() => setIsEditing(true)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={() => {}}
          onCompositionStart={() => {}}
          onCompositionEnd={() => {}}
          onBlur={() => setIsEditing(false)}
        />
      </Center>
    );
  },
};
