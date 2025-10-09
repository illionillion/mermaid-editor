import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Position,
} from "@xyflow/react";
import type { PropsWithChildren } from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { EditableEdge } from "@/features/flowchart/components/edge/editable-edge";
import type { MermaidArrowType } from "@/features/flowchart/types/types";

/**
 * ReactFlowProvider用のテストコンポーネント
 * @description EditableEdgeコンポーネントのテストに必要なReactFlowコンテキストを提供
 */
function ReactFlowTestWrapper({ children }: PropsWithChildren) {
  const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
    { id: "2", position: { x: 200, y: 0 }, data: { label: "Node 2" } },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "editableEdge",
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const edgeTypes = {
    editableEdge: EditableEdge,
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          edgeTypes={edgeTypes}
          fitView
        >
          {children}
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

/**
 * EditableEdgeコンポーネント用のテストプロパティ
 */
const createMockEdgeProps = (overrides: Partial<Parameters<typeof EditableEdge>[0]> = {}) => ({
  id: "test-edge",
  sourceX: 100,
  sourceY: 100,
  targetX: 200,
  targetY: 100,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  source: "1",
  target: "2",
  markerEnd: "url(#marker-end)",
  data: {
    label: "テストエッジ",
    arrowType: "arrow" as MermaidArrowType,
    onLabelChange: vi.fn(),
    onArrowTypeChange: vi.fn(),
    onDelete: vi.fn(),
    allEdges: [],
    enableCyclicEdgeStyling: false,
  },
  ...overrides,
});

describe("EditableEdge", () => {
  const mockProps = createMockEdgeProps();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本描画テスト", () => {
    test("デフォルトエッジが正しく描画される", async () => {
      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      /**
       * エッジラベルの表示確認
       * @description ReactFlowのエッジレンダリング完了後にラベルが表示される
       */
      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });
    });

    test("データなしでのフォールバック動作", async () => {
      const propsWithoutData = createMockEdgeProps({ data: undefined });

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...propsWithoutData} />
        </ReactFlowTestWrapper>
      );

      /**
       * データなし時のプレースホルダー表示確認
       * @description dataプロパティがundefinedの場合の安全な動作を検証
       */
      await waitFor(() => {
        expect(screen.getByText("...")).toBeInTheDocument();
      });
    });
  });

  describe("ラベル編集機能", () => {
    test("クリックによる編集モード切り替え", async () => {
      const user = userEvent.setup();

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      /**
       * ラベルクリックによる編集モード開始
       * @description ラベル要素をクリックして編集フィールドが表示されることを確認
       */
      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });
    });

    test("Enterキーでの編集確定", async () => {
      const user = userEvent.setup();

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = await screen.findByRole("textbox");
      await user.clear(input);
      await user.type(input, "新しいラベル{Enter}");

      /**
       * ラベル変更コールバックの実行確認
       * @description Enterキー押下時にonLabelChangeが正しい引数で呼ばれることを検証
       */
      expect(mockProps.data?.onLabelChange).toHaveBeenCalledWith("test-edge", "新しいラベル");
    });

    test("Escapeキーでの編集キャンセル", async () => {
      const user = userEvent.setup();

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = await screen.findByRole("textbox");
      await user.clear(input);
      await user.type(input, "キャンセルされる{Escape}");

      /**
       * 編集キャンセル時の動作確認
       * @description Escapeキー押下時にコールバックが呼ばれず、元のラベルが復元されることを検証
       */
      expect(mockProps.data?.onLabelChange).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });
    });

    test("入力値の正常な反映確認", async () => {
      const user = userEvent.setup();

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = await screen.findByRole("textbox");
      expect(input).toHaveValue("テストエッジ");

      await user.clear(input);
      await user.type(input, "変更されたラベル");

      expect(input).toHaveValue("変更されたラベル");
    });
  });

  describe("矢印タイプ選択機能", () => {
    test("ArrowTypeSelectorの表示確認", async () => {
      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      /**
       * 矢印タイプセレクターの存在確認
       * @description ArrowTypeSelectorコンポーネントが正しく表示されることを検証
       */
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Select arrow type" })).toBeInTheDocument();
      });
    });

    test("矢印タイプ変更コールバック検証", async () => {
      const user = userEvent.setup();

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      const selectorButton = await screen.findByRole("button", { name: "Select arrow type" });
      await user.click(selectorButton);

      const thickOption = await screen.findByText("太い矢印 (==>)");
      await user.click(thickOption);

      /**
       * 矢印タイプ変更時のコールバック実行確認
       * @description ArrowTypeSelectorから矢印タイプ変更時にonArrowTypeChangeが呼ばれることを検証
       */
      expect(mockProps.data?.onArrowTypeChange).toHaveBeenCalledWith("test-edge", "thick");
    });
  });

  describe("エッジ削除機能", () => {
    test("削除ボタンの表示確認", async () => {
      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      /**
       * 削除ボタンの存在確認
       * @description 削除用のIconButtonが正しく表示されることを検証
       */
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Delete edge" })).toBeInTheDocument();
      });
    });

    test("削除コールバックの正常動作", async () => {
      const user = userEvent.setup();

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...mockProps} />
        </ReactFlowTestWrapper>
      );

      const deleteButton = await screen.findByRole("button", { name: "Delete edge" });
      await user.click(deleteButton);

      /**
       * 削除ボタンクリック時のコールバック実行確認
       * @description 削除ボタンクリック時にonDeleteが正しいエッジIDで呼ばれることを検証
       */
      expect(mockProps.data?.onDelete).toHaveBeenCalledWith("test-edge");
    });
  });

  describe("循環エッジスタイリング", () => {
    test("循環エッジ検出ロジック確認", async () => {
      const cyclicEdges = [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-1", source: "2", target: "1" },
      ];

      const propsWithCyclicEdges = createMockEdgeProps({
        data: {
          ...mockProps.data!,
          allEdges: cyclicEdges,
          enableCyclicEdgeStyling: true,
        },
      });

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...propsWithCyclicEdges} />
        </ReactFlowTestWrapper>
      );

      /**
       * 循環エッジ時の正常レンダリング確認
       * @description 循環エッジが検出された場合でも正常にレンダリングされることを検証
       */
      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });
    });

    test("enableCyclicEdgeStylingフラグ動作", async () => {
      const propsWithStylingDisabled = createMockEdgeProps({
        data: {
          ...mockProps.data!,
          enableCyclicEdgeStyling: false,
        },
      });

      render(
        <ReactFlowTestWrapper>
          <EditableEdge {...propsWithStylingDisabled} />
        </ReactFlowTestWrapper>
      );

      /**
       * 循環エッジスタイリング無効時の動作確認
       * @description enableCyclicEdgeStyling: falseでも正常にレンダリングされることを検証
       */
      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });
    });
  });

  describe("エラーハンドリング", () => {
    test("コールバック関数未定義時の安全動作", async () => {
      const propsWithoutCallbacks = createMockEdgeProps({
        data: {
          label: "テスト",
          arrowType: "arrow" as MermaidArrowType,
          onLabelChange: undefined,
          onArrowTypeChange: undefined,
          onDelete: undefined,
        },
      });

      /**
       * コールバック未定義時の安全な動作確認
       * @description コールバック関数がundefinedでもエラーなくレンダリングされることを検証
       */
      expect(() => {
        render(
          <ReactFlowTestWrapper>
            <EditableEdge {...propsWithoutCallbacks} />
          </ReactFlowTestWrapper>
        );
      }).not.toThrow();

      await waitFor(() => {
        expect(screen.getByText("テスト")).toBeInTheDocument();
      });
    });

    test("無効データでのレンダリングエラー防止", async () => {
      const propsWithInvalidData = createMockEdgeProps({
        data: {
          label: "",
          arrowType: "invalid" as MermaidArrowType,
          onLabelChange: vi.fn(),
          onArrowTypeChange: vi.fn(),
          onDelete: vi.fn(),
        },
      });

      /**
       * 無効データでの安全な動作確認
       * @description 無効な矢印タイプなどでもエラーなくレンダリングされることを検証
       */
      expect(() => {
        render(
          <ReactFlowTestWrapper>
            <EditableEdge {...propsWithInvalidData} />
          </ReactFlowTestWrapper>
        );
      }).not.toThrow();

      await waitFor(() => {
        expect(screen.getByText("...")).toBeInTheDocument();
      });
    });
  });

  describe("ReactFlowコンテキスト連携", () => {
    test("useReactFlowフックの正常動作", async () => {
      /**
       * ReactFlowコンテキストとの連携確認
       * @description useReactFlowフックが正常に動作してエラーが発生しないことを検証
       */
      expect(() => {
        render(
          <ReactFlowTestWrapper>
            <EditableEdge {...mockProps} />
          </ReactFlowTestWrapper>
        );
      }).not.toThrow();

      await waitFor(() => {
        expect(screen.getByText("テストエッジ")).toBeInTheDocument();
      });
    });
  });
});
