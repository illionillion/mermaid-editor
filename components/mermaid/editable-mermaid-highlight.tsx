"use client";

import { Box } from "@yamada-ui/react";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism-dark.css";

interface EditableMermaidHighlightProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  fontSize?: string;
}

export function EditableMermaidHighlight({
  value,
  onChange,
  placeholder = "Mermaidコードを入力...",
  minHeight = "300px",
  fontSize = "14px",
}: EditableMermaidHighlightProps) {
  const highlightCode = (code: string) => {
    try {
      // PrismJS does not support Mermaid syntax highlighting out of the box.
      // Using plain text highlighting to avoid syntax errors while maintaining
      // the code editor functionality and consistent styling.
      return highlight(code, languages.text, "text");
    } catch {
      // フォールバック: ハイライトに失敗した場合はプレーンテキスト
      return code;
    }
  };

  return (
    <Box
      w="full"
      borderRadius="md"
      overflow="hidden"
      border="1px solid"
      borderColor="border"
      bg="gray.900"
      color="white"
      fontFamily="mono"
      sx={{
        "& textarea::placeholder": {
          color: "white",
          opacity: 0.7,
        },
      }}
    >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlightCode}
        padding={16}
        placeholder={placeholder}
        style={{
          fontFamily: '"Fira code", "Fira Mono", Consolas, Monaco, "Courier New", monospace',
          fontSize,
          minHeight,
          lineHeight: "1.5",
          backgroundColor: "transparent",
          outline: "none",
          caretColor: "white",
        }}
      />
    </Box>
  );
}
