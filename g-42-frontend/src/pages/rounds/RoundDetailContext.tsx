import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  findRoundById,
  myScore,
  tap,
  winner,
  type Round,
  type Tap,
} from "./Rounds.api";
import type { User } from "../users/users.api";
import { roundStatus } from "./rounds.utils";

interface RoundDetailContextState {
  round: Round | undefined;
  myScore: Tap | undefined;
  winner: User | undefined;
  tapOnGoose: () => Promise<Tap>;
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

  const { data: user } = useQuery<User>({
    queryKey: ["winner", roundId],
    queryFn: () => winner(roundId),
    enabled: round !== undefined && roundStatus(round) === "Ended",
  });

  const { mutateAsync: tapOnGooseAsync } = useMutation({
    mutationFn: () => tap(roundId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rounds", roundId] });
    },
  });

  return (
    <RoundDetailContext.Provider
      value={{
        round,
        myScore: score,
        winner: user,
        tapOnGoose: tapOnGooseAsync,
      }}
    >
      {children}
    </RoundDetailContext.Provider>
  );
}
