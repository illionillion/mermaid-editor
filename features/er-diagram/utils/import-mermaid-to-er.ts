import type { Node, Edge } from "@xyflow/react";
import type { ERColumn } from "../components/node/er-table-content";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ER_CARDINALITY_SYMBOLS } from "../types";

const CARDINALITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ER_CARDINALITY_SYMBOLS).map(([k, v]) => [v, k])
);

/**
 * カラム属性パターン
 * @description PK（主キー）またはUK（ユニークキー）の属性定義パターン
 */
const COLUMN_ATTRIBUTE_PATTERN = "(PK|UK)";

/**
 * カラム定義の正規表現パターン
 * @description 型名・カラム名・属性（PK/UK）の組み合わせをパースする正規表現です。
 * @example
 *   // "int id PK" の場合
 *   // マッチ結果: ["int id PK", "int", "id", "PK"]
 *   // "varchar(255) name" の場合
 *   // マッチ結果: ["varchar(255) name", "varchar(255)", "name", undefined]
 * @captureGroup 1 型名（英字、数字、アンダースコア、丸括弧のみ。例: varchar(255), int）
 * @captureGroup 2 カラム名（英字、数字、アンダースコアのみ）
 * @captureGroup 3 属性（"PK" または "UK"。省略可）
 * @restrictions
 * - 型名: 英字、数字、アンダースコア、丸括弧のみ許可（例: varchar(255), int）
 * - カンマを含む型名（decimal(10,2)）は公式Mermaidでサポートされていないため除外
 * - 複数属性（PK UK）も公式Mermaidでサポートされていないため、単一属性のみ対応
 */
const COLUMN_PATTERN = new RegExp(
  `^([A-Za-z0-9_()]+)\\s+([A-Za-z0-9_]+)(?:\\s+${COLUMN_ATTRIBUTE_PATTERN})?$`
);

/**
 * カーディナリティ記号パターン
 * @description 公式Mermaidでサポートされる7種類のカーディナリティ記号
 */
const CARDINALITY_SYMBOLS_PATTERN =
  "\\|\\|--\\|\\||\\|\\|--o\\{|\\}o--\\|\\||\\}o--o\\{|o\\|--\\|\\||\\|\\|--o\\||\\|\\|--\\|\\{";

/**
 * テーブル定義ブロックの開始パターン
 * @description テーブル名と開始括弧を検出するための正規表現
 * @pattern /^[^\s{}]+\s*\{/ 空白・波括弧以外の文字を許可（日本語対応）
 * @example "User {", "LINE-ITEM {", "ユーザー {", "テーブル2 {"
 * @remarks ノード定義の検出とエラー回復処理で使用。[\w-]から[^\s{}]に変更して日本語文字（ひらがな・カタカナ・漢字）をサポート
 */
