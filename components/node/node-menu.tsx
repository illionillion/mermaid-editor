"use client";

import { GripIcon, SquarePenIcon, TrashIcon, TagIcon } from "@yamada-ui/lucide";
import { IconButton, Menu, MenuButton, MenuItem, MenuList, MenuSeparator } from "@yamada-ui/react";
import { ShapeSelector } from "./shape-selector";

interface NodeMenuProps {
  // Define any props if needed
  onEdit?: () => void;
  onEditVariableName?: () => void;
  onDelete?: () => void;
  onShapeChange?: (shapeType: string) => void;
  currentShape?: string;
}

export const NodeMenu = ({
  onEdit,
  onEditVariableName,
  onDelete,
  onShapeChange,
  currentShape,
}: NodeMenuProps) => {
  return (
    <Menu>
      <MenuButton
        size="xs"
        position="absolute"
        top={0}
        right={0}
        as={IconButton}
        icon={<GripIcon fontSize="2xl" />}
        variant="ghost"
      />

      <MenuList>
        <MenuItem icon={<SquarePenIcon fontSize="xl" />} onClick={onEdit}>
          ラベル編集
        </MenuItem>
        <MenuItem icon={<TagIcon fontSize="xl" />} onClick={onEditVariableName}>
          変数名編集
        </MenuItem>

        <MenuSeparator />

        {/* 形状選択のサブメニュー */}
        <ShapeSelector currentShape={currentShape} onShapeChange={onShapeChange} />

        <MenuSeparator />

        <MenuItem
          color="danger"
          icon={<TrashIcon fontSize="xl" color="danger" />}
          onClick={onDelete}
        >
          削除
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
