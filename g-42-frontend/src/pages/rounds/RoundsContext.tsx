import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createRound, getRounds, type Round } from "./Rounds.api";

interface RoundsContextState {
  rounds: Round[];
  createNewRound: () => Promise<Round>;
}

const RoundsContext = createContext<RoundsContextState | null>(null);

export function useRoundsContext() {
  const context = useContext(RoundsContext);
  if (context == null) {
    throw new Error(
      "useRoundsContext must be used within an RoundsContext.Provider",
    );
  }
  return context;
}

export function RoundsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data: rounds } = useQuery<Round[]>({
    queryKey: ["rounds"],
    queryFn: getRounds,
  });

  const { mutateAsync: createAsync } = useMutation({
    mutationFn: createRound,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rounds"] });
    },
  });

  return (
    <RoundsContext.Provider
      value={{
        rounds: rounds || [],
        createNewRound: createAsync,
      }}
    >
      {children}
    </RoundsContext.Provider>
  );
}
