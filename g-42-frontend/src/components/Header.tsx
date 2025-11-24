import { Divider, Flex, View } from "@adobe/react-spectrum";
import { useAuthContext } from "../pages/users/AuthContext";

export function Header({ title }: { title: string }) {
  const { user } = useAuthContext();

  return (
    <View flex flexGrow={1} padding="size-400">
      <Flex direction="row" columnGap="static-size-3400">
        <h3 id="label-3">{title}</h3>
        <h3 id="label-3">({user?.username || ""})</h3>
      </Flex>

      <Divider />
    </View>
  );
}
