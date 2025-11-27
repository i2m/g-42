import { createContext, useCallback, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  findRoundById,
  myScore,
  useRoundsWS,
  winner,
  type Round,
  type RoundsIncomingMessage,
  type Tap,
  type Winner,
} from "../Rounds.api";

import { useRoundStatus } from "../Rounds.utils";

interface RoundDetailContextState {
  round: Round | undefined;
  myScore: Tap | undefined;
  winner: Winner | undefined;
  tapOnGoose: () => void;
}

const RoundDetailContext = createContext<RoundDetailContextState | null>(null);

export function useRoundDetailContext() {
  const context = useContext(RoundDetailContext);
  if (context == null) {
    throw new Error(
      "useRoundDetailContext must be used within an RoundDetailContext.Provider",
    );
  }
  return context;
}

export function RoundDetailContextProvider({
  roundId,
  children,
}: {
  roundId: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data: round } = useQuery<Round>({
    queryKey: ["rounds", roundId],
    queryFn: () => findRoundById(roundId),
  });

  const { data: score } = useQuery<Tap>({
    queryKey: ["taps", roundId],
    queryFn: () => myScore(roundId),
  });

  const { status } = useRoundStatus(round);

  useEffect(() => {
    // refetch round data if status has changes
    // when round ends, we need lastest updates of totalScore field
    queryClient.invalidateQueries({ queryKey: ["rounds", roundId] });
  }, [queryClient, roundId, status]);

  const { data: user } = useQuery<Winner>({
    queryKey: ["winner", roundId],
    queryFn: () => winner(roundId),
    enabled: status === "Ended",
  });

  const handleRoundWSMessage = useCallback(
    (message: RoundsIncomingMessage) => {
      switch (message.type) {
        case "Tap": {
          queryClient.setQueriesData<Tap>(
            { queryKey: ["taps", roundId] },
            (oldTap) => ({ ...(oldTap || {}), ...message.data }),
          );
          break;
        }
        case "Error": {
          console.warn(message.data.message);
          break;
        }
      }
    },
    [queryClient, roundId],
  );

  const { sendMessage } = useRoundsWS(handleRoundWSMessage);

  const tapOnGoose = useCallback(() => {
    sendMessage({ type: "MakeTap", data: { roundId } });
  }, [roundId, sendMessage]);

  return (
    <RoundDetailContext.Provider
      value={{
        round,
        myScore: score,
        winner: user,
        tapOnGoose,
      }}
    >
      {children}
    </RoundDetailContext.Provider>
  );
}
