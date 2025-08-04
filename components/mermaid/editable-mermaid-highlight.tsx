"use client";

import { Box } from "@yamada-ui/react";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism-dark.css";
import "prismjs/components/prism-mermaid";

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
      // Now using Mermaid syntax highlighting with PrismJS
      return highlight(code, languages.mermaid, "mermaid");
    } catch {
      // フォールバック: ハイライトに失敗した場合はHTMLエスケープしたプレーンテキスト
      return code.replace(/[&<>"']/g, (match) => {
        const escapeMap: Record<string, string> = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
        };
        return escapeMap[match];
      });
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
