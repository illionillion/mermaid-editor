# Mermaid フローチャート エディター

ReactFlowを使った高機能なMermaidフローチャートのGUIエディターです。直感的なドラッグ&ドロップ操作でフローチャートを作成し、Mermaid形式のコードとして出力できます。

## 🌐 Live Demo

GitHub Pagesで公開されています：
**[https://illionillion.github.io/mermaid-editor/](https://illionillion.github.io/mermaid-editor/)**

## ✨ 主要機能

### 📝 ノード編集機能

- **ダブルクリック編集**: ノードラベルをダブルクリックで直接編集
- **変数名編集**: ノード左上の変数名をクリックして編集
- **図形変更**: ノードメニューから矩形、円形、菱形、六角形を選択可能
- **ノード削除**: 右クリックメニューまたはノードメニューから削除

### 🔗 接続・フロー機能

- **ドラッグ接続**: ノード間をドラッグして矢印で接続
- **エッジタイプ**: 実線、点線、太線の矢印タイプを選択可能
- **自動ノード作成**: エッジを空の場所にドロップして新しいノード作成
- **エッジ削除**: エッジをクリックして削除

### 📋 コード生成・エクスポート

- **Mermaidコード生成**: リアルタイムでMermaid形式のコードを生成
- **コピー機能**: ワンクリックでクリップボードにコピー
- **ダウンロード**: `.mmd`ファイルとしてダウンロード
- **シンタックスハイライト**: 生成されたコードを見やすく表示

### 🎨 UI・UX

- **直感的操作**: マウス操作だけでフローチャート作成
- **日本語対応**: 完全日本語インターフェース
- **レスポンシブ**: デスクトップ・タブレット対応
- **リアルタイムプレビュー**: 編集内容を即座に反映

## 🚀 Getting Started

まず、開発サーバーを起動します：

```bash
pnpm dev
# または
npm run dev
# または
yarn dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いて結果を確認できます。

## 🛠️ 技術スタック

### フロントエンド・フレームワーク

- **Next.js 14** (App Router) - フルスタックReactフレームワーク
- **ReactFlow** - 高性能フローチャートライブラリ
- **Yamada UI** - モダンなReact UIコンポーネント
- **TypeScript** - 型安全な開発環境
- **React Syntax Highlighter** - コードシンタックスハイライト

### 開発ツール・品質管理

- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマット
- **lefthook** - Git hooksマネージャー
- **commitlint** - コミットメッセージ規約チェック

### インフラ・デプロイ

- **GitHub Actions** - CI/CD パイプライン
- **GitHub Pages** - 静的サイトホスティング
- **pnpm** - 高速パッケージマネージャー

## 📦 ビルド・デプロイ

### ローカルビルド

```bash
pnpm build
```

### 自動デプロイ

## 🚀 デプロイ

### GitHub Pages 自動デプロイ

このプロジェクトは GitHub Actions を使用して自動デプロイされます：

1. **mainブランチにプッシュ**すると自動的に：
   - Next.js アプリケーションをビルド
   - 静的ファイルを `docs/` フォルダに出力
   - GitHub Pages にデプロイ

2. **デプロイ設定**:
   - `next.config.mjs` でstatic export設定
   - `.github/workflows/deploy.yml` でCI/CD設定
   - GitHub Pages settings で `docs/` フォルダを配信元に設定

### 手動デプロイ

```bash
# プロダクションビルド
pnpm build

# ローカルで確認
pnpm start
```

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

### 開発の流れ

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット
   - lefthookにより自動でlint・format実行
   - Conventional Commitsに準拠したメッセージを使用
   - 例: `git commit -m 'feat: add some amazing feature'`
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コミットメッセージガイドライン

このプロジェクトでは[Conventional Commits](https://www.conventionalcommits.org/)を採用しています。コミット時にcommitlintが自動でメッセージをチェックします。

正しい例:

- `feat: 新しい図形タイプを追加`
- `fix: ノード削除時のバグを修正`
- `docs: READMEを更新`

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 👨‍💻 作者

**illionillion**

- GitHub: [@illionillion](https://github.com/illionillion)

---

⭐ このプロジェクトが役に立った場合は、スターをつけていただけると嬉しいです！

## 🎯 使い方

### 基本操作

1. **ノード追加**:
   - 左パネルの「ノード追加」ボタンをクリック
   - または既存のエッジを空の場所にドロップ

2. **ノード編集**:
   - **ラベル編集**: ノードをダブルクリックしてテキストを編集
   - **変数名編集**: ノード左上の変数名をクリックして編集
   - **図形変更**: ノード右上のメニューから形状を選択

3. **ノード接続**:
   - ノードの端点（ハンドル）をドラッグして他のノードに接続
   - エッジタイプ（実線・点線・太線）を選択可能

4. **削除操作**:
   - **ノード削除**: ノードメニューの削除ボタン
   - **エッジ削除**: エッジをクリックして選択後削除

### コード出力

1. **コード生成**: 右パネルの「コード生成」ボタンでMermaidコードを表示
2. **コピー**: 「コピー」ボタンでクリップボードに保存
3. **ダウンロード**: 「ダウンロード」ボタンで`.mmd`ファイルとして保存

### 対応図形

- **矩形** (`[]`): 標準的な処理ブロック
- **円形** (`(())`): 開始・終了ノード
- **菱形** (`{}`): 判定・分岐ノード
- **六角形** (`{{}}`): 準備・前処理ノード

## 📁 プロジェクト構成

```
├── app/                      # Next.js App Router
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # メインページ
│   └── sample/              # サンプルページ
├── components/              # Reactコンポーネント
│   ├── editor/              # テキスト編集コンポーネント
│   │   ├── label-editor.tsx
│   │   └── variable-name-editor.tsx
│   ├── flow/                # フローチャート関連
│   │   ├── flow-editor.tsx  # メインエディター
│   │   ├── flow-panel.tsx   # サイドパネル
│   │   ├── flow-helpers.ts  # ビジネスロジック
│   │   ├── editable-edge.tsx
│   │   ├── edge-types.tsx
│   │   └── node-types.tsx
│   ├── mermaid/             # Mermaid関連
│   │   ├── download-modal.tsx
│   │   └── mermaid-highlight.tsx
│   ├── node/                # ノード関連
│   │   ├── editable-node.tsx
│   │   ├── node-menu.tsx
│   │   └── shape-selector.tsx
│   ├── ui/                  # 共通UIコンポーネント
│   │   └── copy-button.tsx
│   └── types/               # 型定義
│       └── types.ts
├── utils/                   # ユーティリティ関数
│   └── mermaid.ts          # Mermaid変換ロジック
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml          # 自動デプロイ設定
├── .commitlintrc           # commitlint設定
├── lefthook.yml            # Git hooks設定
├── eslint.config.ts        # ESLint設定
├── .prettierrc             # Prettier設定
└── docs/                   # GitHub Pages出力 (自動生成)
```

## 🔧 開発環境

### 必要な環境

- **Node.js** 18.0.0 以上
- **pnpm** 8.0.0 以上 (推奨)

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/illionillion/mermaid-editor.git
cd mermaid-editor

# 依存関係をインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

**注意**: 初回のpnpm install時に、lefthookが自動的にGit hooksをインストールします。これにより、コミット時の品質チェックが有効になります。

### 利用可能なスクリプト

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm start        # プロダクションサーバー起動
pnpm lint         # ESLintチェック
pnpm lint:fix     # ESLint自動修正
pnpm format       # Prettier実行
pnpm format:check # Prettierチェック
pnpm type-check   # TypeScript型チェック
pnpm check        # 全チェック実行
pnpm fix          # 全自動修正実行
pnpm prepare      # lefthookインストール
pnpm commitlint   # コミットメッセージ検証
```

### 🔧 開発ツール

このプロジェクトでは以下の開発ツールが設定されています：

#### Git Hooks (lefthook)

- **pre-commit**: コミット前に自動でESLintとPrettierを実行
- **commit-msg**: コミットメッセージがConventional Commitsに準拠しているかチェック
- **post-merge/post-checkout/post-rewrite**: package.jsonやpnpm-lock.yamlの変更時に自動でpnpm install

#### Conventional Commits

コミットメッセージは以下の形式に従ってください：

```
<type>: <description>

例:
feat: 新機能を追加
fix: バグを修正
docs: ドキュメントを更新
style: コードスタイルを修正
refactor: リファクタリング
perf: パフォーマンス改善
test: テストを追加・修正
chore: その他の作業
ci: CI/CD設定を変更
build: ビルド設定を変更
revert: 変更を取り消し
```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
