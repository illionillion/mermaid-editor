import { Panel } from "@xyflow/react";
import { PlusIcon } from "@yamada-ui/lucide";
import { VStack, HStack, Text, Button, FC } from "@yamada-ui/react";

export type ERDiagramPanelProps = {
  onAddTable: () => void;
};

export const ERDiagramPanel: FC<ERDiagramPanelProps> = ({ onAddTable }) => {
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
            {/* 今後: コード生成やインポートボタンを追加可能 */}
          </HStack>
        </VStack>
      </VStack>
    </Panel>
  );
};
