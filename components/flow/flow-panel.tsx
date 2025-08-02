"use client";

import { Panel } from "@xyflow/react";
import { PlusIcon, CodeIcon, GithubIcon } from "@yamada-ui/lucide";
import { VStack, HStack, Text, Button, Link } from "@yamada-ui/react";

interface FlowPanelProps {
  onAddNode: () => void;
  onGenerateCode: () => void;
}

interface PanelContentProps {
  onAddNode: () => void;
  onGenerateCode: () => void;
}

export function FlowPanel({ onAddNode, onGenerateCode }: FlowPanelProps) {
  return (
    <Panel position="top-left">
      <PanelContent onAddNode={onAddNode} onGenerateCode={onGenerateCode} />
    </Panel>
  );
}

export function PanelContent({ onAddNode, onGenerateCode }: PanelContentProps) {
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
          <Button
            size="sm"
            as={Link}
            href="https://github.com/illionillion/mermaid-editor"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            gap={1}
            fontSize="sm"
            bg="gray.600"
            color="white"
            _hover={{ bg: "black", textDecoration: "none" }}
            startIcon={<GithubIcon />}
          >
            <Text>コントリビューションはこちら</Text>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
}
