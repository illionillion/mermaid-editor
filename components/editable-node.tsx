'use client';

import { Handle, Position } from '@xyflow/react';
import { Box, Text, Input } from '@yamada-ui/react';
import { useState, useRef } from 'react';
import { NodeMenu } from './node-menu';

interface EditableNodeProps {
    data: {
        label: string;
        variableName?: string;
        onLabelChange?: (nodeId: string, newLabel: string) => void;
        onVariableNameChange?: (nodeId: string, newVariableName: string) => void;
        onDelete?: (nodeId: string) => void;
    };
    id: string;
}

export function EditableNode({ data, id }: EditableNodeProps) {
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [isEditingVariableName, setIsEditingVariableName] = useState(false);
    const [label, setLabel] = useState(data.label);
    const [variableName, setVariableName] = useState(data.variableName || `node${id}`);
    const [isComposing, setIsComposing] = useState(false); // IME入力状態を管理
    const lastVariableClickTime = useRef<number>(0); // 変数名クリック時刻を記録

    const handleLabelDoubleClick = () => {
        // 変数名クリック直後（300ms以内）はダブルクリックを無視
        const now = Date.now();
        if (now - lastVariableClickTime.current < 300) {
            return;
        }

        // 変数名編集中の場合は強制終了
        if (isEditingVariableName) {
            handleVariableNameSave();
        }
        setIsEditingLabel(true);
    };

    const handleVariableNameClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // クリックイベントが親要素に伝播しないようにする
        e.preventDefault(); // デフォルトの動作を防ぐ
        
        // クリック時刻を記録
        lastVariableClickTime.current = Date.now();
        
        // ラベル編集中の場合は強制終了
        if (isEditingLabel) {
            handleLabelSave();
        }
        
        setIsEditingVariableName(true);
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    };

    const handleVariableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVariableName(e.target.value);
    };

    const handleLabelSave = () => {
        setIsEditingLabel(false);
        if (data.onLabelChange) {
            data.onLabelChange(id, label);
        }
    };

    const handleVariableNameSave = () => {
        setIsEditingVariableName(false);
        if (data.onVariableNameChange) {
            data.onVariableNameChange(id, variableName);
        }
    };

    const handleLabelCancel = () => {
        setIsEditingLabel(false);
        setLabel(data.label);
    };

    const handleVariableNameCancel = () => {
        setIsEditingVariableName(false);
        setVariableName(data.variableName || `node${id}`);
    };

    const handleLabelKeyPress = (e: React.KeyboardEvent) => {
        // IME入力中はEnterキーを無視
        if (e.key === 'Enter' && !isComposing) {
            handleLabelSave();
        } else if (e.key === 'Escape') {
            handleLabelCancel();
        }
    };

    const handleVariableNameKeyPress = (e: React.KeyboardEvent) => {
        // IME入力中はEnterキーを無視
        if (e.key === 'Enter' && !isComposing) {
            handleVariableNameSave();
        } else if (e.key === 'Escape') {
            handleVariableNameCancel();
        }
    };

    // IME関連のイベントハンドラー
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const handleDelete = () => {
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    const handleEdit = () => {
        // 変数名編集中の場合は強制終了
        if (isEditingVariableName) {
            handleVariableNameSave();
        }
        setIsEditingLabel(true);
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
                onDoubleClick={handleLabelDoubleClick}
                _hover={{ boxShadow: 'md' }}
                position={'relative'}
            >
                {/* 変数名を左上に表示 */}
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
                    onClick={handleVariableNameClick}
                    _hover={{ bg: "blue.600" }}
                    zIndex={10}
                >
                    {isEditingVariableName ? (
                        <Input
                            value={variableName}
                            onChange={handleVariableNameChange}
                            onKeyDown={handleVariableNameKeyPress}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
                            onBlur={handleVariableNameSave}
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
                        data.variableName || `node${id}`
                    )}
                </Box>

                <NodeMenu onDelete={handleDelete} onEdit={handleEdit} />

                {/* メインのラベル表示・編集エリア */}
                {isEditingLabel ? (
                    <Input
                        value={label}
                        onChange={handleLabelChange}
                        onKeyDown={handleLabelKeyPress}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        onBlur={handleLabelSave}
                        size="sm"
                        autoFocus
                        textAlign="center"
                        w="full"
                        h="24px"
                        p={1}
                        fontSize="sm"
                        border="none"
                        bg="transparent"
                        _focus={{ boxShadow: 'none', outline: 'none' }}
                    />
                ) : (
                    <Text
                        w="full"
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
