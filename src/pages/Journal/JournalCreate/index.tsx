import { Errors, useConfirm } from "@/commons/ui";
import { Feeling, Weather } from "@/server";
import { JournalFlow } from "@/server/api/flow/JournalFlow";
import { selectedDateAtom } from "@/utils/atoms";
import {
  APP_CONSTANTS,
  FEELING_NAME,
  WEATHER_NAME,
  WEATHER_ICONS,
  FEELING_ICONS,
} from "@/utils/constants";
import { format } from "@/utils/dates";
import { ROUTES } from "@/utils/routes";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
  Container,
  Divider,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const journalSchema = z.object({
  date: z.string().min(1, "날짜를 선택해주세요"),
  weatherComment: z.object({
    weather: z.nativeEnum(Weather),
    comment: z
      .string()
      .max(
        APP_CONSTANTS.MAX_WEATHER_COMMENT,
        "날씨 코멘트는 20자 이내로 입력해주세요"
      ),
  }),
  feelingComment: z.object({
    feeling: z.nativeEnum(Feeling),
    comment: z
      .string()
      .max(
        APP_CONSTANTS.MAX_FEELING_COMMENT,
        "감정 코멘트는 30자 이내로 입력해주세요"
      ),
  }),
  contents: z
    .string()
    .max(
      APP_CONSTANTS.MAX_JOURNAL_CONTENTS,
      "일기 내용은 1000자 이내로 입력해주세요"
    ),
  memo: z
    .string()
    .max(APP_CONSTANTS.MAX_JOURNAL_MEMO, "메모는 100자 이내로 입력해주세요"),
  saved: z.boolean(),
  locked: z.boolean(),
});

type JournalFormData = z.infer<typeof journalSchema>;

