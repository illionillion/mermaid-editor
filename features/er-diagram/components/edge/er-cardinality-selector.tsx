import { ChevronDownIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuList, MenuItem, Button, Portal } from "@yamada-ui/react";
import { ErCardinality, ER_CARDINALITY_DISPLAY_LABELS } from "../../types/types";

interface ErCardinalitySelectorProps {
  current: ErCardinality;
  onChange: (type: ErCardinality) => void;
}

export const ErCardinalitySelector = ({ current, onChange }: ErCardinalitySelectorProps) => (
  <Menu>
    <MenuButton as={Button} colorScheme="green" size="xs" rightIcon={<ChevronDownIcon />}>
      {ER_CARDINALITY_DISPLAY_LABELS[current]}
    </MenuButton>
    <Portal>
      <MenuList>
        {Object.entries(ER_CARDINALITY_DISPLAY_LABELS).map(([type, symbol]) => (
          <MenuItem key={type} onClick={() => onChange(type as ErCardinality)}>
            {symbol} {type.replace(/-/g, " ")}
          </MenuItem>
        ))}
      </MenuList>
    </Portal>
  </Menu>
);
