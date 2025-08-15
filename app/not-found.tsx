import { Link as UILink, Center, Heading, Text } from "@yamada-ui/react";
import Link from "next/link";

export const metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは存在しません。",
};

const NotFound = () => {
  return (
    <Center as="main" gap="md" flexDir="column" width="full" height="100vh">
      <Heading as="h1">404 - ページが見つかりません</Heading>
      <Text>お探しのページは存在しません。</Text>
      <UILink as={Link} href="/">
        ホームに戻る
      </UILink>
    </Center>
  );
};

export default NotFound;
