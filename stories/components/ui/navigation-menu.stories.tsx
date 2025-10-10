import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavigationMenu } from "@/components/ui/navigation-menu";

/**
 * NavigationMenuコンポーネント
 * @description アプリケーション全体のナビゲーションメニュー
 * - フローチャートエディタとER図エディタを切り替え
 * - 現在のパスに応じて選択中のメニュー項目を表示
 * - ルートパス（/）ではフローチャートエディタを選択状態にする
 * - 選択中のメニュー項目はドロップダウンに表示しない
 */
const meta: Meta<typeof NavigationMenu> = {
  title: "components/ui/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

/**
 * 基本状態: フローチャートエディタ選択中（ルートパス）
 */
export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

/**
 * フローチャートエディタ選択中（明示的パス）
 */
export const FlowChartSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/flow-chart",
      },
    },
  },
};

/**
 * ER図エディタ選択中
 */
export const ERDiagramSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/er-diagram",
      },
    },
  },
};

/**
 * 未知のパス（どちらも選択されていない）
 */
export const UnknownPath: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/unknown-path",
      },
    },
  },
};

/**
 * レイアウト内での配置例
 */
export const InLayout: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/flow-chart",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <div style={{ fontSize: "18px", fontWeight: "bold" }}>Mermaid Editor</div>
      <NavigationMenu />
    </div>
  ),
};

/**
 * ヘッダーバーでの使用例
 */
export const InHeaderBar: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/er-diagram",
      },
    },
  },
  render: () => (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "#1a1a1a",
        color: "white",
        borderBottom: "1px solid #333",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Mermaid Editor</h1>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <NavigationMenu />
        <button
          style={{
            padding: "6px 12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          保存
        </button>
      </div>
    </header>
  ),
};

/**
 * モバイル表示（狭い幅）
 */
export const Mobile: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/flow-chart",
      },
    },
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => (
    <div style={{ padding: "16px" }}>
      <NavigationMenu />
    </div>
  ),
};

/**
 * 複数のナビゲーションメニューを並べて比較
 */
export const Multiple: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
      <div>
        <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>ルートパス（/）</div>
        <div
          style={{
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
        >
          <NavigationMenu />
        </div>
      </div>

      <div>
        <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>
          フローチャートエディタ（/flow-chart）
        </div>
        <div
          style={{
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
        >
          <NavigationMenu />
        </div>
      </div>

      <div>
        <div style={{ fontSize: "12px", marginBottom: "8px", color: "#666" }}>
          ER図エディタ（/er-diagram）
        </div>
        <div
          style={{
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
        >
          <NavigationMenu />
        </div>
      </div>
    </div>
  ),
};

/**
 * アクセシビリティテスト用
 */
export const AccessibilityTest: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/flow-chart",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "button-name",
            enabled: true,
          },
        ],
      },
    },
  },
};
