import type { MermaidArrowType, MermaidShapeType, GraphType } from "../types/types";
import type { FlowData } from "./flow-helpers";

/**
 * パースされたMermaidデータの型定義
 */
export interface ParsedMermaidData {
  nodes: ParsedMermaidNode[];
  edges: ParsedMermaidEdge[];
}

/**
 * パースされたMermaidノードの型定義
 */
export interface ParsedMermaidNode {
  id: string;
  variableName: string;
  label: string;
  shapeType: MermaidShapeType;
}

/**
 * パースされたMermaidエッジの型定義
 */
export interface ParsedMermaidEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  arrowType: MermaidArrowType;
}

// Mermaidの予約語リスト
const RESERVED_WORDS = new Set([
  "end",
  "start",
  "subgraph",
  "class",
  "classDef",
  "click",
  "style",
  "linkStyle",
  "direction",
  "flowchart",
  "graph",
  "if",
  "else",
  "elseif",
  "while",
  "for",
  "function",
  "return",
  "break",
  "continue",
]);

/**
 * Mermaidで安全に使用できる変数名を生成する
 * @param variableName 元の変数名
 * @returns 安全な変数名
 */
export const getSafeVariableName = (variableName: string): string => {
  // 空文字チェック
  if (!variableName || variableName.trim() === "") {
    return "node_unnamed";
  }

  let safeName = variableName.trim();

  // 予約語チェック
  if (RESERVED_WORDS.has(safeName.toLowerCase())) {
    safeName = `node_${safeName}`;
  }

  // 先頭が数字の場合はアンダースコアを追加
  if (/^[0-9]/.test(safeName)) {
    safeName = `_${safeName}`;
  }

  // スペースやタブなどの空白文字のみアンダースコアに変換
  // 日本語文字（ひらがな、カタカナ、漢字）は保持
  safeName = safeName.replace(/\s+/g, "_");

  // 特殊記号のみ変換（日本語文字は保持）
  safeName = safeName.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "_");

  return safeName;
};

/**
 * 予約語のリストを取得する
 * @returns 予約語のSet
 */
export const getReservedWords = (): Set<string> => {
  return new Set(RESERVED_WORDS);
};

/**
 * ノードの形状タイプをMermaidの記法に変換する
 * @param shapeType 形状タイプ
 * @param label ノードラベル
 * @returns Mermaidの形状記法
 */
export const formatMermaidShape = (shapeType: MermaidShapeType, label: string): string => {
  switch (shapeType) {
    case "rectangle":
      return `[${label}]`;
    case "diamond":
      return `{${label}}`;
    case "rounded":
      return `(${label})`;
    case "circle":
      return `((${label}))`;
    case "hexagon":
      return `{{${label}}}`;
    case "stadium":
      return `([${label}])`;
    default:
      return `[${label}]`; // デフォルトは四角形
  }
};

/**
 * Mermaidラベルをサニタイズする
 * @param label ラベル文字列
 * @returns サニタイズされたラベル
 */
const sanitizeMermaidLabel = (label: string): string => {
  // 空文字列の場合はそのまま返す
  if (!label || label.trim() === "") {
    return label;
  }

  // 数字のみの場合は文字列として扱う（引用符は使わない）
  if (/^\d+$/.test(label.trim())) {
    return label.trim();
  }

  // 英数字とハイフン、アンダースコア、日本語のみの場合はそのまま
  if (/^[a-zA-Z0-9\-_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s]+$/.test(label)) {
    return label;
  }

  // 特殊文字が含まれる場合は引用符で囲む
  return `"${label.replace(/"/g, '\\"')}"`;
};

/**
 * 矢印タイプをMermaidの記法に変換する
 * @param arrowType 矢印タイプ
 * @param label エッジラベル
 * @returns Mermaidの矢印記法
 */
export const formatMermaidArrow = (
  arrowType: MermaidArrowType = "arrow",
  label?: string
): string => {
  const hasLabel = label && label.trim() !== "";
  const sanitizedLabel = hasLabel ? sanitizeMermaidLabel(label!) : "";

  switch (arrowType) {
    case "arrow":
      return hasLabel ? ` -->|${sanitizedLabel}| ` : " --> ";
    case "thick":
      return hasLabel ? ` ==>|${sanitizedLabel}| ` : " ==> ";
    case "dotted":
      // Mermaidの点線矢印のラベル記法: -. ラベル .->
      return hasLabel ? ` -. ${sanitizedLabel} .-> ` : " -.-> ";
    case "invisible":
      return hasLabel ? ` ~~~|${sanitizedLabel}| ` : " ~~~ ";
    case "bidirectional":
      return hasLabel ? ` <-->|${sanitizedLabel}| ` : " <--> ";
    case "bidirectional-thick":
      return hasLabel ? ` <==${sanitizedLabel}==> ` : " <==> ";
    default:
      return hasLabel ? ` -->|${sanitizedLabel}| ` : " --> ";
  }
};

