import { Category, getColor } from "@/server";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

type CategoryGridProps = {
  categories: Category[];
  handleEdit: (category: Category) => void;
  handleRemove: (id: string) => void;
};

export const CategoryGrid = ({
  categories,
  handleEdit,
  handleRemove,
}: CategoryGridProps) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 4, lg: 4 }} spacing={6}>
      {categories.map((category) => (
        <Card key={category.id}>
          <CardBody>
            <HStack justify="space-between">
              <HStack>
                <Box borderRadius="full" bg={category.colorType} />
                <div
                  style={{
                    width: 26,
                    height: 26,
                    backgroundColor: getColor(category.colorType),
                    borderRadius: "50%",
                    marginRight: 6,
                  }}
                />
                <Text fontWeight="bold">{category.name}</Text>
              </HStack>
              <HStack spacing={1}>
                <IconButton
                  size="sm"
                  aria-label="편집"
                  icon={<EditIcon />}
                  onClick={() => handleEdit(category)}
                />
                <IconButton
                  size="sm"
                  aria-label="삭제"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleRemove(category.id)}
                />
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};
