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
  Textarea,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  IconButton,
  useToast,

  Flex,
  Heading,

  Image,


} from '@chakra-ui/react'

import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'

import { CloseIcon, AddIcon } from '@chakra-ui/icons'

import { ROUTES } from '@/constants'
import { Journal, Weather, Feeling } from '@/types'
import { WEATHER_LABELS, FEELING_LABELS, APP_CONSTANTS } from '@/constants'
import api from '@/services/api'

const journalSchema = z.object({
  date: z.string().min(1, '날짜를 선택해주세요'),
  weather: z.nativeEnum(Weather).optional(),
  weatherComment: z.string().max(APP_CONSTANTS.MAX_WEATHER_COMMENT, '날씨 코멘트는 20자 이내로 입력해주세요'),
  feeling: z.nativeEnum(Feeling),
  feelingComment: z.string().max(APP_CONSTANTS.MAX_FEELING_COMMENT, '감정 코멘트는 30자 이내로 입력해주세요'),
  contents: z.string().max(APP_CONSTANTS.MAX_JOURNAL_CONTENTS, '일기 내용은 1000자 이내로 입력해주세요'),
  memo: z.string().max(APP_CONSTANTS.MAX_JOURNAL_MEMO, '메모는 100자 이내로 입력해주세요'),
  locked: z.boolean(),
})

type JournalFormData = z.infer<typeof journalSchema>

const JournalWritePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const queryClient = useQueryClient()

  

  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editingJournal = location.state?.journal as Journal | undefined

  const {
    control,
    handleSubmit,
    watch,

    formState: { errors, isDirty },
  } = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: editingJournal ? {
      date: editingJournal.date,
      weather: editingJournal.weather,
      weatherComment: editingJournal.weatherComment || '',
      feeling: editingJournal.feeling,
      feelingComment: editingJournal.feelingComment || '',
      contents: editingJournal.contents || '',
      memo: editingJournal.memo || '',
      locked: editingJournal.locked,
    } : {
      date: new Date().toISOString().split('T')[0],
      weather: undefined,
      weatherComment: '',
      feeling: 'NEUTRAL' as Feeling,
      feelingComment: '',
      contents: '',
      memo: '',
      locked: false,
    },
  })

  const watchedValues = watch()

  // Dropzone for image upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': APP_CONSTANTS.SUPPORTED_IMAGE_TYPES,
    },
    maxFiles: APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL,
    maxSize: APP_CONSTANTS.MAX_IMAGE_SIZE,
    onDrop: (acceptedFiles) => {
      setImages(prev => [...prev, ...acceptedFiles])
      
      // Create preview URLs
      acceptedFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewImages(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    },
  })

  // Save journal mutation
  const saveMutation = useMutation({
    mutationFn: (data: JournalFormData & { images: File[] }) => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append('images', file)
          })
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })
      
      if (editingJournal) {
        return api.put(`/journals/${editingJournal.id}`, formData)
      } else {
        return api.post('/journals', formData)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] })
      toast({
        title: editingJournal ? '일기가 수정되었습니다.' : '일기가 저장되었습니다.',
        status: 'success',
        duration: 3000,
      })
      navigate(ROUTES.JOURNAL)
    },
    onError: () => {
      toast({
        title: '일기 저장에 실패했습니다.',
        status: 'error',
        duration: 3000,
      })
    },
  })

  const onSubmit = async (data: JournalFormData) => {
    setIsSubmitting(true)
    try {
      await saveMutation.mutateAsync({ ...data, images })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('저장하지 않은 내용이 있습니다. 정말로 나가시겠습니까?')) {
        navigate(ROUTES.JOURNAL)
      }
    } else {
      navigate(ROUTES.JOURNAL)
    }
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">
            {editingJournal ? '일기 수정' : '새 일기 작성'}
          </Heading>
          <HStack spacing={3}>
            <Button onClick={handleCancel}>취소</Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              loadingText="저장 중..."
            >
              저장
            </Button>
          </HStack>
        </Flex>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {/* Date and Weather */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <HStack w="full" spacing={4}>
                    <FormControl isInvalid={!!errors.date}>
                      <FormLabel>날짜</FormLabel>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="date"
                            {...field}
                          />
                        )}
                      />
                      {errors.date && (
                        <Text color="red.500" fontSize="sm">{errors.date.message}</Text>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>날씨</FormLabel>
                      <Controller
                        name="weather"
                        control={control}
                        render={({ field }) => (
                          <Select
                            placeholder="날씨 선택"
                            {...field}
                            value={field.value || ''}
                          >
                            {Object.entries(WEATHER_LABELS).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </HStack>

                  {watchedValues.weather && (
                    <FormControl>
                      <FormLabel>날씨 코멘트</FormLabel>
                      <Controller
                        name="weatherComment"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="날씨에 대한 코멘트를 입력하세요"
                            {...field}
                          />
                        )}
                      />
                    </FormControl>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Feeling */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.feeling}>
                    <FormLabel>오늘의 감정</FormLabel>
                    <Controller
                      name="feeling"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          {Object.entries(FEELING_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.feeling && (
                      <Text color="red.500" fontSize="sm">{errors.feeling.message}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>감정 코멘트</FormLabel>
                    <Controller
                      name="feelingComment"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="감정에 대한 코멘트를 입력하세요"
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Contents */}
            <Card>
              <CardBody>
                <FormControl isInvalid={!!errors.contents}>
                  <FormLabel>일기 내용</FormLabel>
                  <Controller
                    name="contents"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="오늘 하루를 기록해보세요..."
                        rows={10}
                        {...field}
                      />
                    )}
                  />
                  {errors.contents && (
                    <Text color="red.500" fontSize="sm">{errors.contents.message}</Text>
                  )}
                </FormControl>
              </CardBody>
            </Card>

            {/* Images */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <FormLabel>사진 첨부</FormLabel>
                  
                  {/* Image Preview */}
                  {previewImages.length > 0 && (
                    <SimpleGrid columns={2} spacing={4} w="full">
                      {previewImages.map((preview, index) => (
                        <Box key={index} position="relative">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            borderRadius="md"
                            w="full"
                            h="200px"
                            objectFit="cover"
                          />
                          <IconButton
                            position="absolute"
                            top={2}
                            right={2}
                            size="sm"
                            aria-label="Remove image"
                            icon={<CloseIcon />}
                            colorScheme="red"
                            onClick={() => handleRemoveImage(index)}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  )}

                  {/* Dropzone */}
                  {previewImages.length < APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL && (
                    <Box
                      {...getRootProps()}
                      border="2px dashed"
                      borderColor={isDragActive ? "blue.400" : "gray.300"}
                      borderRadius="md"
                      p={6}
                      textAlign="center"
                      cursor="pointer"
                      _hover={{ borderColor: "blue.400" }}
                    >
                      <input {...getInputProps()} />
                      <AddIcon boxSize={6} mb={2} />
                      <Text>
                        {isDragActive
                          ? "파일을 여기에 놓으세요"
                          : "클릭하거나 파일을 드래그하여 이미지를 추가하세요"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        최대 {APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL}개, {APP_CONSTANTS.MAX_IMAGE_SIZE / (1024 * 1024)}MB 이하
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Memo and Settings */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>메모</FormLabel>
                    <Controller
                      name="memo"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="추가 메모를 입력하세요"
                          {...field}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>설정</FormLabel>
                    <Controller
                      name="locked"
                      control={control}
                      render={({ field }) => (
                        <HStack>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                          <Text>비공개로 설정</Text>
                        </HStack>
                      )}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </form>
      </VStack>
    </Box>
  )
}

export default JournalWritePage 