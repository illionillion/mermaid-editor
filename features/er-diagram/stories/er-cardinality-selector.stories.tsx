import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ErCardinalitySelector } from "@/features/er-diagram/components/edge/er-cardinality-selector";
import type { ErCardinality } from "@/features/er-diagram/types";

/**
 * ErCardinalitySelectorコンポーネント
 * @description ER図のリレーション基数（カーディナリティ）を選択するドロップダウン
 * - 一対一、一対多、多対多などのリレーション種別を選択
 * - 各基数にはER図の記号が表示される
 * - エッジ編集時に使用される
 */
const meta: Meta<typeof ErCardinalitySelector> = {
  title: "components/er/ErCardinalitySelector",
  component: ErCardinalitySelector,
  tags: ["autodocs"],
  argTypes: {
    current: {
      control: "select",
      options: [
        "one-to-one",
        "one-to-many",
        "many-to-one",
        "many-to-many",
        "zero-to-one",
        "one-to-zero",
        "one-to-many-mandatory",
      ],
      description: "現在選択されている基数",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErCardinalitySelector>;

/**
 * 基本状態: one-to-one（1対1）選択
 */
export const Default: Story = {
  render: () => {
    const [cardinality, setCardinality] = useState<ErCardinality>("one-to-one");

    return (
      <div style={{ padding: "20px" }}>
        <ErCardinalitySelector current={cardinality} onChange={setCardinality} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{cardinality}</strong>
        </div>
      </div>
    );
  },
};

/**
 * zero-to-one（0対1）選択
 */
export const ZeroToOne: Story = {
  render: () => {
    const [cardinality, setCardinality] = useState<ErCardinality>("zero-to-one");

    return (
      <div style={{ padding: "20px" }}>
        <ErCardinalitySelector current={cardinality} onChange={setCardinality} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{cardinality}</strong>
        </div>
      </div>
    );
  },
};

/**
 * many-to-many（多対多）選択
 */
export const ManyToMany: Story = {
  render: () => {
    const [cardinality, setCardinality] = useState<ErCardinality>("many-to-many");

    return (
      <div style={{ padding: "20px" }}>
        <ErCardinalitySelector current={cardinality} onChange={setCardinality} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{cardinality}</strong>
        </div>
      </div>
    );
  },
};

/**
 * one-to-many（1対多）選択
 */
export const OneToMany: Story = {
  render: () => {
    const [cardinality, setCardinality] = useState<ErCardinality>("one-to-many");

    return (
      <div style={{ padding: "20px" }}>
        <ErCardinalitySelector current={cardinality} onChange={setCardinality} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{cardinality}</strong>
        </div>
      </div>
    );
  },
};

/**
 * インタラクティブな例：選択時にアラート表示
 */
export const WithAlert: Story = {
  render: () => {
    const [cardinality, setCardinality] = useState<ErCardinality>("one-to-one");

    const handleChange = (newCardinality: ErCardinality) => {
      setCardinality(newCardinality);
      alert(`基数が変更されました: ${newCardinality}`);
    };

    return (
      <div style={{ padding: "20px" }}>
        <ErCardinalitySelector current={cardinality} onChange={handleChange} />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          選択中: <strong>{cardinality}</strong>
        </div>
      </div>
    );
  },
};

/**
 * 複数のセレクターを並べて配置（左右のエッジ基数を表現）
 */
export const Multiple: Story = {
  render: () => {
    const [leftCardinality, setLeftCardinality] = useState<ErCardinality>("one-to-one");
    const [rightCardinality, setRightCardinality] = useState<ErCardinality>("one-to-many");

    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>左側の基数</div>
            <ErCardinalitySelector current={leftCardinality} onChange={setLeftCardinality} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <strong>{leftCardinality}</strong>
            </div>
          </div>

          <div style={{ fontSize: "24px", color: "#999" }}>━━━</div>

          <div>
            <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>右側の基数</div>
            <ErCardinalitySelector current={rightCardinality} onChange={setRightCardinality} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>
              <strong>{rightCardinality}</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
            リレーション
          </div>
          <div style={{ fontSize: "12px" }}>
            左エンティティ {leftCardinality} ━━━ {rightCardinality} 右エンティティ
          </div>
        </div>
      </div>
    );
  },
};

/**
 * 一般的なリレーションパターン：1対多（表示のみ）
 */
export const OneToManyReadOnly: Story = {
  render: () => {
    const [leftCardinality] = useState<ErCardinality>("one-to-one");
    const [rightCardinality] = useState<ErCardinality>("one-to-many");

    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <ErCardinalitySelector current={leftCardinality} onChange={() => {}} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>1</div>
          </div>

          <div style={{ fontSize: "24px", color: "#999" }}>━━━</div>

          <div>
            <ErCardinalitySelector current={rightCardinality} onChange={() => {}} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>多</div>
          </div>
        </div>

        <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          例: 1つの部署に複数の社員が所属する
        </div>
      </div>
    );
  },
};

/**
 * 一般的なリレーションパターン：多対多（表示のみ）
 */
export const ManyToManyReadOnly: Story = {
  render: () => {
    const [leftCardinality] = useState<ErCardinality>("many-to-many");
    const [rightCardinality] = useState<ErCardinality>("many-to-many");

    return (
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <ErCardinalitySelector current={leftCardinality} onChange={() => {}} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>多</div>
          </div>

          <div style={{ fontSize: "24px", color: "#999" }}>━━━</div>

          <div>
            <ErCardinalitySelector current={rightCardinality} onChange={() => {}} />
            <div style={{ marginTop: "8px", fontSize: "12px" }}>多</div>
          </div>
        </div>

        <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          例: 学生は複数の授業を履修し、授業には複数の学生が参加する
        </div>
      </div>
    );
  },
};
