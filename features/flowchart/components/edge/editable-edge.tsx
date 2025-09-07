"use client";

import type { EdgeProps, Edge } from "@xyflow/react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "@xyflow/react";
import { XIcon } from "@yamada-ui/lucide";
import { Input, Box, IconButton, HStack } from "@yamada-ui/react";
import type { MouseEvent, KeyboardEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { adjustEdgeLabelPosition, getCyclicEdgeStyle } from "../../hooks/edge-layout";
import { getArrowTypeSymbol } from "../../hooks/mermaid";
import type { MermaidArrowType } from "../../types/types";
import { ArrowTypeSelector } from "./arrow-type-selector";

interface EditableEdgeProps extends EdgeProps {
  data?: {
    label?: string;
    arrowType?: MermaidArrowType;
    onLabelChange?: (edgeId: string, newLabel: string) => void;
    onArrowTypeChange?: (edgeId: string, arrowType: MermaidArrowType) => void;
    onDelete?: (edgeId: string) => void;
    allEdges?: Edge[]; // 全エッジの情報（循環参照検出用）
    enableCyclicEdgeStyling?: boolean; // 循環参照エッジのスタイリングを有効にするか
  };
}

interface EdgeContentProps {
  id: string;
  labelX: number;
  labelY: number;
  data?: EditableEdgeProps["data"];
}

export function EdgeContent({ id, labelX, labelY, data }: EdgeContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edgeLabel, setEdgeLabel] = useState(data?.label || "");
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    if (data?.onLabelChange) {
      data.onLabelChange(id, edgeLabel);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEdgeLabel(data?.label || "");
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const handleArrowTypeChange = (arrowType: MermaidArrowType) => {
    if (data?.onArrowTypeChange) {
      data.onArrowTypeChange(id, arrowType);
    }
  };

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (data?.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <Box
      position="absolute"
      transform={`translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}
      pointerEvents="all"
      className="nodrag nopan"
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          value={edgeLabel}
          onChange={(e) => setEdgeLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          size="sm"
          w="120px"
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          fontSize="12px"
          textAlign="center"
        />
      ) : (
        <HStack gap="1" align="center">
          <Box
            onClick={handleClick}
            bg="white"
            p="1"
            px="2"
            borderRadius="md"
            fontSize="xs"
            border="1px solid"
            borderColor="gray.300"
            cursor="pointer"
            minW="20px"
            textAlign="center"
            display="flex"
            alignItems="center"
            gap="1"
          >
            <Box as="span" color="blue.600" fontWeight="bold">
              {getArrowTypeSymbol(data?.arrowType || "arrow")}
            </Box>
            <Box as="span">{edgeLabel || "..."}</Box>
          </Box>
          <ArrowTypeSelector
            currentArrowType={data?.arrowType || "arrow"}
            onArrowTypeChange={handleArrowTypeChange}
          />
          <IconButton
            aria-label="Delete edge"
            icon={<XIcon />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={handleDelete}
            bg="white"
            border="1px solid"
            borderColor="red.300"
            _hover={{ bg: "red.50" }}
          />
        </HStack>
      )}
    </Box>
  );
}

export function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  source,
  target,
}: EditableEdgeProps) {
  const { getEdges, getNodes } = useReactFlow();
  const allEdges = getEdges();
  const allNodes = getNodes();

  const currentEdge = { id, source, target };

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 循環参照対応のラベル位置調整
  const { adjustedX, adjustedY } = adjustEdgeLabelPosition(
    currentEdge,
    labelX,
    labelY,
    allEdges,
    allNodes
  );

  // 循環参照対応のエッジスタイル（オプション）
  // ラベル位置調整のみにしたい場合は enableCyclicEdgeStyling: false にする
  const cyclicStyle = getCyclicEdgeStyle(
    currentEdge,
    allEdges,
    data?.enableCyclicEdgeStyling ?? false
  ); // ラベル位置のみ

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={cyclicStyle} />
      <EdgeLabelRenderer>
        <EdgeContent id={id} labelX={adjustedX} labelY={adjustedY} data={data} />
      </EdgeLabelRenderer>
    </>
  );
}
