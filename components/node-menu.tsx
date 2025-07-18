import { GripIcon, TrashIcon } from "@yamada-ui/lucide";
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@yamada-ui/react";

interface NodeMenuProps {
  // Define any props if needed
  onDelete?: () => void;
}

export const NodeMenu = ({ onDelete }: NodeMenuProps) => {
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
                <MenuItem color="danger" icon={<TrashIcon fontSize="xl" color="danger" />} onClick={onDelete}>削除</MenuItem>
            </MenuList>
        </Menu>
    );
}