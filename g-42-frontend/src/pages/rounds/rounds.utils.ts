import { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";
import type { Round } from "./Rounds.api";

export type RoundStatus = "Unknown" | "Cooldown" | "Active" | "Ended";

const STATUS_CHECK_INTERVAL = 1000; // one second

export function useRoundStatus(round: Round | undefined) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, STATUS_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  let status: RoundStatus = "Unknown";

  if (round !== undefined) {
    const start = new Date(round.start);
    const end = new Date(round.end);

    if (now <= start) {
      status = "Cooldown";
    } else if (now > start && now <= end) {
      status = "Active";
    } else if (now > end) {
      status = "Ended";
    }
  }

  return { status };
}

const ROUND_START_COUNTDOWN_INTERVAL = 1000; // one second

export function useCountdown(finish: Date) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, ROUND_START_COUNTDOWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const countdown = formatDistanceStrict(finish, now);

  return { countdown };
}
