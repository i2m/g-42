import { Button } from "@adobe/react-spectrum";
import type { PressEvent } from "@react-types/shared";

export function Goose({
  isDisabled: isDisabled = false,
  onPress,
}: {
  isDisabled?: boolean;
  onPress?: ((e: PressEvent) => void) | undefined;
}) {
  return (
    <Button variant="accent" isDisabled={isDisabled} onPress={onPress}>
      <pre style={{ textAlign: "start" }}>{goose}</pre>
    </Button>
  );
}

const goose = `
        ░░░░░░░░░░
      ░░▓▓▓▓▓▓▓▓▓▓░░
    ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
    ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░
  ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░
░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░
░░▒▒▒▒▒▒▒▒░░░░░░░░▒▒▒▒▒▒▒▒░░
░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
  ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░
    ░░░░░░░░░░░░░░░░░░░░░░

`;
