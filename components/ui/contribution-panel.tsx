import { Panel } from "@xyflow/react";
import { GithubIcon } from "@yamada-ui/lucide";
import { IconButton, Link } from "@yamada-ui/react";

export const ContributionPanel = () => {
  return (
    <Panel position="top-right">
      <ContributionPanelContent />
    </Panel>
  );
};

export const ContributionPanelContent = () => {
  return (
    <IconButton
      icon={<GithubIcon />}
      size="sm"
      as={Link}
      href="https://github.com/illionillion/mermaid-editor"
      target="_blank"
      rel="noopener noreferrer"
      display="flex"
      alignItems="center"
      gap={1}
      fontSize="sm"
      bg="gray.600"
      color="white"
      _hover={{ bg: "black", textDecoration: "none" }}
    />
  );
};
