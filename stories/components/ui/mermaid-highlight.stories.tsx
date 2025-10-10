import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MermaidHighlight } from "@/components/ui/mermaid-highlight";

/**
 * MermaidHighlightコンポーネント
 * @description Mermaidコードをシンタックスハイライト表示するコンポーネント
 * - react-syntax-highlighterを使用してコードを装飾
 * - 行番号の表示切り替えが可能
 * - 最小高さとフォントサイズのカスタマイズ対応
 * - ダウンロードモーダルやインポートモーダルで使用
 */
const meta: Meta<typeof MermaidHighlight> = {
  title: "components/ui/MermaidHighlight",
  component: MermaidHighlight,
  tags: ["autodocs"],
  argTypes: {
    code: {
      control: "text",
      description: "表示するMermaidコード",
    },
    showLineNumbers: {
      control: "boolean",
      description: "行番号を表示するかどうか",
    },
    minHeight: {
      control: "text",
      description: "最小高さ（CSS単位）",
    },
    fontSize: {
      control: "text",
      description: "フォントサイズ（CSS単位）",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MermaidHighlight>;

/**
 * 基本状態: フローチャートコード
 */
export const Default: Story = {
  args: {
    code: `flowchart TD
    A[開始] --> B{条件分岐}
    B -->|はい| C[処理1]
    B -->|いいえ| D[処理2]
    C --> E[終了]
    D --> E`,
    showLineNumbers: true,
    minHeight: "400px",
    fontSize: "14px",
  },
};

/**
 * ER図のコード
 */
export const ERDiagram: Story = {
  args: {
    code: `erDiagram
    ユーザー ||--o{ 投稿 : "投稿する"
    ユーザー ||--o{ コメント : "コメントする"
    投稿 ||--o{ コメント : "含む"
    
    ユーザー {
        int id PK
        varchar(255) name
        varchar(255) email
    }
    
    投稿 {
        int id PK
        int user_id FK
        text content
        datetime created_at
    }
    
    コメント {
        int id PK
        int user_id FK
        int post_id FK
        text content
    }`,
    showLineNumbers: true,
  },
};

/**
 * 行番号なし
 */
export const WithoutLineNumbers: Story = {
  args: {
    code: `flowchart LR
    A[ノードA] --> B[ノードB]
    B --> C[ノードC]
    C --> D[ノードD]`,
    showLineNumbers: false,
  },
};

/**
 * 小さいフォントサイズ
 */
export const SmallFont: Story = {
  args: {
    code: `flowchart TD
    A[開始] --> B[処理]
    B --> C[終了]`,
    fontSize: "12px",
  },
};

/**
 * 大きいフォントサイズ
 */
export const LargeFont: Story = {
  args: {
    code: `flowchart TD
    A[開始] --> B[処理]
    B --> C[終了]`,
    fontSize: "18px",
  },
};

/**
 * 最小高さ: 小さい
 */
export const ShortHeight: Story = {
  args: {
    code: `flowchart LR
    A --> B`,
    minHeight: "200px",
  },
};

/**
 * 最小高さ: 大きい
 */
export const TallHeight: Story = {
  args: {
    code: `flowchart TD
    A[開始]
    B[処理1]
    C[処理2]
    D[終了]
    A --> B
    B --> C
    C --> D`,
    minHeight: "600px",
  },
};

/**
 * 長いコード（スクロール表示）
 */
export const LongCode: Story = {
  args: {
    code: `flowchart TD
    Start[プロセス開始] --> Input[ユーザー入力受付]
    Input --> Validate{入力値検証}
    Validate -->|有効| Process1[データ処理1]
    Validate -->|無効| Error1[エラー表示]
    Error1 --> Input
    
    Process1 --> Check1{条件1確認}
    Check1 -->|条件1満たす| Process2[データ処理2]
    Check1 -->|条件1満たさない| Process3[データ処理3]
    
    Process2 --> Check2{条件2確認}
    Check2 -->|条件2満たす| Save[データ保存]
    Check2 -->|条件2満たさない| Error2[エラー処理]
    
    Process3 --> Save
    Error2 --> Retry{リトライ}
    Retry -->|する| Process1
    Retry -->|しない| End
    
    Save --> Success[成功メッセージ]
    Success --> End[プロセス終了]`,
    minHeight: "400px",
  },
};

/**
 * 空のコード
 */
export const Empty: Story = {
  args: {
    code: "",
  },
};

/**
 * 各種Mermaid記法の例
 */
export const VariousDiagramTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ marginBottom: "10px" }}>フローチャート</h3>
        <MermaidHighlight
          code={`flowchart LR
    A[開始] --> B[処理] --> C[終了]`}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "10px" }}>シーケンス図</h3>
        <MermaidHighlight
          code={`sequenceDiagram
    Alice->>John: Hello John
    John-->>Alice: Great!`}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: "10px" }}>ガントチャート</h3>
        <MermaidHighlight
          code={`gantt
    title タスク管理
    section タスクA
    実装    :a1, 2024-01-01, 30d`}
        />
      </div>
    </div>
  ),
};

/**
 * エラー状態を想定（不正なMermaid記法）
 */
export const InvalidSyntax: Story = {
  args: {
    code: `flowchart TD
    A[開始 --> B[処理
    C{条件} -->|はい D[終了]`,
  },
};

/**
 * 多言語コード（英語・中国語・韓国語）
 */
export const Multilingual: Story = {
  args: {
    code: `flowchart TD
    A[Start 開始 시작] --> B[Process 処理 프로세스]
    B --> C[End 終了 끝]`,
  },
};
