import { useCallback, useState } from "react";
import { Flex, Heading, View } from "@adobe/react-spectrum";

import { Goose } from "./Goose";

import type { Round, Tap } from "../../Rounds.api";
import { useCountdown } from "../../Rounds.utils";

export function RoundActive({
  round,
  myScore,
  tapOnGoose,
}: {
  round: Round;
  myScore: Tap | undefined;
  tapOnGoose: () => Promise<Tap>;
}) {
  const [myCurrentScore, setMyCurrentScore] = useState(myScore?.score || 0);
  const { countdown } = useCountdown(new Date(round.end));

  const tapOnGooseHandler = useCallback(async () => {
    const t = await tapOnGoose();
    setMyCurrentScore(t.score);
  }, [tapOnGoose]);

  return (
    <View
      flex
      flexGrow={1}
      borderWidth="thin"
      borderRadius="medium"
      borderColor="light"
      paddingX="size-200"
    >
      <Flex direction="column" alignItems="center">
        <View flex paddingY="size-400">
          <Goose onPress={tapOnGooseHandler} />
        </View>

        <View flex padding="size-400">
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Heading level={3}>Round is Active!</Heading>
            <Heading level={5}>Time before end: {countdown}</Heading>
            <Heading level={4}>
              My score: {myCurrentScore || myScore?.count}
            </Heading>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
