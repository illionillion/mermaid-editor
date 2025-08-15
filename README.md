# Mermaid フローチャート エディター

[![Test](https://github.com/illionillion/mermaid-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/illionillion/mermaid-editor/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/Coverage-97.5%25-brightgreen)](https://github.com/illionillion/mermaid-editor)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue)](https://illionillion.github.io/mermaid-editor/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

ReactFlowを使った高機能なMermaidフローチャートのGUIエディターです。直感的なドラッグ&ドロップ操作でフローチャートを作成し、Mermaid形式のコードとして出力できます。

## 🌐 Live Demo

**[https://illionillion.github.io/mermaid-editor/](https://illionillion.github.io/mermaid-editor/)**

## ✨ 主要機能

### 🎯 エディター機能

- **直感的な操作**: ドラッグ&ドロップでフローチャート作成
- **リアルタイム編集**: ダブルクリックでノード・エッジラベルを編集
- **モバイル対応**: タッチ操作による完全なスマホ・タブレット対応
- **自動レイアウト**: 階層的なフローチャートを自動配置

### 🎨 ビジュアル機能

- **豊富な図形**: 矩形、円形、菱形、六角形のノードタイプ
- **柔軟な接続**: 実線、点線、太線の矢印タイプ
- **変数名編集**: Mermaidコードでの識別子をカスタマイズ可能

### � インポート・エクスポート

- **📥 Mermaidコードインポート**: 既存のMermaidコードから視覚的なフローチャートを生成
- **📋 リアルタイムコード生成**: フローチャートの変更が即座にMermaidコードに反映
- **🌟 シンタックスハイライト**: PrismJSによる美しいコード表示
- **💾 多様なエクスポート**: ワンクリックでコピー・ダウンロード

### 🛡️ 品質・セキュリティ

- **🧪 高いテストカバレッジ**: 97.5%以上のテストカバレッジ
- **🔒 XSS対策**: HTMLエスケープによる安全なコード処理
- **🌏 日本語対応**: 完全日本語インターフェース

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/illionillion/mermaid-editor.git
cd mermaid-editor

# 依存関係をインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## 📚 Storybook（コンポーネントカタログ）

本プロジェクトはStorybookによるUIコンポーネントのカタログ・ドキュメントを同梱しています。

- **URL例**:  
  [https://illionillion.github.io/mermaid-editor/storybook/](https://illionillion.github.io/mermaid-editor/storybook/)

### 主な特徴

- 主要UIコンポーネントの動作・APIをブラウザ上で確認可能
- デザイン・実装の共通認識やレビューに活用
- 各種Propsやイベントの挙動をインタラクティブにテスト

### ローカルでの起動

```bash
pnpm storybook
```

→ [http://localhost:6006](http://localhost:6006) で確認

### 静的ビルド

```bash
pnpm build-storybook
# docs/storybook/ に静的ファイルが出力されます
```

### デプロイ

- CIでNext.js静的サイト（docs/）とStorybook（docs/storybook/）を同時にGitHub Pagesへデプロイ
- `/storybook/` サブパスでアクセス可能

## 🛠️ 技術スタック

- **Frontend**: Next.js 14, ReactFlow, TypeScript
- **UI**: Yamada UI, react-simple-code-editor, PrismJS
- **Quality**: ESLint, Prettier, Vitest (97.5% カバレッジ)
- **CI/CD**: GitHub Actions, lefthook
- **Deploy**: GitHub Pages
- **Testing**: Vitest, @testing-library/react, JSDOM

## 📚 ドキュメント

- [📖 使い方ガイド](./USAGE.md) - 基本操作とベストプラクティス
- [⚙️ 開発者ガイド](./DEVELOPMENT.md) - 開発環境構築とアーキテクチャ
- [🧪 テストガイド](./TESTING.md) - テスト戦略と実行方法
- [🤝 コントリビューション](./CONTRIBUTING.md) - 貢献方法とガイドライン
- [📄 ライセンス](./LICENSE) - MIT ライセンス

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) をご覧ください。

## 👨‍💻 作者

**illionillion**

- GitHub: [@illionillion](https://github.com/illionillion)

---

⭐ このプロジェクトが役に立った場合は、スターをつけていただけると嬉しいです！
