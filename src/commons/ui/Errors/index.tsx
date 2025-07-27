import { Text } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

interface ErrorsProps {
  name: string;
  errors: Record<string, any>;
}

export const Errors = ({ name, errors }: ErrorsProps) => {
  const getNestedError = (obj: any, path: string): FieldError | undefined => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  const error = getNestedError(errors, name);

  if (!error) return null;

  return (
    <Text color="red.500" fontSize="sm">
      {error.message}
    </Text>
  );
};
