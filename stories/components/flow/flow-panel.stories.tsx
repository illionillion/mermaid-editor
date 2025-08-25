import type { Meta } from "@storybook/react-vite";
import { FlowPanel } from "@/features/flowchart/components/panel/flow-panel";

const meta: Meta<typeof FlowPanel> = {
  title: "components/flow/FlowPanel",
  component: FlowPanel,
};
export default meta;

export const Default = {
  render: () => (
    <FlowPanel
      onAddNode={() => alert("ノード追加")}
      onGenerateCode={() => alert("コード生成")}
      onImportMermaid={() => alert("Mermaidインポート")}
    />
  ),
};
