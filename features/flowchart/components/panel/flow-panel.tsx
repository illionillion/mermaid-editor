"use client";

import { Panel } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import { PlusIcon, CodeIcon, UploadIcon } from "@yamada-ui/lucide";
import type { FC } from "@yamada-ui/react";
import { VStack, HStack, Text, Button, useDisclosure } from "@yamada-ui/react";
import { NavigationMenu } from "@/components/ui";
import type { ParsedMermaidData } from "../../hooks/mermaid";
import { ImportModal } from "../mermaid";
import { DownloadModal } from "../mermaid/download-modal";

interface FlowPanelProps {
  onAddNode: () => void;
  onImportMermaid: (data: ParsedMermaidData) => void;
  nodes: Node[];
  edges: Edge[];
}

interface PanelContentProps {
  onAddNode: () => void;
  onImportMermaid: (data: ParsedMermaidData) => void;
  nodes: Node[];
  edges: Edge[];
}

export const FlowPanel: FC<FlowPanelProps> = ({ onAddNode, onImportMermaid, nodes, edges }) => {
  return (
    <Panel position="top-left">
      <PanelContent
        onAddNode={onAddNode}
        onImportMermaid={onImportMermaid}
        nodes={nodes}
        edges={edges}
      />
    </Panel>
  );
};

export const PanelContent: FC<PanelContentProps> = ({
  onAddNode,
  onImportMermaid,
  nodes,
  edges,
}) => {
  const { open: openImport, onOpen: onOpenImport, onClose: onCloseImport } = useDisclosure();
  const { open: openDownload, onOpen: onOpenDownload, onClose: onCloseDownload } = useDisclosure();

  return (
    <VStack gap={4} p={4} bg="white" borderRadius="md" boxShadow="md">
      <HStack
        w="full"
        display={{ base: "flex", sm: "inline-flex" }}
        flexWrap="wrap"
        justify="space-between"
      >
        <Text fontSize="lg" fontWeight="bold">
          Mermaid フローチャート エディター
        </Text>
        <NavigationMenu />
      </HStack>
      <VStack gap={2} align="start">
        <Text fontSize="sm" color="gray.600">
          💡 ヒント: ノードをダブルクリックで編集、ドラッグして空の場所で新ノード作成
        </Text>
        <HStack gap={2} display={{ base: "flex", md: "inline-flex" }} flexWrap="wrap">
          <Button startIcon={<PlusIcon />} colorScheme="blue" size="sm" onClick={onAddNode}>
            ノード追加
          </Button>
          <Button startIcon={<CodeIcon />} colorScheme="green" size="sm" onClick={onOpenDownload}>
            コード生成
          </Button>
          <Button startIcon={<UploadIcon />} colorScheme="purple" size="sm" onClick={onOpenImport}>
            インポート
          </Button>
        </HStack>
      </VStack>
      <ImportModal open={openImport} onClose={onCloseImport} onImport={onImportMermaid} />
      <DownloadModal open={openDownload} onClose={onCloseDownload} flowData={{ nodes, edges }} />
    </VStack>
  );
};
