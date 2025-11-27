import type { ReactNode } from "react";
import { Divider, Flex, View } from "@adobe/react-spectrum";

export function Header({ title, user }: { title: ReactNode; user: ReactNode }) {
  return (
    <View flex flexGrow={1} paddingY="size-400">
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <View>{title}</View>
        {user !== undefined && <View marginStart="size-100">{user}</View>}
      </Flex>
      <Divider />
    </View>
  );
}
