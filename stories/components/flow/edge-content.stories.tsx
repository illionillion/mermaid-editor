import type { Meta } from "@storybook/react-vite";
import { Center } from "@yamada-ui/react";
import { EdgeContent } from "@/features/flowchart/components/edge/editable-edge";
import type { MermaidArrowType } from "@/features/flowchart/types/types";

const meta: Meta<typeof EdgeContent> = {
  title: "components/flow/EdgeContent",
  component: EdgeContent,
};
export default meta;

export const Default = {
  render: () => (
    <Center w="full" h="100vh" position="relative">
      <EdgeContent
        id="e1-2"
        labelX={0}
        labelY={0}
        data={{
          label: "edge label",
          arrowType: "arrow" as MermaidArrowType,
          onLabelChange: (id: string, label: string) => alert(`ラベル変更: ${id} → ${label}`),
          onArrowTypeChange: (id: string, type: MermaidArrowType) =>
            alert(`矢印タイプ変更: ${id} → ${type}`),
          onDelete: (id: string) => alert(`削除: ${id}`),
        }}
      />
    </Center>
  ),
};
