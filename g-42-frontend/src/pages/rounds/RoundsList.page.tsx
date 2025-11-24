import {
  ActionButton,
  Flex,
  Heading,
  IllustratedMessage,
  View,
} from "@adobe/react-spectrum";

import { Link } from "react-router";

import { useAuthContext } from "../users/AuthContext";
import { RoundsContextProvider, useRoundsContext } from "./RoundsContext";
import type { Round } from "./Rounds.api";
import { roundStatus } from "./rounds.utils";
import { Header } from "../../components/Header";

export function RoundsList() {
  return (
    <RoundsContextProvider>
      <RoundsListInner />
    </RoundsContextProvider>
  );
}

function RoundsListInner() {
  const { user } = useAuthContext();
  const { rounds, createNewRound } = useRoundsContext();

  return (
    <Flex direction="column" alignContent="center" alignItems="center">
      <Header title="Rounds" />

      <View flex flexGrow={1} marginTop="size-300">
        {user?.role === "admin" && (
          <ActionButton onPress={createNewRound}>Create Round</ActionButton>
        )}

        {rounds.length === 0 && <NoResults />}

        <View maxWidth="size-6000" marginTop="size-300">
          {rounds.map((round) => {
            return (
              <Link key={round.id} to={`/rounds/${round.id}`}>
                <View
                  borderWidth="thin"
                  borderRadius="medium"
                  borderColor="light"
                  padding="size-100"
                  marginBottom="size-300"
                >
                  <RoundListItem round={round} />
                </View>
              </Link>
            );
          })}
        </View>
      </View>
    </Flex>
  );
}

function RoundListItem({ round }: { round: Round }) {
  const startDate = new Date(round.start);
  const endDate = new Date(round.end);

  return (
    <View flex flexGrow={1}>
      <Heading level={4}>Round ID: {round.id}</Heading>
      <p>
        Start: {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}
      </p>
      <p>
        End: {endDate.toLocaleDateString()} {endDate.toLocaleTimeString()}
      </p>
      <p>Status: {roundStatus(round)}</p>
    </View>
  );
}

function NoResults() {
  return (
    <IllustratedMessage>
      <Heading>No Rounds found</Heading>
    </IllustratedMessage>
  );
}