const TABLE_DEFINITION_PATTERN = /^[^\s{}]+\s*\{/;

/**
 * エッジのカーディナリティ記号として公式でサポートされているもののみ許可する正規表現
 * @description 公式Mermaid仕様に準拠したカーディナリティ記号のみをマッチさせる
 * @example "User ||--o{ Post : has" → ["User ||--o{ Post : has", "User", "||--o{", "Post", " has"]
 * @example "ユーザー ||--o{ テーブル2 : relation" → 日本語テーブル名もサポート
 * @captureGroup 1 ソーステーブル名（空白・波括弧以外の任意の文字）
 * @captureGroup 2 カーディナリティ記号（7種類の公式記法）
 * @captureGroup 3 ターゲットテーブル名（空白・波括弧以外の任意の文字）
 * @captureGroup 4 リレーションラベル（コロン以降の任意文字列）
 * @restrictions
 * - テーブル名: 空白・波括弧以外の任意の文字を許可（日本語文字対応）
 * - カーディナリティ記号: 公式Mermaidでサポートされる7種類のみ対応
 *   ||--|| (one-to-one), ||--o{ (one-to-many), }o--|| (many-to-one), }o--o{ (many-to-many),
 *   o|--|| (zero-to-one), ||--o| (one-to-zero), ||--|{ (one-to-many-mandatory)
 */
const EDGE_PATTERN = new RegExp(
  `^([^\\s]+)\\s+(${CARDINALITY_SYMBOLS_PATTERN})\\s+([^\\s]+)\\s*:(.*)$`
);

/**
 * テーブル名・ラベル正規化用の正規表現パターン
 * @description 先頭または末尾の不要な文字（空白・コロン・二重引用符）を除去する
 * @example ' "User" : ' → 'User'
 * @pattern ^[\s:"]+   - 文字列の先頭から空白・コロン・二重引用符のいずれかが1文字以上連続する部分
 * @pattern |          - または
 * @pattern [\s:"]+$   - 文字列の末尾で空白・コロン・二重引用符のいずれかが1文字以上連続する部分
 * @pattern gフラグ    - グローバルに全ての該当箇所を対象
 */
const SANITIZE_PATTERN = /^[\s:"]+|[\s:"]+$/g;

/**
 * デフォルトのカーディナリティ
 * @description 不正またはサポートされていないカーディナリティ記号の場合に使用されるフォールバック値
 * @rationale 最も一般的なER関係である1対多（one-to-many）を既定値として使用
 */
const DEFAULT_CARDINALITY = "one-to-many";

/**
 * テーブル名やラベルの正規化処理
 * - 空白: mermaid記法で余分な空白が含まれる場合がある
 * - コロン: ラベル区切り文字として使用されるが、実際のラベルには不要
 * - 二重引用符: mermaid記法でクォートされた文字列の場合に除去
 */
function sanitizeTableName(input: string): string {
  return input.replace(SANITIZE_PATTERN, "");
}

/**
 * パースされたERテーブルデータの型定義（純粋なデータのみ、UIハンドラーなし）
 * flowchartのParsedMermaidNodeと同じ設計パターン
 */
export interface ParsedERTableData {
  id: string;
  name: string;
  columns: ERColumn[];
}

/**
 * パースされたMermaidデータの型定義
 */
export interface ParsedMermaidERData {
  nodes: ParsedERTableData[];
  edges: Edge[];
}

/**
 * カラム定義文字列の配列をERColumn配列に変換
 * @param lines カラム定義の文字列配列
 * @returns パースされたERColumn配列
 * @example ["int id PK", "varchar(255) name"] → [{name: "id", type: "int", pk: true, uk: false}, ...]
 */
function parseColumns(lines: string[]): ERColumn[] {
  return lines
    .map((line) => line.trim())
    .filter((l) => l && !l.startsWith("//"))
    .map((line) => {
      /**
       * 型名・カラム名・属性の解析
       * @description 各行をCOLUMN_PATTERNでパースし、型名・カラム名・属性を抽出
       * @example "int id PK" → type="int", name="id", attribute="PK"
       * @restrictions
       * - 型名: 英字、数字、アンダースコア、丸括弧のみ許可（例: varchar(255), int）
       * - カンマを含む型名（decimal(10,2)）や複数属性（PK UK）は公式Mermaidでサポートされていないため対応しない
       */
      const m = line.match(COLUMN_PATTERN);
      if (!m) return null;
      const [, type, name, attribute] = m;
      const pk = attribute === "PK";
      const uk = attribute === "UK";
      return { name, type, pk, uk };
    })
    .filter(Boolean) as ERColumn[];
}

/**
 * MermaidのER図コードをパースしてテーブルとエッジのデータに変換
 * @description 入力されたMermaid ER図コードを解析し、テーブル定義とリレーション定義を抽出します
 * @param mermaid パースするMermaid ER図コード文字列
 * @returns パースされたテーブルデータとエッジデータ
 * @example
 *   const result = convertMermaidToERData(`
 *     erDiagram
 *     User {
 *       int id PK
 *       varchar(255) name
 *     }
 *     User ||--o{ Post : has
 *   `);
 *   // result.nodes: [{id: "User", name: "User", columns: [...]}]
 *   // result.edges: [{id: "edge-0", source: "User", target: "Post", ...}]
 * @features
 * - テーブル定義の解析（ハイフンを含むテーブル名もサポート）
 * - カラム定義の解析（型名、カラム名、PK/UK属性）
 * - 7種類のカーディナリティ記号に対応
 * - エッジの一意ID生成による重複回避
 * - エラー回復機能（不正な記法に対する堅牢性）
 * @restrictions
 * - 公式Mermaid仕様に準拠した記法のみサポート
 * - コンマを含む型名（decimal(10,2)）は非対応
 * - 複数属性（PK UK）は非対応
 */
export function convertMermaidToERData(mermaid: string): ParsedMermaidERData {
  if (!mermaid.trim().startsWith("erDiagram")) return { nodes: [], edges: [] };

  const lines = mermaid.split("\n").map((l) => l.trimEnd());

  const nodes: ParsedERTableData[] = [];
  const nodeNames: Set<string> = new Set();
  const edges: Edge[] = [];

  /**
   * エッジのユニークID生成用カウンター
   * @description 各エッジに一意のIDを付与するためのインクリメンタルカウンター
   * @example "edge-0", "edge-1", "edge-2"...
   * @rationale 同じテーブル間に複数のリレーションがある場合でも重複を避けるため
   */
  let edgeCounter = 0;

  /**
   * erDiagramヘッダー行をスキップするためのインデックス
   * @description 入力されたMermaid文字列の解析開始位置を管理
   * @example "erDiagram"行をスキップしてテーブル定義から解析を開始
   */
  let i = 0;
  while (i < lines.length && !/^erDiagram\b/.test(lines[i])) i++;
  if (i < lines.length && /^erDiagram\b/.test(lines[i])) i++;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    /**
     * ノード定義の解析
     * @description テーブル定義ブロックの開始を検出し、テーブル名とカラム定義を抽出
     * @pattern /^[^\s{}]+\s*\{/ 日本語文字を含むテーブル名もサポート
     * @example "User {", "LINE-ITEM {", "ユーザー {", "テーブル2 {"
     * @restrictions 空白・波括弧以外の文字を許可（日本語対応）
     */
    if (TABLE_DEFINITION_PATTERN.test(line)) {
      const nameMatch = line.match(/^([^\s{}]+)\s*\{/);
      if (!nameMatch) {
        i++;
        continue;
      }

      const name = nameMatch[1];
      const colLines: string[] = [];
      i++; // { の次の行に進む

      // カラム定義をすべて収集
      let foundClosingBrace = false;
      while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine === "}") {
          i++; // } をスキップ
          foundClosingBrace = true;
          break;
        }
        if (TABLE_DEFINITION_PATTERN.test(currentLine)) {
          /**
           * エラー回復シナリオ:
           * 例: "User { id int Post { id int }"
           * 上記のように、ノード定義の閉じ括弧（}）が抜けている場合、
           * 次のノード定義（"Post {"）の開始を検出した時点で現在のノード定義を中断し、回復します。
           * この場合、"User"ノードは無効としてスキップされ、"Post"ノードのパースに進みます。
           * 公式Mermaid仕様に準拠し、閉じ括弧がないノードは無視します。
           * 対応テストケース: "公式Mermaidでエラーになる壊れたノード定義は解析できない"
           */
          break;
        }
        if (currentLine !== "") {
          colLines.push(lines[i]);
        }
        i++;
      }

      // 閉じ括弧が見つかった場合のみノードを追加（公式Mermaid仕様に準拠）
      if (foundClosingBrace) {
        const columns = parseColumns(colLines);
        nodes.push({
          id: name,
          name,
          columns,
        });
        nodeNames.add(name);
      }
      continue;
    }

    /**
     * エッジ定義の解析
     * @description EDGE_PATTERNでカーディナリティ記号を含むエッジ定義をパース
     * @example "User ||--o{ Post : has" → source="User", symbol="||--o{", target="Post", label=" has"
     * @reference Mermaid ER図で使用されるカーディナリティ記号の詳細は ER_CARDINALITY_SYMBOLS を参照
     * @fallback サポートされていない記号の場合はDEFAULT_CARDINALITY（one-to-many）を使用
     */
    const edgeMatch = line.match(EDGE_PATTERN);
    if (edgeMatch) {
      const [, source, symbol, target, label] = edgeMatch;
      const card = CARDINALITY_MAP[symbol.trim()] || DEFAULT_CARDINALITY;
      const cleanLabel = sanitizeTableName(label) || "relation";

      /**
       * エッジオブジェクトの生成
       * @description ReactFlow用のエッジデータを作成し、一意のIDを付与
       * @id edge-${counter} 形式で重複を回避
       * @type erEdge カスタムエッジタイプ
       */
      edges.push({
        id: `edge-${edgeCounter++}`,
        type: "erEdge",
        source,
        target,
        data: { label: cleanLabel, cardinality: card },
      });

      /**
       * ダミーノードの自動生成
       * @description エッジ定義で参照されているが、ノード定義が存在しない場合に空のノードを生成
       * @example "A ||--o{ B : rel" でAやBのノード定義がない場合、columns=[]のダミーノードを作成
       * @rationale エッジが存在するがノードが未定義の場合でも、ReactFlowで表示できるようにするため
       */
      if (!nodeNames.has(source)) {
        nodes.push({
          id: source,
          name: source,
          columns: [],
        });
        nodeNames.add(source);
      }
      if (!nodeNames.has(target)) {
        nodes.push({
          id: target,
          name: target,
          columns: [],
        });
        nodeNames.add(target);
      }
    }

    i++;
  }
  return { nodes, edges };
}

