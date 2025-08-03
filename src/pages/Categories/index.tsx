import { COLOR_NAMES } from "@/utils/constants";
import { Loader } from "@/commons";
import { NotFoundText } from "@/commons/ui";
import { Category, getColor } from "@/server";
import { APP_CONSTANTS } from "@/utils/constants";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { CategoryGrid } from "./CategoryGrid";
import { useCategories } from "./useCategories";

export const Categories = () => {
  // *** STATE ***
  const [categories, setCategories] = useState<Category[]>([]);

  // *** HOOKS ***
  const {
    form,
    isOpen,
    isEditOpen,
    onOpen,
    isLoading,
    handleSubmit,
    handleEdit,
    handleEditSubmit,
    handleEditClose,
    handleRemove,
    handleClose,
    handleDragEnd,
  } = useCategories(setCategories);

  // *** FORM ***
  const control = form.control;
  const errors = form.formState.errors;

  // *** RENDER ***
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

        {/* Categories */}
        {categories.length === 0 ? (
          <NotFoundText text="카테고리가 없습니다." />
        ) : (
          <CategoryGrid
            categories={categories}
            handleEdit={handleEdit}
            handleRemove={handleRemove}
            onDragEnd={handleDragEnd}
          />
        )}

        {/* Category Create Form Modal */}
        <Modal isOpen={isOpen} onClose={handleClose}>
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

                  <HStack justify="flex-end" w="full" spacing={2}>
                    <Button type="submit">저장</Button>
                    <Button variant="outline" onClick={handleClose}>
                      닫기
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Category Edit Form Modal */}
        <Modal isOpen={isEditOpen} onClose={handleEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>카테고리 수정</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)}>
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

                  <HStack justify="flex-end" w="full" spacing={2}>
                    <Button type="submit">저장</Button>
                    <Button variant="outline" onClick={handleEditClose}>
                      닫기
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
