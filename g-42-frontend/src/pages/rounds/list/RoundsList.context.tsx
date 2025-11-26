import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createRound, getRounds, type Round } from "../Rounds.api";

interface RoundsListContextState {
  rounds: Round[];
  isLoading: boolean;
  createNewRound: () => Promise<Round>;
}

const RoundsListContext = createContext<RoundsListContextState | null>(null);

export function useRoundsListContext() {
  const context = useContext(RoundsListContext);
  if (context == null) {
    throw new Error(
      "useRoundsListContext must be used within an RoundsListContext.Provider",
    );
  }
  return context;
}

export function RoundsListContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data: rounds, isLoading } = useQuery<Round[]>({
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
    <RoundsListContext.Provider
      value={{
        rounds: rounds || [],
        isLoading,
        createNewRound: createAsync,
      }}
    >
      {children}
    </RoundsListContext.Provider>
  );
}
