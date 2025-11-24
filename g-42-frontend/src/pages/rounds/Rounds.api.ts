import type { User } from "../users/users.api";

export interface Round {
  id: string;
  start: string;
  end: string;
  totalScore: number;
}

export interface Tap {
  RoundId: string;
  UserId: string;
  score: number;
  count: number;
}

export async function getRounds(): Promise<Round[]> {
  const response = await fetch("/api/v1/rounds/list", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function findRoundById(roundId: string): Promise<Round> {
  const response = await fetch(`/api/v1/rounds/find/${roundId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function createRound(): Promise<Round> {
  const response = await fetch("/api/v1/rounds/create", { method: "POST" });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function tap(roundId: string): Promise<Tap> {
  const response = await fetch(`/api/v1/taps/tap/${roundId}`, {
    method: "POST",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function myScore(roundId: string): Promise<Tap> {
  const response = await fetch(`/api/v1/taps/myScore/${roundId}`, {
    method: "GET",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function winner(roundId: string): Promise<User> {
  const response = await fetch(`/api/v1/taps/winner/${roundId}`, {
    method: "GET",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}
