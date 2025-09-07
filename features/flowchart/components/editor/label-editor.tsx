"use client";

import type { FC } from "@yamada-ui/react";
import { Text, Input } from "@yamada-ui/react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface LabelEditorProps {
  value: string;
  isEditing: boolean;
  onDoubleClick: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  onBlur: () => void;
}

export const LabelEditor: FC<LabelEditorProps> = ({
  value,
  isEditing,
  onDoubleClick,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onBlur,
}) => {
  return (
    <>
      {isEditing ? (
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onBlur={onBlur}
          size="sm"
          autoFocus
          textAlign="center"
          w="full"
          h="24px"
          p={1}
          fontSize="sm"
          border="none"
          bg="transparent"
          _focus={{ boxShadow: "none", outline: "none" }}
        />
      ) : (
        <Text
          w="full"
          fontSize="sm"
          fontWeight="medium"
          wordBreak="break-word"
          lineHeight="1.2"
          onDoubleClick={onDoubleClick}
        >
          {value}
        </Text>
      )}
    </>
  );
};
