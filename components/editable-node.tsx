'use client';

import { Handle, Position } from '@xyflow/react';
import { Box, Text, Input } from '@yamada-ui/react';
import { useState } from 'react';
import { NodeMenu } from './node-menu';

interface EditableNodeProps {
    data: {
        label: string;
        onLabelChange?: (nodeId: string, newLabel: string) => void;
        onDelete?: (nodeId: string) => void;
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

    const handleDelete = () => {
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    return (
        <>
            <Box
                bg="white"
                border="2px solid #1a365d"
                borderRadius="md"
                p={2}
                w="xs"
                minH="6xs"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                cursor="pointer"
                onDoubleClick={handleDoubleClick}
                _hover={{ boxShadow: 'md' }}
                position={'relative'}
            >
                <NodeMenu onDelete={handleDelete} />

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
            </Box>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}
