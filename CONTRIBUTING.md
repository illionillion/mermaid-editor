# 🤝 コントリビューションガイド

Mermaid フローチャート エディターへのコントリビューションをお考えいただき、ありがとうございます！このガイドでは、プロジェクトへの貢献方法について説明します。

## 🎯 コントリビューションの種類

### 🐛 バグ報告

不具合を発見した場合、以下の情報を含めて [Issue](https://github.com/illionillion/mermaid-editor/issues) を作成してください：

- **環境情報**: OS、ブラウザ、バージョン
- **再現手順**: 詳細なステップ
- **期待する動作**: あるべき動作
- **実際の動作**: 実際に起こった動作
- **スクリーンショット**: 可能であれば画像も

### ✨ 機能提案

新機能のアイデアがある場合：

1. [Discussions](https://github.com/illionillion/mermaid-editor/discussions) で議論
2. フィードバックを得てから Issue 作成
3. 実装の複雑さとメリットを検討

### 📖 ドキュメント改善

- 誤字・脱字の修正
- 説明の改善・追加
- 翻訳（将来的に英語対応予定）

### 💻 コード貢献

バグ修正や新機能の実装

## 🚀 開発ワークフロー

### 1. 環境準備

```bash
# リポジトリをフォーク後、クローン
git clone https://github.com/your-username/mermaid-editor.git
cd mermaid-editor

# 依存関係をインストール
pnpm install

# 開発環境確認
pnpm dev
```

### 2. ブランチ作成

```bash
# 最新のmainから分岐
git checkout main
git pull origin main

# 機能ブランチ作成
git checkout -b feature/your-feature-name
# または
git checkout -b fix/your-bug-fix
```

### 3. 開発

#### コーディング規約

- **TypeScript**: 型安全な実装
- **ESLint**: コード品質チェック通過
- **Prettier**: 自動フォーマット適用
- **テスト**: 新機能は必ずテスト追加

#### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください：

```bash
# 機能追加
git commit -m "feat: add node shape selection feature"

# バグ修正
git commit -m "fix: resolve edge label editing issue"

# ドキュメント
git commit -m "docs: update usage guide"

# リファクタリング
git commit -m "refactor: simplify mermaid generation logic"

# テスト
git commit -m "test: add edge case tests for node sanitization"
```

### 4. テスト

```bash
# 全テスト実行
pnpm test:run

# カバレッジ確認
pnpm test:coverage

# 品質チェック
pnpm check
```

### 5. プルリクエスト

#### PR作成前チェックリスト

- [ ] テストが全て通過
- [ ] カバレッジが下がっていない
- [ ] ESLint/Prettier エラーがない
- [ ] 型エラーがない
- [ ] 動作確認完了

#### PR説明テンプレート

```markdown
## 概要

<!-- 変更内容の簡潔な説明 -->

## 変更点

- [ ] 機能追加/バグ修正/リファクタリング
- [ ] テスト追加/更新
- [ ] ドキュメント更新

## 関連Issue

Closes #123

## テスト

<!-- テスト方法や確認項目 -->

## スクリーンショット

<!-- UI変更がある場合 -->

## チェックリスト

- [ ] 自分でテストした
- [ ] ドキュメントを更新した
- [ ] 破壊的変更がない
```

## 📋 開発ガイドライン

### コード品質

#### TypeScript

```typescript
// Good: 明確な型定義
interface NodeData {
  id: string;
  label: string;
  shape: 'rectangle' | 'circle' | 'diamond' | 'hexagon';
  position: { x: number; y: number };
}

// Bad: any型の使用
const nodeData: any = { ... };
```

#### React

```typescript
// Good: Props型定義
interface Props {
  title: string;
  onUpdate: (value: string) => void;
}

export const Component: React.FC<Props> = ({ title, onUpdate }) => {
  // 実装
};

// Good: useMemoで最適化
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### テスト

#### テストケース例

```typescript
describe("getSafeVariableName", () => {
  test("通常の文字列は変更されない", () => {
    expect(getSafeVariableName("nodeA")).toBe("nodeA");
  });

  test("空文字列はデフォルト値を返す", () => {
    expect(getSafeVariableName("")).toBe("node_unnamed");
  });

  test("予約語にはプレフィックスを追加", () => {
    expect(getSafeVariableName("class")).toBe("node_class");
  });
});
```

### パフォーマンス

#### 最適化ポイント

- React.memo で不要な再レンダリング防止
- useMemo/useCallback で重い計算をキャッシュ
- 大きなフローチャートでの動作確認

## 🔍 レビュープロセス

### 1. 自動チェック

GitHub Actions で以下が実行されます：

- ESLint
- Prettier
- TypeScript
- テスト
- ビルド

### 2. コードレビュー

メンテナーがレビューします：

- コード品質
- 設計の妥当性
- テストの網羅性
- ドキュメントの更新

### 3. フィードバック対応

- 建設的なフィードバックを提供します
- 必要に応じて修正をお願いします
- 質問があれば遠慮なくどうぞ

## 🎉 コントリビューター認定

### 初回コントリビューター

- READMEにお名前を追加
- Twitter での紹介（希望者のみ）

### 継続コントリビューター

- メンテナー権限の付与を検討
- より大きな機能開発への参加

## 📞 サポート・質問

### コミュニケーション

- **一般的な質問**: [Discussions](https://github.com/illionillion/mermaid-editor/discussions)
- **バグ報告**: [Issues](https://github.com/illionillion/mermaid-editor/issues)
- **機能提案**: まず Discussions で議論

### レスポンス時間

- Issues: 2-3日以内
- PR: 1週間以内
- Discussions: 数日以内

## 🙏 行動規範

### 歓迎する姿勢

- 建設的なフィードバック
- 初心者への親切なサポート
- 多様な視点の尊重

### 禁止事項

- 攻撃的・差別的な言動
- スパム・宣伝行為
- 他者の作業を妨害する行為

## 🏆 謝辞

プロジェクトへのコントリビューションは、オープンソースコミュニティの力を示す素晴らしい例です。皆様の貢献により、より良いツールが生まれます。

ご質問がありましたら、遠慮なくお尋ねください。一緒に素晴らしいプロダクトを作りましょう！

---

**Happy Contributing! 🚀**
