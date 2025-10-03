import type { Node, Edge } from "@xyflow/react";
import type { ERColumn } from "../components/node/er-table-content";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ER_CARDINALITY_SYMBOLS } from "../types";

const CARDINALITY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ER_CARDINALITY_SYMBOLS).map(([k, v]) => [v, k])
);

/**
 * カラム定義の正規表現パターン
 * 形式: 型名 カラム名 [属性]
 * 例: varchar(255) name PK, int id UK
 * 型名にはカッコを含むことができるが、コンマは公式Mermaidでエラーとなるため非対応
 */
const COLUMN_PATTERN = /^([A-Za-z0-9_()]+)\s+([A-Za-z0-9_]+)(?:\s+(PK|UK))?$/;
/**
 * エッジのカーディナリティ記号として公式でサポートされているもののみ許可する正規表現
 * @description 公式Mermaid仕様に準拠したカーディナリティ記号のみをマッチさせる
 * @example "User ||--o{ Post : has" → ["User ||--o{ Post : has", "User", "||--o{", "Post", " has"]
 * @example "LINE-ITEM ||--o{ ORDER : belongs" → ハイフンを含むテーブル名もサポート
 */
const EDGE_PATTERN =
  /^([\w-]+)\s+(\|\|--\|\||\|\|--o\{|\}o--\|\||\}o--o\{|o\|--\|\||\|\|--o\||\|\|--\|\{)\s+([\w-]+)\s*:(.*)$/; // [全体マッチ, source, cardinality, target, label]

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

export function convertMermaidToERData(mermaid: string): ParsedMermaidERData {
  if (!mermaid.trim().startsWith("erDiagram")) return { nodes: [], edges: [] };

  const lines = mermaid.split("\n").map((l) => l.trimEnd());
  const nodes: ParsedERTableData[] = [];
  const nodeNames: Set<string> = new Set();
  const edges: Edge[] = [];
  let edgeCounter = 0; // エッジのユニークID生成用カウンター

  let i = 0;
  // erDiagramヘッダー行をスキップ
  while (i < lines.length && !/^erDiagram\b/.test(lines[i])) i++;
  if (i < lines.length && /^erDiagram\b/.test(lines[i])) i++;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // ノード定義（ハイフンを含むテーブル名もサポート：LINE-ITEM, DELIVERY-ADDRESS等）
    if (/^[\w-]+\s*\{/.test(line)) {
      const nameMatch = line.match(/^([\w-]+)\s*\{/);
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
        if (/^[\w-]+\s*\{/.test(currentLine)) {
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

      edges.push({
        id: `edge-${edgeCounter++}`, // ユニークなIDを生成
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

// ER図レイアウト定数（flowchartを参考、テーブルサイズに合わせて調整）
const ER_LAYOUT_CONSTANTS = {
  LEVEL_HEIGHT: 280, // テーブル間の縦間隔（テーブルの高さを考慮して拡大）
  TABLE_SPACING: 450, // 同レベル内のテーブル間隔（横方向、テーブルの幅を考慮して拡大）
  CENTER_OFFSET: 500, // 中央揃えのためのオフセット（全体の余裕を増加）
  VERTICAL_OFFSET: 100, // 上部からの初期オフセット（少し余裕を追加）
} as const;

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

    // レベルごとにテーブルをグループ化
    const tablesByLevel = new Map<number, string[]>();
    levels.forEach((level, tableId) => {
      if (!tablesByLevel.has(level)) {
        tablesByLevel.set(level, []);
      }
      tablesByLevel.get(level)!.push(tableId);
    });

    // 位置を計算
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
