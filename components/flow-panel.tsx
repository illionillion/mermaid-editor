'use client';

import { Panel } from '@xyflow/react';
import { VStack, HStack, Text, Button } from '@yamada-ui/react';
import { PlusIcon, CodeIcon } from '@yamada-ui/lucide';

interface FlowPanelProps {
  onAddNode: () => void;
  onGenerateCode: () => void;
}

export function FlowPanel({ onAddNode, onGenerateCode }: FlowPanelProps) {
  return (
    <Panel position="top-left">
      <VStack gap={4} p={4} bg="white" borderRadius="md" boxShadow="md">
        <Text fontSize="lg" fontWeight="bold">
          Mermaid フローチャート エディター
        </Text>
        <VStack gap={2} align="start">
          <Text fontSize="sm" color="gray.600">
            💡 ヒント: ノードをダブルクリックで編集、ドラッグして空の場所で新ノード作成
          </Text>
          <HStack gap={2}>
            <Button
              startIcon={<PlusIcon />}
              colorScheme="blue"
              size="sm"
              onClick={onAddNode}
            >
              ノード追加
            </Button>
            <Button
              startIcon={<CodeIcon />}
              colorScheme="green"
              size="sm"
              onClick={onGenerateCode}
            >
              コード生成
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Panel>
  );
}
