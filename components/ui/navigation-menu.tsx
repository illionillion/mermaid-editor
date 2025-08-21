"use client";

import { Menu, MenuButton, MenuList, MenuItem, Button } from "@yamada-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "フローチャートエディタ", path: "/flow-chart" },
  { label: "ER図エディタ", path: "/er-diagram" },
];

export const NavigationMenu = () => {
  const pathname = usePathname();
  // '/' の時はフローチャートを選択中とみなす
  const isRoot = pathname === "/";
  const current = isRoot
    ? NAV_ITEMS.find((item) => item.path === "/flow-chart")
    : NAV_ITEMS.find((item) => pathname.startsWith(item.path));

  // 現在のルート以外のみをメニューに表示
  const menuItems = NAV_ITEMS.filter(
    (item) => !(isRoot ? item.path === "/flow-chart" : pathname.startsWith(item.path))
  );

  return (
    <Menu>
      <MenuButton as={Button} variant="outline" size="sm">
        {current?.label ?? "エディタを選択"}
      </MenuButton>
      <MenuList>
        {menuItems.map((item) => (
          <MenuItem key={item.path} as={Link} href={item.path}>
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
