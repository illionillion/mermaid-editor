import { Link as UILink, Center, Heading, Text } from "@yamada-ui/react";
import Link from "next/link";

export const metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは存在しません。",
};

const NotFound = () => {
  return (
    <Center gap="md" flexDir="column" height="100vh">
      <Heading>404 - ページが見つかりません</Heading>
      <Text>お探しのページは存在しません。</Text>
      <UILink as={Link} href="/">
        ホームに戻る
      </UILink>
    </Center>
  );
};

export default NotFound;
