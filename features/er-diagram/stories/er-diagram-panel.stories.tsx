import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Node, Edge } from "@xyflow/react";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ERDiagramPanel } from "../components/panel/er-diagram-panel";

const dummyNodes: Node<ERTableNodeProps>[] = [];
const dummyEdges: Edge[] = [];
const dummyGenerateCode = () => "erDiagram";

const meta: Meta<typeof ERDiagramPanel> = {
  title: "components/er/ERDiagramPanel",
  component: ERDiagramPanel,
};
export default meta;

type Story = StoryObj<typeof ERDiagramPanel>;

export const Default: Story = {
  tags: ["vrt"],
  render: () => (
    <ERDiagramPanel
      onAddTable={() => alert("テーブル追加")}
      onImportMermaid={() => alert("Mermaidインポート")}
      nodes={dummyNodes}
      edges={dummyEdges}
      generateCode={dummyGenerateCode}
    />
  ),
};
