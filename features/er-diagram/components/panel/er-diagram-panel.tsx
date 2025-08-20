import { Panel, Node, Edge } from "@xyflow/react";
import { PlusIcon, DownloadIcon } from "@yamada-ui/lucide";
import { VStack, HStack, Text, Button, FC, useBoolean } from "@yamada-ui/react";
import type { ERTableNodeProps } from "../node/er-table-node";
import { ERDiagramMermaidModal } from "./er-diagram-mermaid-modal";

export type ERDiagramPanelProps = {
  onAddTable: () => void;
  nodes: Node<ERTableNodeProps>[];
  edges: Edge[];
  generateCode: (nodes: Node<ERTableNodeProps>[], edges: Edge[]) => string;
};

export const ERDiagramPanel: FC<ERDiagramPanelProps> = ({
  onAddTable,
  nodes,
  edges,
  generateCode,
}) => {
  const [open, setOpen] = useBoolean(false);
  const code = generateCode(nodes, edges);

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "er-diagram.mmd";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Panel position="top-left">
      <VStack gap={4} p={4} bg="white" borderRadius="md" boxShadow="md">
        <Text fontSize="lg" fontWeight="bold">
          ER図エディタ
        </Text>
        <VStack gap={2} align="start">
          <Text fontSize="sm" color="gray.600">
            💡 ヒント: テーブルをダブルクリックで編集、ドラッグして空の場所で新テーブル作成
          </Text>
          <HStack gap={2} display={{ base: "flex", md: "inline-flex" }} flexWrap="wrap">
            <Button startIcon={<PlusIcon />} colorScheme="blue" size="sm" onClick={onAddTable}>
              テーブル追加
            </Button>
            <Button startIcon={<DownloadIcon />} colorScheme="green" size="sm" onClick={setOpen.on}>
              mermaidコード出力
            </Button>
          </HStack>
        </VStack>
      </VStack>
      <ERDiagramMermaidModal
        open={open}
        onClose={setOpen.off}
        code={code}
        onDownload={handleDownload}
      />
    </Panel>
  );
};
