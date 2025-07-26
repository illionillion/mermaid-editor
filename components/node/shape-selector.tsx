"use client";

import { ShapesIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuItem, MenuList, Box, Text } from "@yamada-ui/react";

interface ShapeSelectorProps {
    currentShape?: string;
    onShapeChange?: (shapeType: string) => void;
}

export const ShapeSelector = ({ currentShape, onShapeChange }: ShapeSelectorProps) => {
    const shapeOptions = [
        { type: 'rectangle', label: '四角形', symbol: '[ ]' },
        { type: 'diamond', label: '菱形', symbol: '{ }' },
        { type: 'rounded', label: '角丸四角', symbol: '( )' },
        { type: 'circle', label: '円形', symbol: '(( ))' },
        { type: 'hexagon', label: '六角形', symbol: '{{ }}' },
        { type: 'stadium', label: 'スタジアム', symbol: '([ ])' },
    ];

    return (
        <Menu>
            <MenuButton as={MenuItem} icon={<ShapesIcon fontSize="xl" />}>
                ノード形状
            </MenuButton>
            <MenuList>
                {shapeOptions.map((shape) => (
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
