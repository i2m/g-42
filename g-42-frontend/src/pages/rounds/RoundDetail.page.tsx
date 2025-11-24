import { ActionButton, Flex, View } from "@adobe/react-spectrum";
import { useParams } from "react-router";

import {
  RoundDetailContextProvider,
  useRoundDetailContext,
} from "./RoundDetailContext";
import { useCallback, useState } from "react";
import { roundStatus } from "./rounds.utils";
import type { Round, Tap } from "./Rounds.api";
import { Loading } from "../../components/Loading";
import type { User } from "../users/users.api";
import { Header } from "../../components/Header";

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
  const { round, myScore, tapOnGoose, winner } = useRoundDetailContext();

  const status = round ? roundStatus(round) : "Unknown";

  return (
    <Flex direction="column" alignContent="center" alignItems="center">
      <Header title="Round" />

      <View flex flexGrow={1} padding="size-400">
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

function RoundActive({
  round,
  myScore,
  tapOnGoose,
}: {
  round: Round;
  myScore: Tap | undefined;
  tapOnGoose: () => Promise<Tap>;
}) {
  const [myCurrentScore, setMyCurrentScore] = useState(myScore?.score || 0);

  const tapOnGooseHandler = useCallback(async () => {
    const t = await tapOnGoose();
    setMyCurrentScore(t.score);
  }, [tapOnGoose]);

  const endDate = new Date(round.end);
  const nowDate = new Date();
  const timeToEnd = new Date(endDate.getTime() - nowDate.getTime());

  return (
    <View
      flex
      flexGrow={1}
      marginTop="size-300"
      borderWidth="thin"
      borderRadius="medium"
      borderColor="light"
      padding="size-100"
    >
      <Flex direction="column" alignItems="center">
        <View flex padding="size-400">
          <ActionButton onPress={tapOnGooseHandler}>Goose</ActionButton>
        </View>
        <View flex padding="size-400">
          <p>Round Active!</p>
          <p>Time before end: {timeToEnd.toLocaleTimeString()}</p>
          <p>My score: {myCurrentScore || myScore?.count}</p>
        </View>
      </Flex>
    </View>
  );
}

function RoundCooldown({ round }: { round: Round }) {
  const startDate = new Date(round.start);
  const nowDate = new Date();
  const timeToStart = new Date(startDate.getTime() - nowDate.getTime());

  return (
    <View
      flex
      flexGrow={1}
      marginTop="size-300"
      borderWidth="thin"
      borderRadius="medium"
      borderColor="light"
      padding="size-100"
    >
      <Flex direction="column" alignItems="center">
        <View flex padding="size-400">
          <ActionButton isDisabled>Goose</ActionButton>
        </View>
        <View flex padding="size-400">
          <p>{roundStatus(round)}</p>
          <p>Time before start: {timeToStart.toLocaleTimeString()}</p>
        </View>
      </Flex>
    </View>
  );
}

function RoundEnded({
  round,
  myScore,
  winner,
}: {
  round: Round;
  myScore: Tap;
  winner: User;
}) {
  return (
    <View
      flex
      flexGrow={1}
      marginTop="size-300"
      borderWidth="thin"
      borderRadius="medium"
      borderColor="light"
      padding="size-100"
    >
      <Flex direction="column" alignItems="center">
        <View flex padding="size-400">
          <ActionButton isDisabled>Goose</ActionButton>
        </View>
        <View flex padding="size-400">
          <p>---------------------------------</p>
          <p>Total score: {round?.totalScore}</p>
          <p>Winner: {winner.username}</p>
          <p>My score: {myScore.score}</p>
        </View>
      </Flex>
    </View>
  );
}