/**
 * 矢印タイプの記号を取得する
 * @param arrowType 矢印タイプ
 * @returns 矢印記号
 */
export const getArrowTypeSymbol = (arrowType: MermaidArrowType): string => {
  switch (arrowType) {
    case "arrow":
      return "→";
    case "thick":
      return "⇒";
    case "dotted":
      return "⇢";
    case "invisible":
      return "～";
    case "bidirectional":
      return "↔";
    case "bidirectional-thick":
      return "⇔";
    default:
      return "→";
  }
};

/**
 * 矢印タイプの表示名を取得する
 * @param arrowType 矢印タイプ
 * @returns 表示名
 */
export const getArrowTypeDisplayName = (arrowType: MermaidArrowType): string => {
  switch (arrowType) {
    case "arrow":
      return "通常の矢印 (->)";
    case "thick":
      return "太い矢印 (==>)";
    case "dotted":
      return "点線矢印 (-.->)";
    case "invisible":
      return "非表示 (~~~)";
    case "bidirectional":
      return "双方向矢印 (<->)";
    case "bidirectional-thick":
      return "太い双方向矢印 (<==>)";
    default:
      return "通常の矢印 (->)";
  }
};

/**
 * FlowDataからMermaidコードを生成する
 * @param flowData ノードとエッジのデータ
 * @param direction フローチャートの方向 (TD, LR, RL, BT)
 * @returns Mermaidコード
 */
export const generateMermaidCode = (flowData: FlowData, direction: GraphType = "TD"): string => {
  let code = `flowchart ${direction}\n`;

  // ノードの定義
  flowData.nodes.forEach((node) => {
    const variableName = (node.data.variableName as string) || `node${node.id}`;
    const safeVariableName = getSafeVariableName(variableName);
    const shapeType = (node.data.shapeType as MermaidShapeType) || "rectangle";
    const label = (node.data.label as string) || "";
    const shapeCode = formatMermaidShape(shapeType, label);
    code += `    ${safeVariableName}${shapeCode}\n`;
  });

  // エッジの定義
  flowData.edges.forEach((edge) => {
    const sourceNode = flowData.nodes.find((node) => node.id === edge.source);
    const targetNode = flowData.nodes.find((node) => node.id === edge.target);

    if (sourceNode && targetNode) {
      const sourceVariableName = getSafeVariableName(
        (sourceNode.data.variableName as string) || `node${sourceNode.id}`
      );
      const targetVariableName = getSafeVariableName(
        (targetNode.data.variableName as string) || `node${targetNode.id}`
      );
      const edgeLabel = edge.data?.label as string | undefined;
      const arrowType = (edge.data?.arrowType as MermaidArrowType) || "arrow";

      const arrowCode = formatMermaidArrow(arrowType, edgeLabel);
      code += `    ${sourceVariableName}${arrowCode}${targetVariableName}\n`;
    }
  });

  return code;
};

/**
 * Mermaidコードをパースしてデータ構造に変換する
 * @param mermaidCode Mermaidコード文字列
 * @returns パースされたデータ
 */
export const parseMermaidCode = (mermaidCode: string): ParsedMermaidData => {
  const result: ParsedMermaidData = {
    nodes: [],
    edges: [],
  };

  if (!mermaidCode || mermaidCode.trim() === "") {
    return result;
  }

  const lines = mermaidCode
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // flowchartヘッダーをスキップ
  const contentLines = lines.filter(
    (line) => !line.startsWith("flowchart") && !line.startsWith("graph")
  );

  const nodeRegistry = new Map<string, ParsedMermaidNode>();

  // 最初にノード定義のみを処理
  for (const line of contentLines) {
    const nodeMatch = parseNodeDefinition(line);
    if (nodeMatch) {
      nodeRegistry.set(nodeMatch.id, nodeMatch);
    }
  }

  // 次にエッジ定義を処理
  for (const line of contentLines) {
    const edgeMatch = parseEdgeDefinition(line);
    if (edgeMatch) {
      // エッジの両端のノードが存在しない場合は作成
      if (!nodeRegistry.has(edgeMatch.source)) {
        // エッジからノード情報を抽出（ラベル付きノード定義を探す）
        const sourceNodeInfo = extractNodeFromEdgeLine(line, edgeMatch.source);
        nodeRegistry.set(edgeMatch.source, sourceNodeInfo);
      }
      if (!nodeRegistry.has(edgeMatch.target)) {
        // エッジからノード情報を抽出（ラベル付きノード定義を探す）
        const targetNodeInfo = extractNodeFromEdgeLine(line, edgeMatch.target);
        nodeRegistry.set(edgeMatch.target, targetNodeInfo);
      }

      result.edges.push(edgeMatch);
    }
  }

  result.nodes = Array.from(nodeRegistry.values());
  return result;
};

