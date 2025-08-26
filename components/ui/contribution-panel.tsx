import { Panel } from "@xyflow/react";
import { CircleDotIcon, CodeIcon, GithubIcon } from "@yamada-ui/lucide";
import { Menu, MenuButton, MenuList, MenuItem, IconButton, Link } from "@yamada-ui/react";

export const ContributionPanel = () => {
  return (
    <Panel position="top-right">
      <ContributionPanelContent />
    </Panel>
  );
};

export const ContributionPanelContent = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<GithubIcon />}
        size="sm"
        aria-label="コントリビューションメニュー"
        bg="gray.600"
        color="white"
        _hover={{ bg: "black", textDecoration: "none" }}
      />
      <MenuList>
        <MenuItem
          as={Link}
          href="https://github.com/illionillion/mermaid-editor"
          target="_blank"
          rel="noopener noreferrer"
          icon={<CodeIcon />}
        >
          リポジトリを見る
        </MenuItem>
        <MenuItem
          as={Link}
          href="https://github.com/illionillion/mermaid-editor/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          icon={<CircleDotIcon />}
        >
          Issueを作成
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
