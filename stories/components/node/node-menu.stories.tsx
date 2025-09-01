import type { Meta } from "@storybook/nextjs-vite";
import { Center } from "@yamada-ui/react";
import { useState } from "react";
import { NodeMenu } from "@/features/flowchart/components/node/node-menu";

const meta: Meta<typeof NodeMenu> = {
  title: "components/node/NodeMenu",
  component: NodeMenu,
};
export default meta;

export const Default = {
  render: () => {
    const [shape, setShape] = useState("rectangle");
    return (
      <Center w="full" h="100vh" position="relative">
        <NodeMenu
          currentShape={shape}
          onShapeChange={setShape}
          onEdit={() => alert("ラベル編集")}
          onEditVariableName={() => alert("変数名編集")}
          onDelete={() => alert("削除")}
        />
      </Center>
    );
  },
};
