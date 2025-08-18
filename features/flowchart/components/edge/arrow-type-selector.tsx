"use client";

import { ChevronDownIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Portal, FC } from "@yamada-ui/react";
import { getArrowTypeDisplayName } from "../../hooks/mermaid";
import { MermaidArrowType, ARROW_TYPES } from "../../types/types";

interface ArrowTypeSelectorProps {
  currentArrowType: MermaidArrowType;
  onArrowTypeChange: (arrowType: MermaidArrowType) => void;
}

export const ArrowTypeSelector: FC<ArrowTypeSelectorProps> = ({
  currentArrowType,
  onArrowTypeChange,
}) => {
  return (
    <Menu>
      <MenuButton
        className="arrow-type-selector-button"
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
      <Portal>
        <MenuList bg="white" boxShadow="lg" border="1px solid" borderColor="gray.200">
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
      </Portal>
    </Menu>
  );
};
