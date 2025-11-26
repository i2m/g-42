import {
  ColorSwatch,
  Divider,
  Flex,
  Heading,
  View,
} from "@adobe/react-spectrum";

import type { Round } from "../../Rounds.api";
import { useRoundStatus } from "../../Rounds.utils";

export function RoundListItem({ round }: { round: Round }) {
  const { status } = useRoundStatus(round);

  const startDate = new Date(round.start);
  const endDate = new Date(round.end);

  const statusColor =
    status === "Active" ? "#080" : status === "Cooldown" ? "#f80" : "#A00";

  return (
    <View flex paddingBottom="size-100">
      <Flex direction="row" alignItems="center" columnGap="size-100">
        <View>
          <ColorSwatch color={`${statusColor}`} rounding="full" size="XS" />
        </View>
        <View flexGrow={1}>
          <Heading level={4}>Round ID: {round.id}</Heading>
        </View>
      </Flex>
      <View>
        <table width="100%">
          <tbody>
            <tr>
              <td>Start:</td>
              <td>{startDate.toLocaleDateString()}</td>
              <td>{startDate.toLocaleTimeString()}</td>
            </tr>
            <tr>
              <td>End:</td>
              <td>{endDate.toLocaleDateString()}</td>
              <td>{endDate.toLocaleTimeString()}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <Divider size="S" />
              </td>
            </tr>
            <tr>
              <td>Status: </td>
              <td colSpan={2}>{status}</td>
            </tr>
          </tfoot>
        </table>
      </View>
    </View>
  );
}
