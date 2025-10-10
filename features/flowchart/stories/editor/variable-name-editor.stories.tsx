import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { VariableNameEditor } from "@/features/flowchart/components/editor/variable-name-editor";
import type { MermaidShapeType } from "@/features/flowchart/types/types";

/**
 * VariableNameEditorコンポーネント
 * @description ノードの変数名を表示・編集するコンポーネント
 * - クリックで編集モードに切り替わる
 * - Enterキーまたはフォーカス外しで編集を確定
 * - 形状タイプに応じた記号表示（Mermaid記法）
 * - ノードの左上に配置される小さなバッジ型エディタ
 */
const meta: Meta<typeof VariableNameEditor> = {
  title: "components/editor/VariableNameEditor",
  component: VariableNameEditor,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "変数名",
    },
    isEditing: {
      control: "boolean",
      description: "編集モードかどうか",
    },
    shapeType: {
      control: "select",
      options: [
        "rectangle",
        "rounded",
        "stadium",
        "subroutine",
        "cylindrical",
        "circle",
        "asymmetric",
        "rhombus",
        "hexagon",
        "parallelogram",
        "parallelogram-alt",
        "trapezoid",
        "trapezoid-alt",
        "double-circle",
      ],
      description: "ノード形状タイプ",
    },
  },
};

export default meta;
type Story = StoryObj<typeof VariableNameEditor>;

/**
 * 基本状態: Rectangle（長方形）
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("node1");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "100px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <VariableNameEditor
          value={value}
          isEditing={isEditing}
          shapeType="rectangle"
          onClick={() => setIsEditing(true)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              setIsEditing(false);
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={() => setIsEditing(false)}
        />
      </div>
    );
  },
};

/**
 * 編集モード
 */
export const Editing: Story = {
  render: () => {
    const [value, setValue] = useState("editNode");
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "100px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <VariableNameEditor
          value={value}
          isEditing={true}
          shapeType="rectangle"
          onClick={() => {}}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              alert("Enterキー押下");
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={() => alert("フォーカスアウト")}
        />
      </div>
    );
  },
};

/**
 * 各形状タイプ: Circle（円形）
 */
export const CircleShape: Story = {
  render: () => {
    const [value, setValue] = useState("circleNode");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "100px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <VariableNameEditor
          value={value}
          isEditing={isEditing}
          shapeType="circle"
          onClick={() => setIsEditing(true)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              setIsEditing(false);
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={() => setIsEditing(false)}
        />
      </div>
    );
  },
};

/**
 * 各形状タイプ: Rhombus（菱形）
 */
export const RhombusShape: Story = {
  render: () => {
    const [value, setValue] = useState("decision");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "100px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <VariableNameEditor
          value={value}
          isEditing={isEditing}
          shapeType="rhombus"
          onClick={() => setIsEditing(true)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              setIsEditing(false);
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={() => setIsEditing(false)}
        />
      </div>
    );
  },
};

/**
 * 各形状タイプ: Hexagon（六角形）
 */
export const HexagonShape: Story = {
  render: () => {
    const [value, setValue] = useState("process");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "100px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <VariableNameEditor
          value={value}
          isEditing={isEditing}
          shapeType="hexagon"
          onClick={() => setIsEditing(true)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              setIsEditing(false);
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={() => setIsEditing(false)}
        />
      </div>
    );
  },
};

/**
 * 空の変数名
 */
export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "100px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <VariableNameEditor
          value={value}
          isEditing={isEditing}
          shapeType="rectangle"
          onClick={() => setIsEditing(true)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              setIsEditing(false);
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={() => setIsEditing(false)}
        />
      </div>
    );
  },
};

/**
 * 複数の形状を並べて比較
 */
export const AllShapes: Story = {
  render: () => {
    const shapes: MermaidShapeType[] = [
      "rectangle",
      "circle",
      "rhombus",
      "hexagon",
      "stadium",
      "cylindrical",
    ];

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {shapes.map((shape) => {
          const [value, setValue] = useState(`${shape}Node`);
          const [isEditing, setIsEditing] = useState(false);
          const [isComposing, setIsComposing] = useState(false);

          return (
            <div
              key={shape}
              style={{
                position: "relative",
                width: "180px",
                height: "100px",
                padding: "20px",
                border: "1px solid #ccc",
              }}
            >
              <div style={{ fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>
                {shape}
              </div>
              <VariableNameEditor
                value={value}
                isEditing={isEditing}
                shapeType={shape}
                onClick={() => setIsEditing(true)}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isComposing) {
                    setIsEditing(false);
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onBlur={() => setIsEditing(false)}
              />
            </div>
          );
        })}
      </div>
    );
  },
};
