import { Content, Heading, IllustratedMessage } from "@adobe/react-spectrum";

export function Loading() {
  return (
    <IllustratedMessage>
      <Heading>Please wait</Heading>
      <Content>Loading...</Content>
    </IllustratedMessage>
  );
}
