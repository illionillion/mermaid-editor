'use client';

import { Box, Input } from '@yamada-ui/react';
import { MouseEvent, ChangeEvent, KeyboardEvent } from 'react';

interface VariableNameEditorProps {
    value: string;
    isEditing: boolean;
    onClick: (e: MouseEvent) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
    onBlur: () => void;
}

export function VariableNameEditor({
    value,
    isEditing,
    onClick,
    onChange,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
    onBlur
}: VariableNameEditorProps) {
    return (
        <Box
            position="absolute"
            top="-12px"
            left="0px"
            bg="blue.500"
            color="white"
            px={1}
            py="1px"
            borderRadius="sm"
            fontSize="10px"
            fontWeight="medium"
            cursor="pointer"
            onClick={onClick}
            _hover={{ bg: "blue.600" }}
            zIndex={10}
        >
            {isEditing ? (
                <Input
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onCompositionStart={onCompositionStart}
                    onCompositionEnd={onCompositionEnd}
                    onBlur={onBlur}
                    size="xs"
                    autoFocus
                    w="60px"
                    h="16px"
                    p={0}
                    fontSize="10px"
                    bg="white"
                    color="black"
                    border="none"
                    _focus={{ boxShadow: 'none', outline: 'none' }}
                />
            ) : (
                value
            )}
        </Box>
    );
}