/**
 * ER図レイアウト定数
 * @description flowchartを参考にしつつ、テーブルサイズに合わせて調整した配置パラメータ
 * @reference flowchart レイアウト機能と同じ設計パターンを採用
 * @rationale ERテーブルはフローチャートのノードより大きいため、間隔を拡大して配置
 */
const ER_LAYOUT_CONSTANTS = {
  /**
   * テーブル間の縦間隔
   * @description 階層レベル間のY軸方向の距離
   * @unit ピクセル（px）
   * @value 280
   * @rationale テーブルの高さ（約200px）を考慮して十分な余白を確保
   */
  LEVEL_HEIGHT: 280,

  /**
   * 同レベル内のテーブル間隔
   * @description 同じ階層レベル内でのテーブル間のX軸方向の距離
   * @unit ピクセル（px）
   * @value 450
   * @rationale テーブルの幅（約300px）を考慮して重複を避ける間隔
   */
  TABLE_SPACING: 450,

  /**
   * 中央揃えのためのオフセット
   * @description 全体を画面中央に配置するためのX軸調整値
   * @unit ピクセル（px）
   * @value 500
   * @rationale ReactFlowキャンバスの中央付近に配置するための基準点
   */
  CENTER_OFFSET: 500,

  /**
   * 上部からの初期オフセット
   * @description 最上位階層テーブルのY軸開始位置
   * @unit ピクセル（px）
   * @value 100
   * @rationale ヘッダーやツールバーとの干渉を避けるための上部余白
   */
  VERTICAL_OFFSET: 100,
} as const;

