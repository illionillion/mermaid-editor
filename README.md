# Mermaid フローチャート エディター

ReactFlowを使ったMermaidフローチャートのGUIエディターです。ドラッグ&ドロップでフローチャートを作成し、Mermaid形式のコードとして出力できます。

## 🌐 Live Demo

GitHub Pagesで公開されています：
**[https://github.com/illionillion/mermaid-editor/](https://github.com/illionillion/mermaid-editor/)**

## ✨ 機能

- 📝 ノードをダブルクリックでテキスト編集
- 🔗 ドラッグ&ドロップでノード間を接続
- ➕ エッジを空の場所にドロップして新しいノード作成
- 📋 Mermaidコードの生成・コピー・ダウンロード
- 🎨 直感的なビジュアルインターフェース

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

- **Next.js 14** (App Router)
- **ReactFlow** - フローチャート作成
- **Yamada UI** - UIコンポーネント
- **TypeScript** - 型安全性
- **GitHub Actions** - 自動デプロイ
- **GitHub Pages** - ホスティング

## 📦 ビルド・デプロイ

### ローカルビルド

```bash
pnpm build
```

### 自動デプロイ

mainブランチにプッシュすると、GitHub Actionsが自動的に：

1. アプリケーションをビルド
2. `docs`フォルダに静的ファイルを出力
3. GitHub Pagesにデプロイ

## 🎯 使い方

1. **ノード追加**: 左上の「ノード追加」ボタンまたはエッジを空の場所にドロップ
2. **ノード編集**: ノードをダブルクリックしてテキストを編集
3. **ノード接続**: ノードの端点をドラッグして他のノードに接続
4. **コード生成**: 「コード生成」ボタンでMermaidコードを表示
5. **ダウンロード**: 生成されたコードをファイルとして保存

## 📁 プロジェクト構成

```
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── editable-node.tsx
│   ├── flow-editor.tsx
│   ├── flow-panel.tsx
│   ├── download-modal.tsx
│   ├── copy-button.tsx
│   ├── node-types.tsx
│   └── types.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
└── docs/ (自動生成)
```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
