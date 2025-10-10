import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { LabelEditor } from "@/features/flowchart/components/editor/label-editor";

/**
 * LabelEditorコンポーネント
 * @description ノードラベルを表示・編集するコンポーネント
 * - ダブルクリックで編集モードに切り替わる
 * - Enterキーまたはフォーカス外しで編集を確定
 * - 日本語入力（IME）に対応
 */
const meta: Meta<typeof LabelEditor> = {
  title: "components/editor/LabelEditor",
  component: LabelEditor,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "表示するラベルテキスト",
    },
    isEditing: {
      control: "boolean",
      description: "編集モードかどうか",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LabelEditor>;

/**
 * 基本状態: 表示モード
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("ノードラベル");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div style={{ width: "200px", padding: "20px", border: "1px solid #ccc" }}>
        <LabelEditor
          value={value}
          isEditing={isEditing}
          onDoubleClick={() => setIsEditing(true)}
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
    const [value, setValue] = useState("編集中のテキスト");
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div style={{ width: "200px", padding: "20px", border: "1px solid #ccc" }}>
        <LabelEditor
          value={value}
          isEditing={true}
          onDoubleClick={() => {}}
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
 * 長いテキスト
 */
export const LongText: Story = {
  render: () => {
    const [value, setValue] = useState(
      "これは非常に長いテキストで改行を含む複数行のラベルです。テキストは自動的に折り返されます。"
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div style={{ width: "200px", padding: "20px", border: "1px solid #ccc" }}>
        <LabelEditor
          value={value}
          isEditing={isEditing}
          onDoubleClick={() => setIsEditing(true)}
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
 * 空のラベル
 */
export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div style={{ width: "200px", padding: "20px", border: "1px solid #ccc" }}>
        <LabelEditor
          value={value}
          isEditing={isEditing}
          onDoubleClick={() => setIsEditing(true)}
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
 * 多言語対応
 */
export const Multilingual: Story = {
  render: () => {
    const [value, setValue] = useState("日本語 English 中文 한국어 العربية");
    const [isEditing, setIsEditing] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    return (
      <div style={{ width: "200px", padding: "20px", border: "1px solid #ccc" }}>
        <LabelEditor
          value={value}
          isEditing={isEditing}
          onDoubleClick={() => setIsEditing(true)}
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
