"use client";

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@yamada-ui/react";
import { useState } from "react";
import { parseMermaidCode } from "../../utils/mermaid";
import type { ParsedMermaidData } from "../../utils/mermaid";
import { EditableMermaidHighlight } from "./editable-mermaid-highlight";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: ParsedMermaidData) => void;
}

// ヘルプテキストの定数
const HELP_TEXT = `💡 対応しているノード形状: 四角形[label], ダイヤモンド{label}, 円((label)), 六角形{{label}}, スタジアム([label]), 角丸(label)`;

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [mermaidCode, setMermaidCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!mermaidCode.trim()) {
      setError("Mermaidコードを入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedData = parseMermaidCode(mermaidCode);

      if (parsedData.nodes.length === 0 && parsedData.edges.length === 0) {
        setError(
          "有効なMermaidコードが見つかりませんでした。ノードまたはエッジの定義を確認してください。"
        );
        return;
      }

      onImport(parsedData);
      setMermaidCode("");
      onClose();
    } catch (err) {
      setError("Mermaidコードの解析中にエラーが発生しました");
      console.error("Import error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMermaidCode("");
    setError(null);
    onClose();
  };

  const exampleCode = `flowchart TD
    A[開始] --> B{判定}
    B -->|はい| C[処理A]
    B -->|いいえ| D[処理B]
    C --> E[終了]
    D --> E`;

  return (
    <Modal open={isOpen} onClose={handleClose} size="2xl">
      <ModalOverlay />
      <ModalHeader>Mermaidコードインポート</ModalHeader>
      <ModalBody>
        <VStack gap={2}>
          <Text fontSize="sm" color="gray.600">
            Mermaidのフローチャートコードを貼り付けてインポートできます
          </Text>

          <EditableMermaidHighlight
            value={mermaidCode}
            onChange={(value) => {
              setMermaidCode(value);
              setError(null);
            }}
            placeholder={`例:\n${exampleCode}`}
            minHeight="300px"
          />
          {error && <ErrorAlert message={error} />}

          <Text fontSize="xs" color="gray.500">
            {HELP_TEXT}
          </Text>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button
          colorScheme="blue"
          onClick={handleImport}
          loading={isLoading}
          loadingText="インポート中..."
          disabled={!mermaidCode.trim()}
        >
          インポート
        </Button>
      </ModalFooter>
    </Modal>
  );
}

const ErrorAlert = ({ message }: { message: string }) => (
  <Alert status="error">
    <AlertIcon />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);
