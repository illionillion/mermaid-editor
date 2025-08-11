"use client";

import { Panel } from "@xyflow/react";
import { PlusIcon, CodeIcon, UploadIcon } from "@yamada-ui/lucide";
import { VStack, HStack, Text, Button, useDisclosure } from "@yamada-ui/react";
import { ParsedMermaidData } from "../../utils/mermaid";
import { ImportModal } from "../mermaid";

interface FlowPanelProps {
  onAddNode: () => void;
  onGenerateCode: () => void;
  onImportMermaid: (data: ParsedMermaidData) => void;
}

interface PanelContentProps {
  onAddNode: () => void;
  onGenerateCode: () => void;
  onImportMermaid: (data: ParsedMermaidData) => void;
}

export function FlowPanel({ onAddNode, onGenerateCode, onImportMermaid }: FlowPanelProps) {
  return (
    <Panel position="top-left">
      <PanelContent
        onAddNode={onAddNode}
        onGenerateCode={onGenerateCode}
        onImportMermaid={onImportMermaid}
      />
    </Panel>
  );
}

export function PanelContent({ onAddNode, onGenerateCode, onImportMermaid }: PanelContentProps) {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <VStack gap={4} p={4} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold">
        Mermaid フローチャート エディター
      </Text>
      <VStack gap={2} align="start">
        <Text fontSize="sm" color="gray.600">
          💡 ヒント: ノードをダブルクリックで編集、ドラッグして空の場所で新ノード作成
        </Text>
        <HStack gap={2} display={{ base: "flex", md: "inline-flex" }} flexWrap="wrap">
          <Button startIcon={<PlusIcon />} colorScheme="blue" size="sm" onClick={onAddNode}>
            ノード追加
          </Button>
          <Button startIcon={<CodeIcon />} colorScheme="green" size="sm" onClick={onGenerateCode}>
            コード生成
          </Button>
          <Button startIcon={<UploadIcon />} colorScheme="purple" size="sm" onClick={onOpen}>
            インポート
          </Button>
        </HStack>
      </VStack>
      <ImportModal open={open} onClose={onClose} onImport={onImportMermaid} />
    </VStack>
  );
}
