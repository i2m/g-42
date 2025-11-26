import { Divider, Flex, Heading, View } from "@adobe/react-spectrum";

import { Goose } from "./Goose";

import type { Round, Tap } from "../../Rounds.api";
import type { User } from "../../../users/Users.api";

export function RoundEnded({
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
      borderWidth="thin"
      borderRadius="medium"
      borderColor="light"
      paddingX="size-200"
    >
      <Flex direction="column" alignItems="center">
        <View flex paddingY="size-400">
          <Goose isDisabled />
        </View>

        <View flex paddingY="size-200" minWidth="size-3000">
          <Divider size="S" marginBottom="size-200" />

          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <View>
              <Heading level={4}>Total score</Heading>
              <Heading level={4}>Winner – {winner.username}</Heading>
              <Heading level={4}>My score</Heading>
            </View>
            <View>
              <Heading level={4}>{round?.totalScore}</Heading>
              <Heading level={4}>-</Heading>
              <Heading level={4}>{myScore.score}</Heading>
            </View>
          </Flex>
        </View>
      </Flex>
    </View>
  );
}
