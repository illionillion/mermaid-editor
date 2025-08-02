"use client";

import { ShapesIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuItem, MenuList, Box, Text } from "@yamada-ui/react";
import { SHAPE_OPTIONS } from "../types/types";

interface ShapeSelectorProps {
  currentShape?: string;
  onShapeChange?: (shapeType: string) => void;
}

export const ShapeSelector = ({ currentShape, onShapeChange }: ShapeSelectorProps) => {
  return (
    <Menu>
      <MenuButton as={MenuItem} icon={<ShapesIcon fontSize="xl" />}>
        ノード形状
      </MenuButton>
      <MenuList>
        {SHAPE_OPTIONS.map((shape) => (
          <MenuItem
            key={shape.type}
            onClick={() => onShapeChange?.(shape.type)}
            bg={currentShape === shape.type ? "primary.50" : undefined}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" w="full">
              <Text>{shape.label}</Text>
              <Text fontSize="sm" color="muted" fontFamily="mono">
                {shape.symbol}
              </Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
