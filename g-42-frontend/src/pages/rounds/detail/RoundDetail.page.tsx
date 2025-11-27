import { useMemo } from "react";
import { useParams } from "react-router";
import {
  ActionButton,
  Breadcrumbs,
  Flex,
  Item,
  Menu,
  MenuTrigger,
  View,
} from "@adobe/react-spectrum";

import { useAuthContext } from "../../users/Auth.context";
import {
  RoundDetailContextProvider,
  useRoundDetailContext,
} from "./RoundDetail.context";

import { Loading } from "../../../components/Loading";
import { Header } from "../../../components/Header";
import { RoundActive } from "./components/RoundActive";
import { RoundCooldown } from "./components/RoundCooldown";
import { RoundEnded } from "./components/RoundEnded";

import { useRoundStatus } from "../Rounds.utils";

export function RoundDetail() {
  const { roundId } = useParams();

  if (roundId === undefined) {
    return null;
  }

  return (
    <RoundDetailContextProvider roundId={roundId}>
      <RoundDetailInner />
    </RoundDetailContextProvider>
  );
}

export function RoundDetailInner() {
  const { user, logout } = useAuthContext();
  const { round, myScore, tapOnGoose, winner } = useRoundDetailContext();
  const { status } = useRoundStatus(round);

  const title = useMemo(() => {
    return (
      <Breadcrumbs>
        <Item href="/">Rounds List</Item>
        <Item href="/rounds">Round</Item>
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
        {status === "Cooldown" && <RoundCooldown round={round!} />}
        {status === "Active" && (
          <RoundActive
            round={round!}
            myScore={myScore}
            tapOnGoose={tapOnGoose}
          />
        )}
        {status === "Ended" && winner !== undefined && (
          <RoundEnded round={round!} myScore={myScore!} winner={winner} />
        )}
        {status === "Unknown" && <Loading />}
      </View>
    </Flex>
  );
}
