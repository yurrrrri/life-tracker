import { Loader } from "@/commons";
import { NotFoundText } from "@/commons/ui";
import { Category, ColorType, getColor } from "@/server";
import { CategoryFlow } from "@/server/api/flow/CategoryFlow";
import CategorySeek from "@/server/api/flow/CategorySeek";
import { APP_CONSTANTS, COLOR_NAMES } from "@/utils/constants";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "카테고리명을 입력해주세요")
    .max(20, "카테고리명은 20자 이내로 입력해주세요"),
  colorType: z.nativeEnum(ColorType),
  orderNo: z.number().default(1),
});

export const Categories = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      colorType: ColorType.PASTEL_PINK,
    },
  });
  const control = form.control;
  const errors = form.formState.errors;

  // *** QUERY ***
  const { create, remove } = CategoryFlow;

  const findCategories = CategorySeek.query.findCategories();
  const { data: categoryData, isLoading } = useQuery(findCategories);
  const categories = useMemo(() => categoryData || [], [categoryData]);

  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    setIsSubmitting(true);
    try {
      create(data).then((e) => {
        if (e.status === 200) {
          toast({
            status: "success",
            description: "저장되었습니다.",
            isClosable: true,
          });
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    form.reset({
      name: category.name,
      colorType: category.colorType,
    });
    onOpen();
  };

  const handleDelete = (categoryId: string) => {
    try {
      remove({ id: categoryId }).then((e) => {
        if (e.status === 200) {
          toast({
            status: "success",
            description: "저장되었습니다.",
            isClosable: true,
          });
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    form.reset();
    onClose();
  };

  if (isLoading) return <Loader />;

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md">카테고리 관리</Heading>
          <Button
            leftIcon={<AddIcon />}
            onClick={onOpen}
            isDisabled={categories.length >= APP_CONSTANTS.MAX_CATEGORIES}
          >
            새 카테고리 추가
          </Button>
        </Flex>

        {/* Categories Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Box
                      w={4}
                      h={4}
                      borderRadius="full"
                      bg={category.colorType}
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
                      onClick={() => handleDelete(category.id)}
                    />
                  </HStack>
                </HStack>
              </CardHeader>
            </Card>
          ))}
        </SimpleGrid>

        {categories.length === 0 && (
          <NotFoundText text="카테고리가 없습니다." />
        )}

        {/* Category Form Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>새 카테고리 추가</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>카테고리명</FormLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="카테고리명을 입력하세요"
                          {...field}
                        />
                      )}
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm">
                        {errors.name.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.colorType}>
                    <FormLabel>색상</FormLabel>
                    <Controller
                      name="colorType"
                      control={control}
                      render={({ field }) => (
                        <SimpleGrid columns={5} spacing={2} ml={10}>
                          {COLOR_NAMES.map((color) => (
                            <Box
                              key={color}
                              w={8}
                              h={8}
                              borderRadius="full"
                              bg={getColor(color)}
                              cursor="pointer"
                              border={
                                field.value === color
                                  ? "3px solid"
                                  : "1px solid"
                              }
                              borderColor={
                                field.value === color ? "brand.500" : "gray.300"
                              }
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </SimpleGrid>
                      )}
                    />
                    {errors.colorType && (
                      <Text color="red.500" fontSize="sm">
                        {errors.colorType.message}
                      </Text>
                    )}
                  </FormControl>

                  <HStack justify="flex-end" w="full" spacing={3}>
                    <Button variant="outline" onClick={handleCloseModal}>
                      취소
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                      저장
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Categories;
