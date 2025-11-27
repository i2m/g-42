import { useMemo } from "react";
import {
  ActionButton,
  Breadcrumbs,
  Flex,
  Item,
  ListView,
  Menu,
  MenuTrigger,
  View,
} from "@adobe/react-spectrum";

import { useAuthContext } from "../../users/Auth.context";
import {
  RoundsListContextProvider,
  useRoundsListContext,
} from "./RoundsList.context";

import { Header } from "../../../components/Header";
import { Loading } from "../../../components/Loading";
import { NoResults } from "./components/NoResults";
import { RoundListItem } from "./components/RoundsListItem";

export function RoundsList() {
  return (
    <RoundsListContextProvider>
      <RoundsListInner />
    </RoundsListContextProvider>
  );
}

function RoundsListInner() {
  const { user, logout } = useAuthContext();
  const { rounds, isLoading, createNewRound } = useRoundsListContext();

  const title = useMemo(() => {
    return (
      <Breadcrumbs>
        <Item href="/">Rounds List</Item>
      </Breadcrumbs>
    );
  }, []);

  const userMenu = useMemo(() => {
    return (
      <MenuTrigger>
        <ActionButton marginY="size-100">{user?.username}</ActionButton>
        <Menu onAction={logout}>
          <Item key="logout">Logout</Item>
        </Menu>
      </MenuTrigger>
    );
  }, [logout, user]);

  return (
    <Flex direction="column" flexGrow={1} width={{ M: "size-6000", S: "100%" }}>
      <View paddingX="size-200">
        <Header title={title} user={userMenu} />
      </View>

      <View paddingX="size-200" paddingBottom="size-200">
        <Flex direction="column">
          {user?.role === "admin" && (
            <View flex paddingBottom="size-200">
              <ActionButton onPress={createNewRound}>Create Round</ActionButton>
            </View>
          )}

          {isLoading ? (
            <Loading />
          ) : (
            <ListView
              items={rounds}
              minHeight="size-1000"
              renderEmptyState={NoResults}
              aria-label="List of rounds"
            >
              {(round) => (
                <Item
                  key={round.id}
                  textValue={round.id}
                  href={`/rounds/${round.id}`}
                >
                  <RoundListItem round={round} />
                </Item>
              )}
            </ListView>
          )}
        </Flex>
      </View>
    </Flex>
  );
}
