import type { Node, Edge } from "@xyflow/react";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ERDiagramPanel } from "../components/panel/er-diagram-panel";

const dummyNodes: Node<ERTableNodeProps>[] = [];
const dummyEdges: Edge[] = [];
const dummyGenerateCode = () => "erDiagram";
export default {
  title: "components/er/ERDiagramPanel",
  component: ERDiagramPanel,
};

export const Default = () => (
  <ERDiagramPanel
    onAddTable={() => alert("テーブル追加")}
    onImportMermaid={() => alert("Mermaidインポート")}
    nodes={dummyNodes}
    edges={dummyEdges}
    generateCode={dummyGenerateCode}
  />
);
