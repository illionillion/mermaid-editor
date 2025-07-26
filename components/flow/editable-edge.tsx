"use client";

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from "@xyflow/react";
import { Input, Box } from "@yamada-ui/react";
import { useState, useRef, useEffect } from "react";

interface EditableEdgeProps extends EdgeProps {
  data?: {
    label?: string;
    onLabelChange?: (edgeId: string, newLabel: string) => void;
  };
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
}: EditableEdgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edgeLabel, setEdgeLabel] = useState(data?.label || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEdgeLabel(data?.label || "");
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
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
              size="sm"
              w="120px"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
              fontSize="12px"
              textAlign="center"
            />
          ) : (
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
            >
              {edgeLabel || "..."}
            </Box>
          )}
        </Box>
      </EdgeLabelRenderer>
    </>
  );
}
