"use client";

import { ChevronDownIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuList, MenuItem, IconButton } from "@yamada-ui/react";
import { getArrowTypeDisplayName } from "../../utils/mermaid";
import { MermaidArrowType } from "../types/types";

interface ArrowTypeSelectorProps {
  currentArrowType: MermaidArrowType;
  onArrowTypeChange: (arrowType: MermaidArrowType) => void;
}

const ARROW_TYPES: MermaidArrowType[] = [
  "arrow",
  "thick", 
  "dotted",
  "dotted-thick",
  "invisible",
  "bidirectional",
  "bidirectional-thick"
];

export function ArrowTypeSelector({ currentArrowType, onArrowTypeChange }: ArrowTypeSelectorProps) {
  return (
    <Menu __styles={{
        ".ui-popover": {
            // zIndex: 1000, 効かない
        }
    }}>
      <MenuButton
        as={IconButton}
        aria-label="Select arrow type"
        icon={<ChevronDownIcon />}
        size="xs"
        variant="outline"
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.50" }}
      />
      <MenuList>
        {ARROW_TYPES.map((arrowType) => (
          <MenuItem 
            key={arrowType}
            onClick={() => onArrowTypeChange(arrowType)}
            bg={currentArrowType === arrowType ? "blue.50" : "white"}
            color={currentArrowType === arrowType ? "blue.600" : "gray.700"}
            fontSize="sm"
          >
            {getArrowTypeDisplayName(arrowType)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
