"use client";

import { Box } from "@yamada-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MermaidHighlightProps {
  code: string;
  showLineNumbers?: boolean;
  minHeight?: string;
  fontSize?: string;
}

export function MermaidHighlight({ 
  code, 
  showLineNumbers = true, 
  minHeight = "400px",
  fontSize = "14px"
}: MermaidHighlightProps) {
  return (
    <Box
      w="full"
      borderRadius="md"
      overflow="hidden"
      border="1px solid"
      borderColor="border"
    >
      <SyntaxHighlighter
        language="mermaid"
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          fontSize,
          minHeight,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}