/**
 * エッジ行からノード情報を抽出する
 * @param line エッジ定義行
 * @param nodeId ノードID
 * @returns ノード情報
 */
const extractNodeFromEdgeLine = (line: string, nodeId: string): ParsedMermaidNode => {
  // エッジ行からノードのラベルを抽出しようとする
  // 例: A[開始] --> B[終了] の場合、A[開始]からラベル「開始」を抽出

  // 形状パターンの定義（より効率的に）
  const shapePatterns: Array<{ pattern: string; shape: MermaidShapeType }> = [
    { pattern: `\\[([^\\]]*)\\]`, shape: "rectangle" },
    { pattern: `\\(\\(([^\\)]*)\\)\\)`, shape: "circle" },
    { pattern: `\\{\\{([^\\}]*)\\}\\}`, shape: "hexagon" },
    { pattern: `\\(\\[([^\\]]*)\\]\\)`, shape: "stadium" },
    { pattern: `\\(([^\\)]*)\\)`, shape: "rounded" },
    { pattern: `\\{([^\\}]*)\\}`, shape: "diamond" },
  ];

  for (const { pattern, shape } of shapePatterns) {
    const regex = new RegExp(`${nodeId}${pattern}`);
    const match = line.match(regex);
    if (match) {
      return {
        id: nodeId,
        variableName: nodeId,
        label: match[1] || nodeId,
        shapeType: shape,
      };
    }
  }

  // パターンにマッチしない場合はデフォルト
  return {
    id: nodeId,
    variableName: nodeId,
    label: nodeId,
    shapeType: "rectangle",
  };
};

/**
 * ノード定義行をパースする
 * @param line 行文字列
 * @returns パースされたノード情報またはnull
 */
const parseNodeDefinition = (line: string): ParsedMermaidNode | null => {
  // 矢印が含まれている場合はノード定義ではない
  if (
    line.includes("-->") ||
    line.includes("==>") ||
    line.includes("-.->") ||
    line.includes("~~~") ||
    line.includes("<-->") ||
    line.includes("<==>")
  ) {
    return null;
  }

  // 各形状パターンのマッチング（より具体的なパターンを先に）
  const patterns: { regex: RegExp; shape: MermaidShapeType }[] = [
    // 四角形: A[label] または A[]
    {
      regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\[([^\]]*)\]$/,
      shape: "rectangle",
    },
    // 円: A((label))
    {
      regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\(\(([^)]*)\)\)$/,
      shape: "circle",
    },
    // 六角形: A{{label}}
    {
      regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\{\{([^}]*)\}\}$/,
      shape: "hexagon",
    },
    // スタジアム: A([label]) - 角丸よりも先にチェック
    {
      regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\(\[([^\]]*)\]\)$/,
      shape: "stadium",
    },
    // 角丸四角形: A(label)
    {
      regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\(([^)]*)\)$/,
      shape: "rounded",
    },
    // ダイアモンド: A{label}
    {
      regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\{([^}]*)\}$/,
      shape: "diamond",
    },
    // ラベルなしノード: 英数字とアンダースコア、日本語文字のみ
    { regex: /^([a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)$/, shape: "rectangle" },
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern.regex);
    if (match) {
      const id = match[1];
      const label = match[2] !== undefined ? match[2] : id; // ラベルなしの場合はIDをラベルにする

      // 変数名にスペースが含まれている場合は無効
      if (id.includes(" ")) {
        continue;
      }
      return {
        id,
        variableName: id,
        label,
        shapeType: pattern.shape,
      };
    }
  }

  return null;
};

/**
 * エッジ定義行をパースする
 * @param line 行文字列
 * @returns パースされたエッジ情報またはnull
 */
