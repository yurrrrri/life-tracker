import { Center, Text } from "@chakra-ui/react";

export const NotFoundText = ({ text }: { text: string }) => {
  return (
    <Center w="1200px" h="50vh">
      <Text>{text}</Text>
    </Center>
  );
};
