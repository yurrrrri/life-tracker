import { Category, getColor } from "@/server";
import { DeleteIcon, DragHandleIcon, EditIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

type CategoryGridProps = {
  categories: Category[];
  handleEdit?: (category: Category) => void;
  handleRemove: (id: string) => void;
  onDragEnd?: (reorderedCategories: Category[]) => void;
};

export const CategoryGrid = ({
  categories,
  handleEdit,
  handleRemove,
  onDragEnd,
}: CategoryGridProps) => {
  // *** STATE ***
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // *** SAFETY CHECK ***
  if (!Array.isArray(categories)) {
    return <div>카테고리를 불러오는 중...</div>;
  }

  // *** HANDLER ***
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!!draggedIndex && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (!!draggedIndex && draggedIndex !== dropIndex && onDragEnd) {
      const reorderedCategories = [...categories];
      const [draggedItem] = reorderedCategories.splice(draggedIndex, 1);
      reorderedCategories.splice(dropIndex, 0, draggedItem);

      const updatedCategories = reorderedCategories.map((category, index) => ({
        ...category,
        orderNo: index + 1,
      }));
      onDragEnd(updatedCategories);
    }

    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <VStack spacing={3} align="stretch">
      {!!categories && categories.length > 0 && (
        <>
          {categories.map((category, index) => (
            <Card
              key={category.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              bg={draggedIndex === index ? "gray.50" : "white"}
              shadow={draggedIndex === index ? "lg" : "md"}
              transform={draggedIndex === index ? "rotate(5deg)" : "none"}
              transition="all 0.2s"
              border={dragOverIndex === index ? "2px dashed" : "1px solid"}
              borderColor={dragOverIndex === index ? "blue.300" : "gray.200"}
              cursor="grab"
              _active={{ cursor: "grabbing" }}
            >
              <CardBody>
                <HStack justify="space-between">
                  <HStack>
                    <IconButton
                      size="sm"
                      aria-label="드래그"
                      icon={<DragHandleIcon />}
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: "gray.600" }}
                      cursor="grab"
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        backgroundColor: getColor(category.colorType),
                        borderRadius: "50%",
                        marginRight: 6,
                      }}
                    />
                    <Text>{category.name}</Text>
                  </HStack>
                  <HStack spacing={2}>
                    {handleEdit && (
                      <IconButton
                        size="sm"
                        aria-label="편집"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(category)}
                      />
                    )}
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
        </>
      )}
    </VStack>
  );
};
