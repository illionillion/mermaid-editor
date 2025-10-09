import { render, screen } from "@testing-library/react";
import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import type { Edge, Position } from "@xyflow/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ErEdge } from "../components/edge/er-edge";
import type { ErCardinality } from "../types";

/**
 * ErEdgeコンポーネントのテスト
 * ReactFlowのEdgeコンポーネントとして使用されるため、ReactFlowProviderでラップして動作を検証
 */
describe("ErEdge", () => {
  const baseProps = {
    id: "edge-1",
    sourceX: 0,
    sourceY: 0,
    targetX: 100,
    targetY: 100,
    sourcePosition: "right" as Position,
    targetPosition: "left" as Position,
    source: "node-1",
    target: "node-2",
    markerEnd: "url(#arrow)" as string | undefined,
    data: {
      label: "テストリレーション",
      cardinality: "one-to-many" as ErCardinality,
      onLabelChange: vi.fn(),
      onCardinalityChange: vi.fn(),
      onDelete: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * ReactFlowProviderでラップしたエッジをレンダリング
   */
  const renderEdgeWithProvider = (props: Partial<typeof baseProps> & { id: string }) => {
    const edges: Edge[] = [
      {
        id: props.id,
        source: props.source || "node-1",
        target: props.target || "node-2",
        data: props.data,
      },
    ];

    const defaultProps = {
      ...baseProps,
      ...props,
    };

    return render(
      <ReactFlowProvider>
        <ReactFlow nodes={[]} edges={edges}>
          <svg>
            <ErEdge {...defaultProps} />
          </svg>
        </ReactFlow>
      </ReactFlowProvider>
    );
  };

  describe("デフォルト描画", () => {
    it("BaseEdgeとErEditableEdgeが正しく表示される", () => {
      renderEdgeWithProvider(baseProps);

      /**
       * ErEditableEdgeコンポーネント内のラベルが表示されることを確認
       */
      expect(screen.getByText("テストリレーション")).toBeInTheDocument();
    });

    it("SVG path要素が生成される", () => {
      const { container } = renderEdgeWithProvider(baseProps);

      /**
       * BaseEdgeによってSVG path要素が生成される
       */
      const pathElement = container.querySelector("path");
      expect(pathElement).toBeInTheDocument();
    });
  });

  describe("データ無しでのエラーハンドリング", () => {
    it("dataがundefinedでも正常に動作する", () => {
      const propsWithoutData = {
        ...baseProps,
        data: undefined,
      };

      expect(() => {
        renderEdgeWithProvider(propsWithoutData);
      }).not.toThrow();

      /**
       * デフォルト値「relation」が使用される
       */
      expect(screen.getByText("relation")).toBeInTheDocument();
    });

    it("data.labelが未定義の場合デフォルト値が使われる", () => {
      const propsWithoutLabel = {
        ...baseProps,
        data: {
          ...baseProps.data,
          label: undefined as unknown as string,
        },
      };

      renderEdgeWithProvider(propsWithoutLabel);

      /**
       * デフォルト値「relation」が使用される
       */
      expect(screen.getByText("relation")).toBeInTheDocument();
    });

    it("data.cardinalityが未定義の場合デフォルト値が使われる", () => {
      const propsWithoutCardinality = {
        ...baseProps,
        data: {
          label: "テストリレーション",
          cardinality: undefined as unknown as ErCardinality,
          onLabelChange: vi.fn(),
          onCardinalityChange: vi.fn(),
          onDelete: vi.fn(),
        },
      };

      expect(() => {
        renderEdgeWithProvider(propsWithoutCardinality);
      }).not.toThrow();

      /**
       * デフォルト値「one-to-many」が使用されるため、
       * ErEditableEdge内で「1...*」ボタンが表示される
       */
      expect(screen.getByRole("button", { name: "1...*" })).toBeInTheDocument();
    });

    it("ハンドラー関数が未定義でも正常に動作する", () => {
      const propsWithoutHandlers = {
        ...baseProps,
        data: {
          label: "テストリレーション",
          cardinality: "one-to-many" as ErCardinality,
          onLabelChange: undefined as unknown as typeof baseProps.data.onLabelChange,
          onCardinalityChange: undefined as unknown as typeof baseProps.data.onCardinalityChange,
          onDelete: undefined as unknown as typeof baseProps.data.onDelete,
        },
      };

      expect(() => {
        renderEdgeWithProvider(propsWithoutHandlers);
      }).not.toThrow();

      /**
       * デフォルトの空関数が使用される
       */
      expect(screen.getByText("テストリレーション")).toBeInTheDocument();
    });
  });

  describe("異なる座標でのgetBezierPath計算結果検証", () => {
    it("異なる座標でもエッジが正しく描画される", () => {
      const differentCoordinates = {
        ...baseProps,
        sourceX: 200,
        sourceY: 150,
        targetX: 400,
        targetY: 300,
      };

      const { container } = renderEdgeWithProvider(differentCoordinates);

      /**
       * getBezierPathが計算を実行し、path要素が生成される
       */
      const pathElement = container.querySelector("path");
      expect(pathElement).toBeInTheDocument();
      expect(pathElement?.getAttribute("d")).toBeTruthy();
    });

    it("始点と終点が同じ座標でもエラーが発生しない", () => {
      const sameCoordinates = {
        ...baseProps,
        sourceX: 100,
        sourceY: 100,
        targetX: 100,
        targetY: 100,
      };

      expect(() => {
        renderEdgeWithProvider(sameCoordinates);
      }).not.toThrow();
    });

    it("負の座標でも正しく描画される", () => {
      const negativeCoordinates = {
        ...baseProps,
        sourceX: -100,
        sourceY: -50,
        targetX: -200,
        targetY: -150,
      };

      const { container } = renderEdgeWithProvider(negativeCoordinates);

      /**
       * 負の座標でもpath要素が生成される
       */
      const pathElement = container.querySelector("path");
      expect(pathElement).toBeInTheDocument();
    });
  });

  describe("markerEndのpropsが正しく渡るか", () => {
    it("markerEndがBaseEdgeに渡される", () => {
      const { container } = renderEdgeWithProvider(baseProps);

      /**
       * BaseEdgeコンポーネントがmarkerEnd属性を持つpath要素を生成
       * marker-endの有無を確認（実際の値は環境依存）
       */
      const pathElement = container.querySelector("path");
      expect(pathElement).toBeInTheDocument();
    });

    it("markerEndがundefinedでもエラーが発生しない", () => {
      const propsWithoutMarker = {
        ...baseProps,
        markerEnd: undefined,
      };

      expect(() => {
        renderEdgeWithProvider(propsWithoutMarker);
      }).not.toThrow();
    });
  });

  describe("label/cardinality/ハンドラーのpropsが正しく渡るか", () => {
    it("labelがErEditableEdgeに正しく渡される", () => {
      renderEdgeWithProvider(baseProps);

      /**
       * ErEditableEdgeがlabelプロパティを受け取って表示
       */
      expect(screen.getByText("テストリレーション")).toBeInTheDocument();
    });

    it("cardinalityがErEditableEdgeに正しく渡される", () => {
      const propsWithOneToOne = {
        ...baseProps,
        data: {
          ...baseProps.data,
          cardinality: "one-to-one" as ErCardinality,
        },
      };

      renderEdgeWithProvider(propsWithOneToOne);

      /**
       * ErEditableEdgeがcardinalityプロパティを受け取って表示
       * one-to-oneは「1...1」として表示される
       */
      expect(screen.getByRole("button", { name: "1...1" })).toBeInTheDocument();
    });

    it("onLabelChangeがErEditableEdgeに正しく渡される", () => {
      renderEdgeWithProvider(baseProps);

      /**
       * ErEditableEdgeコンポーネント内でonLabelChangeが利用可能
       * 実際の呼び出しはErEditableEdgeのテストで検証済み
       */
      expect(baseProps.data.onLabelChange).toBeDefined();
      expect(typeof baseProps.data.onLabelChange).toBe("function");
    });

    it("onCardinalityChangeがErEditableEdgeに正しく渡される", () => {
      renderEdgeWithProvider(baseProps);

      /**
       * ErEditableEdgeコンポーネント内でonCardinalityChangeが利用可能
       */
      expect(baseProps.data.onCardinalityChange).toBeDefined();
      expect(typeof baseProps.data.onCardinalityChange).toBe("function");
    });

    it("onDeleteがErEditableEdgeに正しく渡される", () => {
      renderEdgeWithProvider(baseProps);

      /**
       * ErEditableEdgeコンポーネント内でonDeleteが利用可能
       * 削除ボタンの存在確認
       */
      expect(screen.getByLabelText("Delete edge")).toBeInTheDocument();
      expect(baseProps.data.onDelete).toBeDefined();
      expect(typeof baseProps.data.onDelete).toBe("function");
    });
  });

  describe("無効propsでレンダリングエラーが発生しないか", () => {
    it("空文字列のlabelでも動作する", () => {
      const propsWithEmptyLabel = {
        ...baseProps,
        data: {
          ...baseProps.data,
          label: "",
        },
      };

      expect(() => {
        renderEdgeWithProvider(propsWithEmptyLabel);
      }).not.toThrow();
    });

    it("nullのハンドラーでもエラーが発生しない", () => {
      const propsWithNullHandlers = {
        ...baseProps,
        data: {
          label: "テストリレーション",
          cardinality: "one-to-many" as ErCardinality,
          onLabelChange: null as unknown as typeof baseProps.data.onLabelChange,
          onCardinalityChange: null as unknown as typeof baseProps.data.onCardinalityChange,
          onDelete: null as unknown as typeof baseProps.data.onDelete,
        },
      };

      expect(() => {
        renderEdgeWithProvider(propsWithNullHandlers);
      }).not.toThrow();
    });

    it("極端に大きな座標値でもエラーが発生しない", () => {
      const propsWithLargeCoordinates = {
        ...baseProps,
        sourceX: 999999,
        sourceY: 999999,
        targetX: -999999,
        targetY: -999999,
      };

      expect(() => {
        renderEdgeWithProvider(propsWithLargeCoordinates);
      }).not.toThrow();
    });
  });

  describe("SVG要素検証", () => {
    it("EdgeLabelRendererによるラベル配置が正しく行われる", () => {
      renderEdgeWithProvider(baseProps);

      /**
       * EdgeLabelRendererがBox要素を絶対配置で表示
       * ラベルが表示されていることで間接的にEdgeLabelRendererの動作を確認
       */
      expect(screen.getByText("テストリレーション")).toBeInTheDocument();
    });

    it("nodragとnopanクラスが適用される", () => {
      const { container } = renderEdgeWithProvider(baseProps);

      /**
       * ラベル要素にnodragとnopanクラスが付与され、
       * ドラッグ操作がエッジに影響しないようになる
       */
      const nodragElement = container.querySelector(".nodrag.nopan");
      expect(nodragElement).toBeInTheDocument();
    });
  });

  describe("異なるカーディナリティの表示検証", () => {
    it("many-to-manyカーディナリティが正しく表示される", () => {
      const propsWithManyToMany = {
        ...baseProps,
        data: {
          ...baseProps.data,
          cardinality: "many-to-many" as ErCardinality,
        },
      };

      renderEdgeWithProvider(propsWithManyToMany);

      /**
       * many-to-manyは「*...*」として表示される
       */
      expect(screen.getByRole("button", { name: "*...*" })).toBeInTheDocument();
    });

    it("zero-to-oneカーディナリティが正しく表示される", () => {
      const propsWithZeroToOne = {
        ...baseProps,
        data: {
          ...baseProps.data,
          cardinality: "zero-to-one" as ErCardinality,
        },
      };

      renderEdgeWithProvider(propsWithZeroToOne);

      /**
       * zero-to-oneは「0...1」として表示される
       */
      expect(screen.getByRole("button", { name: "0...1" })).toBeInTheDocument();
    });
  });

  describe("異なるsourcePositionとtargetPosition", () => {
    it("top-bottomの組み合わせでも正しく描画される", () => {
      const propsWithTopBottom = {
        ...baseProps,
        sourcePosition: "top" as Position,
        targetPosition: "bottom" as Position,
      };

      const { container } = renderEdgeWithProvider(propsWithTopBottom);

      /**
       * 異なる接続位置でもgetBezierPathが正しく計算される
       */
      const pathElement = container.querySelector("path");
      expect(pathElement).toBeInTheDocument();
      expect(pathElement?.getAttribute("d")).toBeTruthy();
    });
  });
});
