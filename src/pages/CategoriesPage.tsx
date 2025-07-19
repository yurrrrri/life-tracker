import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Card,

  CardHeader,
  IconButton,
  useToast,
  Spinner,
  Center,
  Flex,
  Heading,

  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons'

import { categoriesAtom } from '@/stores'
import { Category } from '@/types'
import { CATEGORY_COLORS, APP_CONSTANTS } from '@/constants'
import api from '@/services/api'

const categorySchema = z.object({
  name: z.string().min(1, '카테고리명을 입력해주세요').max(20, '카테고리명은 20자 이내로 입력해주세요'),
  color: z.string().min(1, '색상을 선택해주세요'),
})

type CategoryFormData = z.infer<typeof categorySchema>

const CategoriesPage: React.FC = () => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [categories, setCategories] = useAtom(categoriesAtom)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories'),
  })

  React.useEffect(() => {
    if (categoriesData?.data) {
      setCategories(categoriesData.data)
    }
  }, [categoriesData])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: CATEGORY_COLORS[0],
    },
  })

  // Create/Update category mutation
  const saveCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (editingCategory) {
        return api.put(`/categories/${editingCategory.id}`, data)
      } else {
        return api.post('/categories', data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: editingCategory ? '카테고리가 수정되었습니다.' : '카테고리가 생성되었습니다.',
        status: 'success',
        duration: 3000,
      })
      handleCloseModal()
    },
    onError: () => {
      toast({
        title: '카테고리 저장에 실패했습니다.',
        status: 'error',
        duration: 3000,
      })
    },
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: string) => api.delete(`/categories/${categoryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '카테고리가 삭제되었습니다.',
        status: 'success',
        duration: 3000,
      })
    },
  })

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      await saveCategoryMutation.mutateAsync(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    reset({
      name: category.name,
      color: category.color,
    })
    onOpen()
  }

  const handleDelete = (categoryId: string) => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      deleteCategoryMutation.mutate(categoryId)
    }
  }

  const handleCloseModal = () => {
    setEditingCategory(null)
    reset({
      name: '',
      color: CATEGORY_COLORS[0],
    })
    onClose()
  }

  const activeCategories = categories.filter(cat => !cat.removed)

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">카테고리 관리</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
            isDisabled={activeCategories.length >= APP_CONSTANTS.MAX_CATEGORIES}
          >
            새 카테고리 추가
          </Button>
        </Flex>

        {/* Categories Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {activeCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Box
                      w={4}
                      h={4}
                      borderRadius="full"
                      bg={category.color}
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

        {activeCategories.length === 0 && (
          <Center py={10}>
            <Text color="gray.500">카테고리가 없습니다.</Text>
          </Center>
        )}

        {/* Category Form Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                      <Text color="red.500" fontSize="sm">{errors.name.message}</Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.color}>
                    <FormLabel>색상</FormLabel>
                    <Controller
                      name="color"
                      control={control}
                      render={({ field }) => (
                        <SimpleGrid columns={5} spacing={2}>
                          {CATEGORY_COLORS.map((color) => (
                            <Box
                              key={color}
                              w={8}
                              h={8}
                              borderRadius="full"
                              bg={color}
                              cursor="pointer"
                              border={field.value === color ? '3px solid' : '1px solid'}
                              borderColor={field.value === color ? 'blue.500' : 'gray.300'}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </SimpleGrid>
                      )}
                    />
                    {errors.color && (
                      <Text color="red.500" fontSize="sm">{errors.color.message}</Text>
                    )}
                  </FormControl>

                  <HStack justify="flex-end" w="full" spacing={3}>
                    <Button onClick={handleCloseModal}>취소</Button>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={isSubmitting}
                      loadingText="저장 중..."
                    >
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
  )
}

export default CategoriesPage 