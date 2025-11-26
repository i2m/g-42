import { Flex, Heading, View } from "@adobe/react-spectrum";

import { Goose } from "./Goose";

import type { Round } from "../../Rounds.api";
import { useCountdown, useRoundStatus } from "../../Rounds.utils";

export function RoundCooldown({ round }: { round: Round }) {
  const { status } = useRoundStatus(round);
  const { countdown } = useCountdown(new Date(round.start));

  return (
    <View
      flex
      flexGrow={1}
      borderWidth="thin"
      borderRadius="medium"
      borderColor="light"
      paddingX="size-200"
    >
      <Flex direction="column" alignItems="center" justifyContent="center">
        <View flex paddingY="size-400">
          <Goose isDisabled />
        </View>
        <View flex padding="size-400">
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Heading level={3}>{status}</Heading>
            <Heading level={5}>Time before start: {countdown}</Heading>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
