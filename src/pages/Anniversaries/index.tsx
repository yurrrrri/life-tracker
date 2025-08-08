import { Loader } from "@/commons";
import { NotFoundText } from "@/commons/ui";
import { Anniversary, DateType, Weight } from "@/server";
import { AnniversaryFlow } from "@/server/api/flow/AnniversaryFlow";
import AnniversarySeek from "@/server/api/flow/AnniversarySeek";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const anniversarySchema = z.object({
  dateType: z.nativeEnum(DateType),
  date: z.string().min(1, "날짜를 선택해주세요"),
  name: z.string().min(1, "기념일명을 입력해주세요"),
  weight: z.nativeEnum(Weight),
});

export const Anniversaries = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // *** QUERY ***
  const { create, remove } = AnniversaryFlow;

  const findDailyAnniversaries = AnniversarySeek.query.findDailyAnniversaries();
  const { data: anniversariesData, isLoading } = useQuery(
    findDailyAnniversaries
  );

  React.useEffect(() => {
    if (anniversariesData) {
      setAnniversaries(anniversariesData);
    }
  }, [anniversariesData]);

  const form = useForm<z.infer<typeof anniversarySchema>>({
    resolver: zodResolver(anniversarySchema),
    defaultValues: {
      dateType: "SPECIAL" as keyof typeof DateType,
      date: "",
      name: "",
      weight: "THIRD" as keyof typeof Weight,
    },
  });
  const control = form.control;
  const errors = form.formState.errors;

  const handleSubmit = (data: z.infer<typeof anniversarySchema>) => {
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

  const handleEdit = (anniversary: Anniversary) => {
    form.reset({
      dateType: anniversary.dateType,
      date: anniversary.date,
      name: anniversary.name,
      weight: anniversary.weight || ("THIRD" as keyof typeof Weight),
    });
    onOpen();
  };

  const handleRemove = (anniversaryId: string) => {
    try {
      remove({ id: anniversaryId }).then((e) => {
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
    form.reset({
      dateType: "SPECIAL" as keyof typeof DateType,
      date: "",
      name: "",
      weight: "THIRD" as keyof typeof Weight,
    });
    onClose();
  };

  const getTypeLabel = (type: keyof typeof DateType) => {
    switch (type) {
      case "HOLIDAY":
        return "휴일";
      case "SPECIAL":
        return "특별한 날";
      default:
        return type;
    }
  };

  const getWeightLabel = (weight: keyof typeof Weight) => {
    switch (weight) {
      case "THIRD":
        return "낮음";
      case "SECOND":
        return "보통";
      case "FIRST":
        return "높음";
      default:
        return weight;
    }
  };

  const getWeightColor = (weight: keyof typeof Weight) => {
    switch (weight) {
      case "THIRD":
        return "gray";
      case "SECOND":
        return "blue";
      case "FIRST":
        return "red";
      default:
        return "gray";
    }
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const anniversaryDate = new Date(date);

    const thisYearAnniversary = new Date(
      today.getFullYear(),
      anniversaryDate.getMonth(),
      anniversaryDate.getDate()
    );

    if (thisYearAnniversary < today) {
      thisYearAnniversary.setFullYear(today.getFullYear() + 1);
    }

    const daysUntil = dayjs().diff(thisYearAnniversary, "date");
    return daysUntil;
  };

  if (isLoading) return <Loader />;

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md" fontFamily="nanum-gothic-bold">기념일 관리</Heading>
          <Button leftIcon={<AddIcon />} onClick={onOpen}>
            새 기념일 추가
          </Button>
        </Flex>

        {/* Anniversaries Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {anniversaries.map((anniversary) => {
            const daysUntil = getDaysUntil(anniversary.date);
            const isToday = daysUntil === 0;

            return (
              <Card key={anniversary.id}>
                <CardHeader>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="bold" fontSize="lg">
                        {anniversary.name}
                      </Text>
                      <HStack spacing={1}>
                        <IconButton
                          size="sm"
                          aria-label="편집"
                          icon={<EditIcon />}
                          onClick={() => handleEdit(anniversary)}
                        />
                        <IconButton
                          size="sm"
                          aria-label="삭제"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleRemove(anniversary.id)}
                        />
                      </HStack>
                    </HStack>

                    <HStack spacing={2}>
                      <Badge>{getTypeLabel(anniversary.dateType)}</Badge>
                      {anniversary.weight && (
                        <Badge colorScheme={getWeightColor(anniversary.weight)}>
                          {getWeightLabel(anniversary.weight)}
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </CardHeader>

                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                      {dayjs(new Date(anniversary.date)).format("MM월 dd일")}
                    </Text>

                    {isToday ? (
                      <Badge colorScheme="green" textAlign="center">
                        오늘!
                      </Badge>
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        {daysUntil > 0
                          ? `${daysUntil}일 남음`
                          : `${Math.abs(daysUntil)}일 지남`}
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>

        {anniversaries.length === 0 && (
          <NotFoundText text="기념일이 없습니다." />
        )}

        {/* Anniversary Form Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>새 기념일 추가</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>기념일명</FormLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input placeholder="기념일명을 입력하세요" {...field} />
                      )}
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm">
                        {errors.name.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.date}>
                    <FormLabel>날짜</FormLabel>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => <Input type="date" {...field} />}
                    />
                    {errors.date && (
                      <Text color="red.500" fontSize="sm">
                        {errors.date.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>유형</FormLabel>
                    <Controller
                      name="dateType"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          <option value="HOLIDAY">휴일</option>
                          <option value="SPECIAL">특별한 날</option>
                        </Select>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>중요도</FormLabel>
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          <option value="LOW">낮음</option>
                          <option value="MEDIUM">보통</option>
                          <option value="HIGH">높음</option>
                        </Select>
                      )}
                    />
                  </FormControl>

                  <HStack justify="flex-end" w="full" spacing={3}>
                    <Button variant="outline" onClick={handleCloseModal}>
                      취소
                    </Button>
                    <Button
                      type="submit"
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
  );
};

export default Anniversaries;