export const JournalCreate = () => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const toast = useToast();

  const selectedDate = useAtomValue(selectedDateAtom);
  const [_, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // *** FORM ***
  const form = useForm<JournalFormData>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      date: format(selectedDate || dayjs().startOf("d").toDate(), "YYYY-MM-DD"),
      weatherComment: {
        weather: "SUNNY",
        comment: "",
      },
      feelingComment: {
        feeling: "NEUTRAL",
        comment: "",
      },
      contents: "",
      memo: "",
      saved: false,
      locked: false,
    },
  });
  const control = form.control;
  const { errors, isDirty } = form.formState;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": APP_CONSTANTS.SUPPORTED_IMAGE_TYPES,
    },
    maxFiles: APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL,
    maxSize: APP_CONSTANTS.MAX_IMAGE_SIZE,
    onDrop: (acceptedFiles) => {
      setImages((prev) => [...prev, ...acceptedFiles]);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    },
  });

  // *** QUERY ***
  const { create } = JournalFlow;

  const handleSubmit = async (data: JournalFormData) => {
    setIsSubmitting(true);
    try {
      create(data)
        .then((e) => {
          if (e.status === 200) {
            toast({
              title: "일기가 저장되었습니다.",
              status: "success",
              duration: 3000,
            });
            navigate(ROUTES.JOURNAL);
          }
        })
        .catch(() => {
          toast({
            title: "일기 저장에 실패했습니다.",
            status: "error",
            duration: 3000,
          });
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    if (isDirty) {
      confirm({
        type: "warn",
        message: "저장하지 않은 내용이 있습니다. 정말로 나가시겠습니까?",
        onOk: () => navigate(ROUTES.JOURNAL),
      });
    } else {
      navigate(ROUTES.JOURNAL);
    }
  };

  return (
    <Box 
      bg="gray.50" 
      minH="100vh" 
      py={8}
    >
      <Container maxW="4xl" px={6}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Card 
            bg="white" 
            shadow="sm" 
            border="1px solid" 
            borderColor="gray.100"
            borderRadius="xl"
          >
            <CardBody p={8}>
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color="gray.800" fontWeight="600">
                    새 일기 작성
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    오늘의 하루를 기록해보세요
                  </Text>
                </VStack>
                <HStack spacing={4}>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    size="lg"
                    px={8}
                    borderRadius="lg"
                    borderColor="gray.200"
                    color="gray.600"
                    _hover={{
                      bg: "gray.50",
                      borderColor: "gray.300"
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={form.handleSubmit(handleSubmit)}
                    isLoading={isSubmitting}
                    loadingText="저장 중..."
                    size="lg"
                    px={8}
                    borderRadius="lg"
                    bg="blue.500"
                    color="white"
                    _hover={{
                      bg: "blue.600"
                    }}
                    _active={{
                      bg: "blue.700"
                    }}
                  >
                    저장
                  </Button>
                </HStack>
              </Flex>
            </CardBody>
          </Card>

          {/* Form */}
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <VStack spacing={6} align="stretch">
              {/* Date and Weather */}
              <Card 
                bg="white" 
                shadow="sm" 
                border="1px solid" 
                borderColor="gray.100"
                borderRadius="xl"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s"
                }}
              >
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <HStack w="full" spacing={6}>
                      <FormControl isInvalid={!!errors.date}>
                        <FormLabel fontWeight="600" color="gray.700" mb={3}>
                          날짜
                        </FormLabel>
                        <Controller
                          name="date"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              type="date" 
                              {...field}
                              borderRadius="lg"
                              borderColor="gray.200"
                              _focus={{
                                borderColor: "blue.400",
                                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                              }}
                            />
                          )}
                        />
                        <Errors name="date" errors={errors} />
                      </FormControl>

                      <FormControl isInvalid={!!errors.weatherComment?.weather}>
                        <FormLabel fontWeight="600" color="gray.700" mb={3}>
                          날씨
                        </FormLabel>
                        <Controller
                          name="weatherComment.weather"
                          control={control}
                          render={({ field }) => (
                            <Menu>
                              <MenuButton
                                as={Button}
                                variant="outline"
                                w="full"
                                textAlign="left"
                                justifyContent="flex-start"
                                borderRadius="lg"
                                borderColor="gray.200"
                                _hover={{
                                  borderColor: "blue.400"
                                }}
                                _focus={{
                                  borderColor: "blue.400",
                                  boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                                }}
                              >
                                {field.value ? (
                                  <HStack>
                                    {(() => {
                                      const WeatherIcon =
                                        WEATHER_ICONS[
                                          field.value as keyof typeof WEATHER_ICONS
                                        ];
                                      return WeatherIcon ? (
                                        <WeatherIcon size={24} />
                                      ) : null;
                                    })()}
                                    <Text fontWeight="500">
                                      {
                                        WEATHER_NAME[
                                          field.value as keyof typeof WEATHER_NAME
                                        ]
                                      }
                                    </Text>
                                  </HStack>
                                ) : (
                                  "날씨 선택"
                                )}
                              </MenuButton>
                              <MenuList borderRadius="lg" shadow="lg">
                                {Object.entries(WEATHER_NAME).map(
                                  ([key, label]) => {
                                    const WeatherIcon =
                                      WEATHER_ICONS[
                                        key as keyof typeof WEATHER_ICONS
                                      ];
                                    return (
                                      <MenuItem
                                        key={key}
                                        onClick={() => field.onChange(key)}
                                        icon={
                                          WeatherIcon ? (
                                            <WeatherIcon size={24} />
                                          ) : undefined
                                        }
                                        _hover={{
                                          bg: "blue.50"
                                        }}
                                      >
                                        {label}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </MenuList>
                            </Menu>
                          )}
                        />
                      </FormControl>
                    </HStack>

                    <FormControl isInvalid={!!errors.weatherComment?.comment}>
                      <FormLabel fontWeight="600" color="gray.700" mb={3}>
                        날씨 코멘트
                      </FormLabel>
                      <Controller
                        name="weatherComment.comment"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="날씨에 대한 코멘트를 입력하세요"
                            {...field}
                            borderRadius="lg"
                            borderColor="gray.200"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Feeling */}
              <Card 
                bg="white" 
                shadow="sm" 
                border="1px solid" 
                borderColor="gray.100"
                borderRadius="xl"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s"
                }}
              >
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={!!errors.feelingComment?.feeling}>
                      <FormLabel fontWeight="600" color="gray.700" mb={3}>
                        오늘의 감정
                      </FormLabel>
                      <Controller
                        name="feelingComment.feeling"
                        control={control}
                        render={({ field }) => (
                          <Menu>
                            <MenuButton
                              as={Button}
                              variant="outline"
                              w="full"
                              textAlign="left"
                              justifyContent="flex-start"
                              borderRadius="lg"
                              borderColor="gray.200"
                              _hover={{
                                borderColor: "blue.400"
                              }}
                              _focus={{
                                borderColor: "blue.400",
                                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                              }}
                            >
                              {field.value ? (
                                <HStack>
                                  {(() => {
                                    const FeelingIcon =
                                      FEELING_ICONS[
                                        field.value as keyof typeof FEELING_ICONS
                                      ];
                                    return FeelingIcon ? (
                                      <FeelingIcon size={20} />
                                    ) : null;
                                  })()}
                                  <Text fontWeight="500">
                                    {
                                      FEELING_NAME[
                                        field.value as keyof typeof FEELING_NAME
                                      ]
                                    }
                                  </Text>
                                </HStack>
                              ) : (
                                "감정 선택"
                              )}
                            </MenuButton>
                            <MenuList borderRadius="lg" shadow="lg">
                              {Object.entries(FEELING_NAME).map(
                                ([key, label]) => {
                                  const FeelingIcon =
                                    FEELING_ICONS[
                                      key as keyof typeof FEELING_ICONS
                                    ];
                                  return (
                                    <MenuItem
                                      key={key}
                                      onClick={() => field.onChange(key)}
                                      icon={
                                        FeelingIcon ? (
                                          <FeelingIcon size={20} />
                                        ) : undefined
                                      }
                                      _hover={{
                                        bg: "blue.50"
                                      }}
                                    >
                                      {label}
                                    </MenuItem>
                                  );
                                }
                              )}
                            </MenuList>
                          </Menu>
                        )}
                      />
                      <Errors name="feelingComment.feeling" errors={errors} />
                    </FormControl>

                    <FormControl isInvalid={!!errors.feelingComment?.comment}>
                      <FormLabel fontWeight="600" color="gray.700" mb={3}>
                        감정 코멘트
                      </FormLabel>
                      <Controller
                        name="feelingComment.comment"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="감정에 대한 코멘트를 입력하세요"
                            {...field}
                            borderRadius="lg"
                            borderColor="gray.200"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Contents */}
              <Card 
                bg="white" 
                shadow="sm" 
                border="1px solid" 
                borderColor="gray.100"
                borderRadius="xl"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s"
                }}
              >
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={!!errors.contents}>
                      <FormLabel fontWeight="600" color="gray.700" mb={3}>
                        일기 내용
                      </FormLabel>
                      <Controller
                        name="contents"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            placeholder="오늘 하루를 기록해보세요..."
                            rows={12}
                            {...field}
                            borderRadius="lg"
                            borderColor="gray.200"
                            resize="vertical"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                            }}
                          />
                        )}
                      />
                      <Errors name="contents" errors={errors} />
                    </FormControl>

                    <Divider />

                    <VStack spacing={4} align="start" w="full">
                      <FormControl>
                        <Controller
                          name="saved"
                          control={control}
                          render={({ field }) => (
                            <HStack spacing={3}>
                              <Switch
                                checked={field.value}
                                onChange={field.onChange}
                                colorScheme="blue"
                                size="lg"
                              />
                              <Text fontWeight="500" color="gray.700">
                                임시 저장
                              </Text>
                            </HStack>
                          )}
                        />
                      </FormControl>

                      <FormControl>
                        <Controller
                          name="locked"
                          control={control}
                          render={({ field }) => (
                            <HStack spacing={3}>
                              <Switch
                                checked={field.value}
                                onChange={field.onChange}
                                colorScheme="blue"
                                size="lg"
                              />
                              <Text fontWeight="500" color="gray.700">
                                비공개로 설정
                              </Text>
                            </HStack>
                          )}
                        />
                      </FormControl>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Images */}
              <Card 
                bg="white" 
                shadow="sm" 
                border="1px solid" 
                borderColor="gray.100"
                borderRadius="xl"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s"
                }}
              >
                <CardBody p={8}>
                  <VStack spacing={6}>
                    <FormLabel fontWeight="600" color="gray.700" mb={3}>
                      사진 첨부
                    </FormLabel>

                    {/* Image Preview */}
                    {previewImages.length > 0 && (
                      <SimpleGrid columns={[1, 2]} spacing={4} w="full">
                        {previewImages.map((preview, index) => (
                          <Box key={index} position="relative" borderRadius="xl" overflow="hidden">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              w="full"
                              h="240px"
                              objectFit="cover"
                            />
                            <IconButton
                              position="absolute"
                              top={3}
                              right={3}
                              size="sm"
                              aria-label="Remove image"
                              icon={<CloseIcon />}
                              colorScheme="red"
                              borderRadius="full"
                              onClick={() => handleRemoveImage(index)}
                              _hover={{
                                transform: "scale(1.1)"
                              }}
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}

                    {/* Dropzone */}
                    {previewImages.length <
                      APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL && (
                      <Box
                        {...getRootProps()}
                        border="2px dashed"
                        borderColor={isDragActive ? "blue.400" : "gray.300"}
                        borderRadius="xl"
                        p={12}
                        textAlign="center"
                        cursor="pointer"
                        bg={isDragActive ? "blue.50" : "gray.50"}
                        _hover={{ 
                          borderColor: "blue.400",
                          bg: "blue.50",
                          transform: "scale(1.02)",
                          transition: "all 0.2s"
                        }}
                      >
                        <input {...getInputProps()} />
                        <AddIcon boxSize={8} mb={4} color="blue.500" />
                        <Text fontWeight="600" color="gray.700" mb={2}>
                          {isDragActive
                            ? "파일을 여기에 놓으세요"
                            : "클릭하거나 파일을 드래그하여 이미지를 추가하세요"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          최대 {APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL}개,{" "}
                          {APP_CONSTANTS.MAX_IMAGE_SIZE / (1024 * 1024)}MB 이하
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Memo and Settings */}
              <Card 
                bg="white" 
                shadow="sm" 
                border="1px solid" 
                borderColor="gray.100"
                borderRadius="xl"
                _hover={{
                  shadow: "md",
                  transform: "translateY(-1px)",
                  transition: "all 0.2s"
                }}
              >
                <CardBody p={8}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="600" color="gray.700" mb={3}>
                        메모
                      </FormLabel>
                      <Controller
                        name="memo"
                        control={control}
                        render={({ field }) => (
                          <Input
                            placeholder="메모할 내용을 적어 보세요."
                            {...field}
                            borderRadius="lg"
                            borderColor="gray.200"
                            _focus={{
                              borderColor: "blue.400",
                              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default JournalCreate;