/**
 * テーブル階層レベルの計算
 * @description エッジの関係から各テーブルの階層レベルをBFS探索で決定
 * @param tables 全テーブルデータ
 * @param edges エッジデータ
 * @returns テーブルIDと階層レベルのマップ
 */
function calculateTableLevels(tables: ParsedERTableData[], edges: Edge[]): Map<string, number> {
  const levels = new Map<string, number>();

  // 全テーブルを初期化（レベル0）
  tables.forEach((table) => {
    levels.set(table.id, 0);
  });

  // エッジを分析して階層を決定
  const hasIncomingEdge = new Set<string>();
  edges.forEach((edge) => {
    hasIncomingEdge.add(edge.target);
  });

  // ルートテーブル（他から参照されないテーブル）をレベル0に設定
  const rootTables = tables.filter((table) => !hasIncomingEdge.has(table.id));
  if (rootTables.length === 0 && tables.length > 0) {
    // 循環参照などでルートが特定できない場合は最初のテーブルをルートとする
    levels.set(tables[0].id, 0);
  }

  // BFSで階層を計算
  const queue: string[] = rootTables.map((table) => table.id);
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const currentLevel = levels.get(current) || 0;

    // 現在のテーブルから出る全てのエッジを探す
    edges.forEach((edge) => {
      if (edge.source === current && !visited.has(edge.target)) {
        const newLevel = currentLevel + 1;
        const existingLevel = levels.get(edge.target) || 0;
        levels.set(edge.target, Math.max(existingLevel, newLevel));
        queue.push(edge.target);
      }
    });
  }

  return levels;
}

