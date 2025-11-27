import type { ReactNode } from "react";
import { Divider, Flex, View } from "@adobe/react-spectrum";
import type { User } from "../pages/users/Users.api";

export function Header({ title, user }: { title: ReactNode; user?: User }) {
  return (
    <View flex flexGrow={1} paddingY="size-400">
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <View>{title}</View>

        {user !== undefined && (
          <View marginStart="size-100">
            <h3 id="label-3">({user.username || ""})</h3>
          </View>
        )}
      </Flex>

      <Divider />
    </View>
  );
}
