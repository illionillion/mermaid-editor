import type { Meta } from "@storybook/react-vite";
import { NodeContent } from "../../../components/node/editable-node";

const meta: Meta<typeof NodeContent> = {
  title: "components/node/NodeContent",
  component: NodeContent,
};
export default meta;

export const Default = {
  render: () => (
    <NodeContent
      id="1"
      data={{
        label: "ノードラベル",
        variableName: "var1",
        shapeType: "rectangle",
        onLabelChange: (id, label) => alert(`ラベル変更: ${id} → ${label}`),
        onVariableNameChange: (id, name) => alert(`変数名変更: ${id} → ${name}`),
        onShapeTypeChange: (id, shape) => alert(`形状変更: ${id} → ${shape}`),
        onDelete: (id) => alert(`削除: ${id}`),
      }}
    />
  ),
};
