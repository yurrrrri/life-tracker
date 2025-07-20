import { Loader } from "@/commons";
import {
  Anniversary,
  AnniversaryType,
  AnniversaryWeight,
} from "@/constants/types";
import api from "@/services/api";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
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
  useToast
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const anniversarySchema = z.object({
  type: z.nativeEnum(AnniversaryType),
  date: z.string().min(1, "날짜를 선택해주세요"),
  name: z.string().min(1, "기념일명을 입력해주세요"),
  weight: z.nativeEnum(AnniversaryWeight).optional(),
});

type AnniversaryFormData = z.infer<typeof anniversarySchema>;

export const Anniversaries = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [editingAnniversary, setEditingAnniversary] =
    useState<Anniversary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch anniversaries
  const { data: anniversariesData, isLoading } = useQuery({
    queryKey: ["anniversaries"],
    queryFn: () => api.get("/anniversaries"),
  });

  React.useEffect(() => {
    if (anniversariesData?.data) {
      setAnniversaries(anniversariesData.data);
    }
  }, [anniversariesData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnniversaryFormData>({
    resolver: zodResolver(anniversarySchema),
    defaultValues: {
      type: "SPECIAL" as AnniversaryType,
      date: "",
      name: "",
      weight: "MEDIUM" as AnniversaryWeight,
    },
  });

  // Create/Update anniversary mutation
  const saveAnniversaryMutation = useMutation({
    mutationFn: (data: AnniversaryFormData) => {
      if (editingAnniversary) {
        return api.put(`/anniversaries/${editingAnniversary.id}`, data);
      } else {
        return api.post("/anniversaries", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anniversaries"] });
      toast({
        title: editingAnniversary
          ? "기념일이 수정되었습니다."
          : "기념일이 추가되었습니다.",
        status: "success",
        duration: 3000,
      });
      handleCloseModal();
    },
    onError: () => {
      toast({
        title: "기념일 저장에 실패했습니다.",
        status: "error",
        duration: 3000,
      });
    },
  });

  // Delete anniversary mutation
  const deleteAnniversaryMutation = useMutation({
    mutationFn: (anniversaryId: string) =>
      api.delete(`/anniversaries/${anniversaryId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anniversaries"] });
      toast({
        title: "기념일이 삭제되었습니다.",
        status: "success",
        duration: 3000,
      });
    },
  });

  const onSubmit = async (data: AnniversaryFormData) => {
    setIsSubmitting(true);
    try {
      await saveAnniversaryMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (anniversary: Anniversary) => {
    setEditingAnniversary(anniversary);
    reset({
      type: anniversary.type,
      date: anniversary.date,
      name: anniversary.name,
      weight: anniversary.weight || ("MEDIUM" as AnniversaryWeight),
    });
    onOpen();
  };

  const handleDelete = (anniversaryId: string) => {
    if (window.confirm("정말로 이 기념일을 삭제하시겠습니까?")) {
      deleteAnniversaryMutation.mutate(anniversaryId);
    }
  };

  const handleCloseModal = () => {
    setEditingAnniversary(null);
    reset({
      type: "SPECIAL" as AnniversaryType,
      date: "",
      name: "",
      weight: "MEDIUM" as AnniversaryWeight,
    });
    onClose();
  };

  const getTypeLabel = (type: AnniversaryType) => {
    switch (type) {
      case "HOLIDAY":
        return "휴일";
      case "SPECIAL":
        return "특별한 날";
      default:
        return type;
    }
  };

  const getWeightLabel = (weight: AnniversaryWeight) => {
    switch (weight) {
      case "LOW":
        return "낮음";
      case "MEDIUM":
        return "보통";
      case "HIGH":
        return "높음";
      default:
        return weight;
    }
  };

  const getWeightColor = (weight: AnniversaryWeight) => {
    switch (weight) {
      case "LOW":
        return "gray";
      case "MEDIUM":
        return "blue";
      case "HIGH":
        return "red";
      default:
        return "gray";
    }
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const anniversaryDate = new Date(date);

    // Set this year's anniversary date
    const thisYearAnniversary = new Date(
      today.getFullYear(),
      anniversaryDate.getMonth(),
      anniversaryDate.getDate()
    );

    // If this year's anniversary has passed, calculate for next year
    if (thisYearAnniversary < today) {
      thisYearAnniversary.setFullYear(today.getFullYear() + 1);
    }

    const daysUntil = dayjs().diff(thisYearAnniversary, "date");
    return daysUntil;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md">기념일 관리</Heading>
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
                          onClick={() => handleDelete(anniversary.id)}
                        />
                      </HStack>
                    </HStack>

                    <HStack spacing={2}>
                      <Badge>{getTypeLabel(anniversary.type)}</Badge>
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
          <Center py={10}>
            <Text color="gray.500">기념일이 없습니다.</Text>
          </Center>
        )}

        {/* Anniversary Form Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingAnniversary ? "기념일 수정" : "새 기념일 추가"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                      name="type"
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