const parseEdgeDefinition = (line: string): ParsedMermaidEdge | null => {
  // 正規表現パターンの定義
  const nodeId = "[a-zA-Z0-9_\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]+";
  const nodeShape =
    "(?:\\[[^\\]]*\\]|\\([^)]*\\)|\\{[^}]*\\}|\\(\\([^)]*\\)\\)|\\{\\{[^}]*\\}\\}|\\(\\[[^\\]]*\\]\\))?";

  // 様々な矢印パターン
  const patterns: {
    regex: RegExp;
    arrowType: MermaidArrowType;
    labelPosition?: "middle" | "sides";
  }[] = [
    // 太い双方向矢印（スペース区切りラベル付き: スペース有無両対応）: A <==ラベル==> B, A <== ラベル ==> B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*<==\\s*(.+?)\\s*==>\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "bidirectional-thick",
      labelPosition: "middle",
    },
    // 太い双方向矢印（ラベルなし）: A <==> B
    {
      regex: new RegExp(`^(${nodeId})${nodeShape}\\s*<==>\\s*(${nodeId})${nodeShape}$`),
      arrowType: "bidirectional-thick",
    },
    // 双方向矢印（ラベル付き）: A <-->|label| B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*<-->\\s*\\|\\s*([^|]*)\\s*\\|\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "bidirectional",
    },
    // 双方向矢印（ラベル有り: スペース有無両対応）例: A <--ラベル-->B, A <-- ラベル --> B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*<--\\s*(.+?)\\s*-->\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "bidirectional",
      labelPosition: "middle",
    },
    // 双方向矢印（ラベルなし）: A <--> B
    {
      regex: new RegExp(`^(${nodeId})${nodeShape}\\s*<-->\\s*(${nodeId})${nodeShape}$`),
      arrowType: "bidirectional",
    },
    // 点線矢印（ラベル付き: スペース有無両対応）: A -.label.->B, A -. label .-> B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*-\\.\\s*(.+?)\\s*\\.->\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "dotted",
      labelPosition: "sides",
    },
    // 点線矢印（ラベルなし）: A -.-> B
    {
      regex: new RegExp(`^(${nodeId})${nodeShape}\\s*-\\.\\s*->\\s*(${nodeId})${nodeShape}$`),
      arrowType: "dotted",
    },
    // 太い矢印（ラベル付き）: A ==>|label| B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*==>\\s*\\|\\s*([^|]*)\\s*\\|\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "thick",
    },
    // 太い矢印（スペース区切りラベル付き: スペース有無両対応）: A ==ラベル==> B, A == ラベル ==> B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*==\\s*(.+?)\\s*==>\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "thick",
    },
    // 太い矢印（ラベルなし）: A ==> B
    {
      regex: new RegExp(`^(${nodeId})${nodeShape}\\s*==>\\s*(${nodeId})${nodeShape}$`),
      arrowType: "thick",
    },
    // 通常の矢印（ラベル付き）: A -->|label| B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*-->\\s*\\|\\s*([^|]*)\\s*\\|\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "arrow",
    },
    // スペース有無両対応ラベル付き矢印: A--label-->B, A-- label -->B
    {
      regex: new RegExp(
        `^(${nodeId})${nodeShape}\\s*--\\s*(.+?)\\s*-->\\s*(${nodeId})${nodeShape}$`
      ),
      arrowType: "arrow",
    },
    // 通常の矢印（ラベルなし）: A --> B
    {
      regex: new RegExp(`^(${nodeId})${nodeShape}\\s*-->\\s*(${nodeId})${nodeShape}$`),
      arrowType: "arrow",
    },
  ];

  for (const pattern of patterns) {
    const match = line.match(pattern.regex);
    if (match) {
      let source: string;
      let target: string;
      let label = "";

      // 双方向矢印（太い）の特殊な記法に対応
      if (
        pattern.arrowType === "bidirectional-thick" &&
        match.length >= 4 &&
        match[2] &&
        match[2].trim() !== ""
      ) {
        // 太い双方向矢印（ラベル付き）: A <==label==> B
        source = match[1];
        label = match[2].trim();
        target = match[3];
      } else if (pattern.labelPosition === "sides" && match.length >= 4) {
        // 点線矢印（ラベル付き）: A -. label .-> B
        source = match[1];
        label = match[2].trim();
        target = match[3];
      } else if (match.length === 4) {
        // 一般的なラベル付きパターン
        source = match[1];
        label = match[2].trim();
        target = match[3];
      } else {
        // ラベルなしパターン
        source = match[1];
        target = match[2];
      }

      return {
        id: `${source}-${target}`,
        source,
        target,
        label,
        arrowType: pattern.arrowType,
      };
    }
  }

  return null;
};
