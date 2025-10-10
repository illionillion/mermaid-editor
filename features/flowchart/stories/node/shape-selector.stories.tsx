import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ShapeSelector } from "@/features/flowchart/components/node/shape-selector";

/**
 * ShapeSelectorコンポーネント
 * @description フローチャートノードの形状を選択するドロップダウンメニュー
 * - 各形状にはMermaid記法の記号が表示される
 * - 選択中の形状はハイライト表示される
 * - ノードメニューから形状を変更する際に使用
 */
const meta: Meta<typeof ShapeSelector> = {
  title: "components/node/ShapeSelector",
  component: ShapeSelector,
  tags: ["autodocs"],
  argTypes: {
    currentShape: {
      control: "select",
      options: ["rectangle", "diamond", "rounded", "circle", "hexagon", "stadium"],
      description: "現在選択されている形状",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShapeSelector>;

/**
 * 基本状態: Rectangle（長方形）選択
 */
export const Default: Story = {
  render: () => {
    const [shape, setShape] = useState("rectangle");

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={setShape} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Circle（円形）選択
 */
export const CircleSelected: Story = {
  render: () => {
    const [shape, setShape] = useState("circle");

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={setShape} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Diamond（菱形）選択
 */
export const DiamondSelected: Story = {
  render: () => {
    const [shape, setShape] = useState("diamond");

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={setShape} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Hexagon（六角形）選択
 */
export const HexagonSelected: Story = {
  render: () => {
    const [shape, setShape] = useState("hexagon");

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={setShape} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape}</strong>
        </div>
      </div>
    );
  },
};

/**
 * Stadium（スタジアム型）選択
 */
export const StadiumSelected: Story = {
  render: () => {
    const [shape, setShape] = useState("stadium");

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={setShape} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape}</strong>
        </div>
      </div>
    );
  },
};

/**
 * 未選択状態（currentShapeなし）
 */
export const NoSelection: Story = {
  render: () => {
    const [shape, setShape] = useState<string | undefined>(undefined);

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={setShape} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape ?? "なし"}</strong>
        </div>
      </div>
    );
  },
};

/**
 * コールバックなし（表示のみ）
 */
export const ReadOnly: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <ShapeSelector currentShape="rectangle" />
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        ※ クリックしても変更されません（onShapeChange未指定）
      </div>
    </div>
  ),
};

/**
 * インタラクティブな例：選択時にアラート表示
 */
export const WithAlert: Story = {
  render: () => {
    const [shape, setShape] = useState("rectangle");

    const handleShapeChange = (newShape: string) => {
      setShape(newShape);
      alert(`形状が変更されました: ${newShape}`);
    };

    return (
      <div style={{ padding: "20px" }}>
        <ShapeSelector currentShape={shape} onShapeChange={handleShapeChange} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{shape}</strong>
        </div>
      </div>
    );
  },
};

/**
 * 複数のセレクターを並べて配置
 */
export const Multiple: Story = {
  render: () => {
    const [shape1, setShape1] = useState("rectangle");
    const [shape2, setShape2] = useState("circle");
    const [shape3, setShape3] = useState("diamond");

    return (
      <div style={{ padding: "20px", display: "flex", gap: "40px" }}>
        <div>
          <ShapeSelector currentShape={shape1} onShapeChange={setShape1} />
          <div style={{ marginTop: "10px", fontSize: "12px" }}>
            セレクター1: <strong>{shape1}</strong>
          </div>
        </div>
        <div>
          <ShapeSelector currentShape={shape2} onShapeChange={setShape2} />
          <div style={{ marginTop: "10px", fontSize: "12px" }}>
            セレクター2: <strong>{shape2}</strong>
          </div>
        </div>
        <div>
          <ShapeSelector currentShape={shape3} onShapeChange={setShape3} />
          <div style={{ marginTop: "10px", fontSize: "12px" }}>
            セレクター3: <strong>{shape3}</strong>
          </div>
        </div>
      </div>
    );
  },
};
