import type { Node, Edge } from "@xyflow/react";
import { Panel } from "@xyflow/react";
import { PlusIcon, DownloadIcon, UploadIcon } from "@yamada-ui/lucide";
import type { FC } from "@yamada-ui/react";
import { VStack, HStack, Text, Button, useBoolean } from "@yamada-ui/react";
import { NavigationMenu } from "@/components/ui";
import type { ParsedMermaidERData } from "../../utils/import-mermaid-to-er";
import { ImportModal } from "../mermaid/import-modal";
import type { ERTableNodeProps } from "../node/er-table-node";
import { ERDiagramMermaidModal } from "./er-diagram-mermaid-modal";

export type ERDiagramPanelProps = {
  onAddTable: () => void;
  onImportMermaid: (data: ParsedMermaidERData) => void;
  nodes: Node<ERTableNodeProps>[];
  edges: Edge[];
  generateCode: (nodes: Node<ERTableNodeProps>[], edges: Edge[]) => string;
};

export const ERDiagramPanel: FC<ERDiagramPanelProps> = ({
  onAddTable,
  onImportMermaid,
  nodes,
  edges,
  generateCode,
}) => {
  const [open, setOpen] = useBoolean(false);
  const [openImport, setOpenImport] = useBoolean(false);
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
        <HStack
          w="full"
          display={{ base: "flex", sm: "inline-flex" }}
          flexWrap="wrap"
          justify="space-between"
        >
          <Text fontSize="lg" fontWeight="bold">
            Mermaid ER図エディター
          </Text>
          <NavigationMenu />
        </HStack>
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
            <Button
              startIcon={<UploadIcon />}
              colorScheme="purple"
              size="sm"
              onClick={setOpenImport.on}
            >
              mermaidインポート
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
      <ImportModal open={openImport} onClose={setOpenImport.off} onImport={onImportMermaid} />
    </Panel>
  );
};
