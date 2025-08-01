import { FlowData } from "../components/flow/flow-helpers";
import { MermaidArrowType } from "../components/types/types";

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
export const formatMermaidShape = (shapeType: string, label: string): string => {
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
 * @returns Mermaidコード
 */
export const generateMermaidCode = (flowData: FlowData): string => {
  let code = "flowchart TD\n";

  // ノードの定義
  flowData.nodes.forEach((node) => {
    const variableName = (node.data.variableName as string) || `node${node.id}`;
    const safeVariableName = getSafeVariableName(variableName);
    const shapeType = (node.data.shapeType as string) || "rectangle";
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
