// Mermaidの予約語リスト
const RESERVED_WORDS = new Set([
  'end', 'start', 'subgraph', 'class', 'classDef', 'click', 'style',
  'linkStyle', 'direction', 'flowchart', 'graph', 'if', 'else', 'elseif',
  'while', 'for', 'function', 'return', 'break', 'continue'
]);

/**
 * Mermaidで安全に使用できる変数名を生成する
 * @param variableName 元の変数名
 * @returns 安全な変数名
 */
export const getSafeVariableName = (variableName: string): string => {
  // 空文字チェック
  if (!variableName || variableName.trim() === '') {
    return 'node_unnamed';
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
  safeName = safeName.replace(/\s+/g, '_');
  
  // 特殊記号のみ変換（日本語文字は保持）
  safeName = safeName.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '_');
  
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
    case 'rectangle':
      return `[${label}]`;
    case 'diamond':
      return `{${label}}`;
    case 'rounded':
      return `(${label})`;
    case 'circle':
      return `((${label}))`;
    case 'hexagon':
      return `{{${label}}}`;
    case 'stadium':
      return `([${label}])`;
    default:
      return `[${label}]`; // デフォルトは四角形
  }
};
