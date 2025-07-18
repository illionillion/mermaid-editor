import { GripIcon, SquarePenIcon, TrashIcon, } from "@yamada-ui/lucide";
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@yamada-ui/react";

interface NodeMenuProps {
    // Define any props if needed
    onEdit?: () => void;
    onDelete?: () => void;
}

export const NodeMenu = ({ onEdit, onDelete }: NodeMenuProps) => {
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
                <MenuItem icon={<SquarePenIcon fontSize="xl" />} onClick={onEdit}>編集</MenuItem>
                <MenuItem color="danger" icon={<TrashIcon fontSize="xl" color="danger" />} onClick={onDelete}>削除</MenuItem>
            </MenuList>
        </Menu>
    );
}