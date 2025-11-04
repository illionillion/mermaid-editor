import type { Meta } from "@storybook/nextjs-vite";
import { FlowPanel } from "@/features/flowchart/components/panel/flow-panel";

const meta: Meta<typeof FlowPanel> = {
  title: "components/flow/FlowPanel",
  component: FlowPanel,
};
export default meta;

export const Default = {
  tags: ["vrt"],
  render: () => (
    <FlowPanel
      edges={[]}
      nodes={[]}
      onAddNode={() => alert("ノード追加")}
      onImportMermaid={() => alert("Mermaidインポート")}
    />
  ),
};
