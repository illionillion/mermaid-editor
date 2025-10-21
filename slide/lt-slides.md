---
marp: true
theme: default
paginate: true
size: 16:9
header: "MermaidパーサーをAIと作った話"
footer: "![width:30px](https://github.com/illionillion.png) @illionillion"
style: |
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  .row {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    justify-content: center;
  }
  .img-wrapper {
    position: relative;
    display: inline-block;
    flex: 1;
    max-width: 45%;
  }
  .img-wrapper img {
    width: 100%;
    height: 300px;
    object-fit: contain;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
  }
  .img-wrapper.before::before {
    content: "Before 🥺";
    position: absolute;
    top: 10px;
    left: 10px;
    background: #ef4444;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    white-space: nowrap;
    z-index: 1;
  }
  .img-wrapper.after::before {
    content: "After 🚀";
    position: absolute;
    top: 10px;
    left: 10px;
    background: #22c55e;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
    white-space: nowrap;
    z-index: 1;
  }
  .small {
    font-size: 0.8em;
  }
  h1 {
    color: #2563eb;
  }
  h2 {
    color: #1e40af;
  }
  code {
    background: #f1f5f9;
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
  }

    .img-container {
    width: 500px;
    height: 500px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .row2 {
    width: 100%;
    justify-content: space-between;
    display: flex;

    div {
      flex: 1;
    }

    div:nth-child(1) {
      justify-content: center;
      display: flex;
      align-items: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
---

# MermaidパーサーをAIと作った話

<!-- ## 失敗から学んだAI協業のコツ -->

<!-- **5分ショートLT** -->

---

# 自己紹介 & プロダクト紹介

---

# プロダクト紹介

- ### 「Mermaid便利だけど毎回調べるのも覚えるのもめんどくさい😭」
- ### 「FigjamみたいにGUIで作れるツールがあれば良いのに🥺」
- ### ↑作ってみた

---

# 実演😎

<!--

紹介する機能

- フローチャート
  - Mermaid生成
    - 図形や矢印を選べる
  - Mermaidインポート
- ER図
  - Mermaid生成
    - 図形や矢印を選べる
  - Mermaidインポート

 -->

---

# 技術構成

### **FE** - Next.js

### **UIライブラリ** - Yamada UI

### **GUIライブラリ** - React Flow

### **デプロイ** - GitHub Pages

---

# AIに実装させた箇所

---

# Mermaid生成の文字列結合ロジック

<div class="row">
  <div class="img-wrapper before">
    <img src="./image1.png" alt="before" />
  </div>
  <div class="img-wrapper after">
    <img src="./image2.png" alt="after" />
  </div>
</div>

### React Flowのデータから複雑な文字列結合をしなければならない🥺

---

# Mermaidインポートの正規表現

<div class="row2">

  <div>正規表現地獄🥺</div>

  <div class="img-container">
    <img src="./image3.png" />
  </div>
</div>

---

# テストコード生成

### 「Mermaid変換する処理書いて」→ 失敗の繰り返し

### 先に要件を決めてテストケースを用意してからテストコードを生成

### テストコードを元に実装

---

# まとめ

### GUIはReact Flowで賄えるが、Mermaidの生成・変換ロジックは自前で作成🥺

### ゼロベースでは難しいので、先にテストケースを作成しそれを元に実装😎

### 正規表現や人間では難しい複雑なところをテスト駆動&AI生成で担保✨

---

## Thank you! 🙏

### プロダクト

**Mermaid Editor** - https://illionillion.github.io/mermaid-editor/

### ソースコード

**GitHub** - https://github.com/illionillion/mermaid-editor

**質問・議論お待ちしています！**