/**
 * レベル別テーブルグループの作成
 * @description 階層レベルごとにテーブルをグループ化
 * @param levels テーブルIDと階層レベルのマップ
 * @returns レベルごとのテーブルIDリスト
 */
function groupTablesByLevel(levels: Map<string, number>): Map<number, string[]> {
  const tablesByLevel = new Map<number, string[]>();

  levels.forEach((level, tableId) => {
    if (!tablesByLevel.has(level)) {
      tablesByLevel.set(level, []);
    }
    tablesByLevel.get(level)!.push(tableId);
  });

  return tablesByLevel;
}

/**
 * テーブル位置の計算
 * @description レベル別グループから各テーブルの座標を計算
 * @param tablesByLevel レベルごとのテーブルIDリスト
 * @returns テーブルIDと座標のマップ
 */
function calculateTablePositions(
  tablesByLevel: Map<number, string[]>
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  tablesByLevel.forEach((tableIds, level) => {
    const levelWidth = tableIds.length * ER_LAYOUT_CONSTANTS.TABLE_SPACING;
    const startX = -levelWidth / 2; // 中央揃え

    tableIds.forEach((tableId, index) => {
      positions.set(tableId, {
        x: startX + index * ER_LAYOUT_CONSTANTS.TABLE_SPACING + ER_LAYOUT_CONSTANTS.CENTER_OFFSET,
        y: level * ER_LAYOUT_CONSTANTS.LEVEL_HEIGHT + ER_LAYOUT_CONSTANTS.VERTICAL_OFFSET,
      });
    });
  });

  return positions;
}

/**
 * ParsedERTableDataをReactFlowのNode型に変換するヘルパー関数
 * flowchartのhandleImportMermaidと同じ設計パターン + 自動レイアウト機能
 */
export function convertParsedDataToNodes(
  parsedData: ParsedERTableData[],
  edges: Edge[],
  handlers: {
    onNameChange: (nodeId: string, newName: string) => void;
    onColumnsChange: (nodeId: string, newColumns: ERColumn[]) => void;
  }
): Node<ERTableNodeProps>[] {
  /**
   * テーブルの階層構造を分析してレイアウトを決定
   * @description エッジの関係から各テーブルの階層レベルを計算し、適切な位置に配置
   * @example ルートテーブル（参照されないテーブル）はレベル0、それを参照するテーブルはレベル1...
   */
  const layoutTables = (
    tables: ParsedERTableData[],
    edges: Edge[]
  ): Map<string, { x: number; y: number }> => {
    const levels = calculateTableLevels(tables, edges);
    const tablesByLevel = groupTablesByLevel(levels);
    return calculateTablePositions(tablesByLevel);
  };

  const positions = layoutTables(parsedData, edges);

  return parsedData.map((parsedNode) => ({
    id: parsedNode.id,
    type: "erTable",
    position: positions.get(parsedNode.id) || { x: 400, y: 80 }, // フォールバック位置
    data: {
      name: parsedNode.name,
      columns: parsedNode.columns,
      onNameChange: (newName: string) => handlers.onNameChange(parsedNode.id, newName),
      onColumnsChange: (newColumns: ERColumn[]) =>
        handlers.onColumnsChange(parsedNode.id, newColumns),
    },
  }));
}
