import { ChevronDownIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuList, MenuItem, Button, Portal } from "@yamada-ui/react";
import { ErCardinality, ER_CARDINALITY_SYMBOLS } from "../../types/types";

interface ErCardinalitySelectorProps {
  current: ErCardinality;
  onChange: (type: ErCardinality) => void;
}

export const ErCardinalitySelector = ({ current, onChange }: ErCardinalitySelectorProps) => (
  <Menu>
    <MenuButton as={Button} size="xs" rightIcon={<ChevronDownIcon />}>
      {ER_CARDINALITY_SYMBOLS[current]}
    </MenuButton>
    <Portal>
      <MenuList>
        {Object.entries(ER_CARDINALITY_SYMBOLS).map(([type, symbol]) => (
          <MenuItem key={type} onClick={() => onChange(type as ErCardinality)}>
            {symbol} {type.replace(/-/g, " ")}
          </MenuItem>
        ))}
      </MenuList>
    </Portal>
  </Menu>
);
