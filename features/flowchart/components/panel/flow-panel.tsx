"use client";

import { Panel } from "@xyflow/react";
import { PlusIcon, CodeIcon, UploadIcon } from "@yamada-ui/lucide";
import { VStack, HStack, Text, Button, useDisclosure, FC } from "@yamada-ui/react";
import { NavigationMenu } from "@/components/ui";
import { ParsedMermaidData } from "../../hooks/mermaid";
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

export const FlowPanel: FC<FlowPanelProps> = ({ onAddNode, onGenerateCode, onImportMermaid }) => {
  return (
    <Panel position="top-left">
      <PanelContent
        onAddNode={onAddNode}
        onGenerateCode={onGenerateCode}
        onImportMermaid={onImportMermaid}
      />
    </Panel>
  );
};

export const PanelContent: FC<PanelContentProps> = ({
  onAddNode,
  onGenerateCode,
  onImportMermaid,
}) => {
  const { open, onOpen, onClose } = useDisclosure();

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
};
