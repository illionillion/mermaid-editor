"use client";

import type { FC } from "@yamada-ui/react";
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
import { EditableMermaidHighlight } from "@/features/flowchart/components/mermaid/editable-mermaid-highlight";
import { convertMermaidToERData } from "../../utils/import-mermaid-to-er";
import type { ParsedMermaidERData } from "../../utils/import-mermaid-to-er";

/**
 * ER図インポートモーダルのプロパティ
 */
interface ImportModalProps {
  /** モーダルの表示状態 */
  open: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** インポート実行時のコールバック関数 */
  onImport: (data: ParsedMermaidERData) => void;
}

/**
 * ヘルプテキストの定数
 * @description ER図で対応している機能の説明
 */
const HELP_TEXT = `💡 対応している機能: テーブル定義{columns}, リレーション(||--o{, }o--||, etc), 属性(PK, UK)`;

/**
 * ER図Mermaidコードインポートモーダル
 * @description flowchartのImportModalと同じ設計パターン
 */
export const ImportModal: FC<ImportModalProps> = ({ open, onClose, onImport }) => {
  const [mermaidCode, setMermaidCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * インポート処理の実行
   * @description 入力されたMermaidコードを解析してER図データに変換
   */
  const handleImport = async () => {
    if (!mermaidCode.trim()) {
      setError("Mermaidコードを入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const parsedData = convertMermaidToERData(mermaidCode);

      if (parsedData.nodes.length === 0 && parsedData.edges.length === 0) {
        setError(
          "有効なER図コードが見つかりませんでした。テーブルまたはリレーションの定義を確認してください。"
        );
        return;
      }

      onImport(parsedData);
      setMermaidCode("");
      onClose();
    } catch {
      setError("Mermaidコードの解析中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * モーダルを閉じる処理
   * @description 入力内容とエラーをリセットしてモーダルを閉じる
   */
  const handleClose = () => {
    setMermaidCode("");
    setError(null);
    onClose();
  };

  /**
   * 例示用のER図コード
   * @description ユーザーが参考にできるサンプルコード
   */
  const exampleCode = `erDiagram
    User {
      int id PK
      varchar(255) name
      varchar(255) email UK
    }
    Post {
      int id PK
      int user_id
      varchar(255) title
    }
    User ||--o{ Post : "has posts"`;

  return (
    <Modal open={open} onClose={handleClose} size="2xl">
      <ModalOverlay />
      <ModalHeader>Mermaid ER図コードインポート</ModalHeader>
      <ModalBody>
        <VStack gap={2}>
          <Text fontSize="sm" color="gray.600">
            MermaidのER図コードを貼り付けてインポートできます
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
};

/**
 * エラー表示コンポーネント
 * @param message エラーメッセージ
 */
const ErrorAlert = ({ message }: { message: string }) => (
  <Alert status="error">
    <AlertIcon />
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);
