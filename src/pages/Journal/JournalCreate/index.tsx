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
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md">새 일기 작성</Heading>
          <HStack spacing={3}>
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              isLoading={isSubmitting}
              loadingText="저장 중..."
            >
              저장
            </Button>
          </HStack>
        </Flex>

        {/* Form */}
        <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                        render={({ field }) => <Input type="date" {...field} />}
                      />
                      <Errors name="date" errors={errors} />
                    </FormControl>

                    <FormControl isInvalid={!!errors.weatherComment?.weather}>
                      <FormLabel>날씨</FormLabel>
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
                            >
                              {field.value ? (
                                <HStack>
                                  {(() => {
                                    const WeatherIcon =
                                      WEATHER_ICONS[
                                        field.value as keyof typeof WEATHER_ICONS
                                      ];
                                    return WeatherIcon ? (
                                      <WeatherIcon size={26} />
                                    ) : null;
                                  })()}
                                  <Text>
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
                            <MenuList>
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
                                          <WeatherIcon size={26} />
                                        ) : undefined
                                      }
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
                    <FormLabel>날씨 코멘트</FormLabel>
                    <Controller
                      name="weatherComment.comment"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="날씨에 대한 코멘트를 입력하세요"
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Feeling */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.feelingComment?.feeling}>
                    <FormLabel>오늘의 감정</FormLabel>
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
                                <Text>
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
                          <MenuList>
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
                    <FormLabel>감정 코멘트</FormLabel>
                    <Controller
                      name="feelingComment.comment"
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
                <VStack>
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
                    <Errors name="contents" errors={errors} />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="saved"
                      control={control}
                      render={({ field }) => (
                        <HStack>
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                          <Text>임시 저장</Text>
                        </HStack>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="locked"
                      control={control}
                      render={({ field }) => (
                        <HStack>
                          <Switch
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
                  {previewImages.length <
                    APP_CONSTANTS.MAX_IMAGES_PER_JOURNAL && (
                    <Box
                      {...getRootProps()}
                      border="2px dashed"
                      borderColor={isDragActive ? "purple.400" : "gray.300"}
                      borderRadius="md"
                      p={6}
                      textAlign="center"
                      cursor="pointer"
                      _hover={{ borderColor: "purple.400" }}
                    >
                      <input {...getInputProps()} />
                      <AddIcon boxSize={6} mb={2} />
                      <Text>
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
                          placeholder="메모할 내용을 적어 보세요."
                          {...field}
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
    </Box>
  );
};

export default JournalCreate;
