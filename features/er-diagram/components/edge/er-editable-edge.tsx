import { XIcon } from "@yamada-ui/lucide";
import { Box, Input, HStack, IconButton } from "@yamada-ui/react";
import { useState, useRef, useEffect } from "react";
import { ErCardinality } from "../../types/types";
import { ErCardinalitySelector } from "./er-cardinality-selector";

interface ErEditableEdgeProps {
  id: string;
  label: string;
  cardinality: ErCardinality;
  onLabelChange: (id: string, label: string) => void;
  onCardinalityChange: (id: string, cardinality: ErCardinality) => void;
  onDelete: (id: string) => void;
}

export function ErEditableEdge({
  id,
  label,
  cardinality,
  onLabelChange,
  onCardinalityChange,
  onDelete,
}: ErEditableEdgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edgeLabel, setEdgeLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleLabelSubmit = () => {
    setIsEditing(false);
    onLabelChange(id, edgeLabel);
  };

  return (
    <Box>
      {isEditing ? (
        <Input
          ref={inputRef}
          value={edgeLabel}
          onChange={(e) => setEdgeLabel(e.target.value)}
          onBlur={handleLabelSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLabelSubmit();
            if (e.key === "Escape") {
              setIsEditing(false);
              setEdgeLabel(label);
            }
          }}
          size="sm"
          w="120px"
          bg="white"
          border="1px solid"
          borderColor="gray.300"
          fontSize="12px"
          textAlign="center"
        />
      ) : (
        <HStack>
          <Box
            onClick={() => setIsEditing(true)}
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
            {edgeLabel || "relation"}
          </Box>
          <ErCardinalitySelector
            current={cardinality}
            onChange={(type) => onCardinalityChange(id, type)}
          />
          <IconButton
            aria-label="Delete edge"
            icon={<XIcon />}
            size="xs"
            variant="outline"
            colorScheme="red"
            onClick={() => onDelete(id)}
          />
        </HStack>
      )}
    </Box>
  );
}
