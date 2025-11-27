import { useCallback, useEffect, useRef } from "react";
import type { User } from "../users/Users.api";

export interface Round {
  id: string;
  start: string;
  end: string;
  totalScore: number;
}

export interface Tap {
  roundId: string;
  userId: string;
  score: number;
  count: number;
}

export interface Winner {
  users: User[];
  score: Tap["score"];
}

// REST API

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
  const response = await fetch(`/api/v1/rounds/tap/${roundId}`, {
    method: "POST",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function myScore(roundId: string): Promise<Tap> {
  const response = await fetch(`/api/v1/rounds/myScore/${roundId}`, {
    method: "GET",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function winner(roundId: string): Promise<Winner> {
  const response = await fetch(`/api/v1/rounds/winner/${roundId}`, {
    method: "GET",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

// WebSocket

export function useRoundsWS(
  incomingMessageHandler: (message: RoundsIncomingMessage) => void,
) {
  const wsConn = useRef<WebSocket>(null);
  const messageQueue = useRef<RoundsOutgoingMessage[]>([]);

  const sendMessage = useCallback((message: RoundsOutgoingMessage) => {
    if (wsConn.current?.readyState === WebSocket.OPEN) {
      wsConn.current?.send(JSON.stringify(message));
    } else {
      messageQueue.current.push(message);
    }
  }, []);

  const handleIncomingMessage = useCallback(
    (message: RoundsIncomingMessage) => {
      incomingMessageHandler(message);
    },
    [incomingMessageHandler],
  );

  useEffect(() => {
    wsConn.current = new WebSocket("/websocket/rounds");

    wsConn.current.onopen = () => {
      if (messageQueue.current.length !== 0) {
        messageQueue.current.reverse().forEach((msg) => {
          wsConn.current?.send(JSON.stringify(msg));
        });
        messageQueue.current.length = 0;
      }
    };

    wsConn.current.onmessage = (event) => {
      handleIncomingMessage(JSON.parse(event.data));
    };

    return () => {
      if (wsConn.current?.readyState === WebSocket.OPEN) {
        wsConn.current?.close();
      }
    };
  }, [handleIncomingMessage]);

  return { sendMessage };
}

interface MakeTapMessage {
  type: "MakeTap";
  data: { roundId: string };
}

interface TapMessage {
  type: "Tap";
  data: Tap;
}

interface ErrorMessage {
  type: "Error";
  data: { message: string };
}

export type RoundsOutgoingMessage = MakeTapMessage;

export type RoundsIncomingMessage = TapMessage | ErrorMessage;
