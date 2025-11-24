import type { Round } from "./Rounds.api";

export type RoundStatus = "Unknown" | "Cooldown" | "Active" | "Ended";

export function roundStatus(round: Round): RoundStatus {
  const startDate = new Date(round.start);
  const endDate = new Date(round.end);
  const nowDate = new Date();

  let status: RoundStatus = "Unknown";
  if (nowDate <= startDate) {
    status = "Cooldown";
  } else if (nowDate > startDate && nowDate <= endDate) {
    status = "Active";
  } else if (nowDate > endDate) {
    status = "Ended";
  }
  return status;
}
