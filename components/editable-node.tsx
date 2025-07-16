'use client';

import { Handle, Position } from '@xyflow/react';
import { Box, Text, Input } from '@yamada-ui/react';
import { useState } from 'react';

interface EditableNodeProps {
  data: {
    label: string;
    onLabelChange?: (nodeId: string, newLabel: string) => void;
  };
  id: string;
}

export function EditableNode({ data, id }: EditableNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    // ノードのデータを更新する関数を呼び出す
    if (data.onLabelChange) {
      data.onLabelChange(id, label);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <Box
      bg="white"
      border="2px solid #1a365d"
      borderRadius="md"
      p={2}
      w="120px"
      minH="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      cursor="pointer"
      onDoubleClick={handleDoubleClick}
      _hover={{ boxShadow: 'md' }}
    >
      <Handle type="target" position={Position.Top} />
      {isEditing ? (
        <Input
          value={label}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyPress}
          size="sm"
          autoFocus
          textAlign="center"
          border="none"
          w="100px"
          h="24px"
          p={0}
          bg="transparent"
          _focus={{ boxShadow: 'none', outline: 'none' }}
        />
      ) : (
        <Text 
          w="100px" 
          fontSize="sm" 
          fontWeight="medium"
          wordBreak="break-word"
          lineHeight="1.2"
        >
          {label}
        </Text>
      )}
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
}
