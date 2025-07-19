import { APP_CONSTANTS, ROUTES } from "@/constants";
import api from "@/services/api";
import { categoriesAtom } from "@/stores";
import { Todo, TodoStatus } from "@/types";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const todoSchema = z.object({
  categoryId: z.string().min(1, "카테고리를 선택해주세요"),
  contents: z
    .string()
    .min(1, "할일 내용을 입력해주세요")
    .max(
      APP_CONSTANTS.MAX_TODO_CONTENTS,
      "할일 내용은 30자 이내로 입력해주세요"
    ),
  memo: z
    .string()
    .max(APP_CONSTANTS.MAX_TODO_MEMO, "메모는 50자 이내로 입력해주세요"),
  isPeriod: z.boolean(),
  startDateTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endDateTime: z.string().min(1, "종료 시간을 입력해주세요"),
  status: z.nativeEnum(TodoStatus),
});

type TodoFormData = z.infer<typeof todoSchema>;

const TodoWritePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [categories] = useAtom(categoriesAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingTodo = location.state?.todo as Todo | undefined;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: editingTodo
      ? {
          categoryId: editingTodo.categoryId,
          contents: editingTodo.contents,
          memo: editingTodo.memo || "",
          isPeriod: editingTodo.isPeriod,
          startDateTime: editingTodo.startDateTime,
          endDateTime: editingTodo.endDateTime,
          status: editingTodo.status,
        }
      : {
          categoryId: "",
          contents: "",
          memo: "",
          isPeriod: false,
          startDateTime: new Date().toISOString().slice(0, 16),
          endDateTime: new Date().toISOString().slice(0, 16),
          status: "NOT_STARTED" as TodoStatus,
        },
  });

  const watchedValues = watch();

  // Save todo mutation
  const saveMutation = useMutation({
    mutationFn: (data: TodoFormData) => {
      if (editingTodo) {
        return api.put(`/todos/${editingTodo.id}`, data);
      } else {
        return api.post("/todos", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: editingTodo
          ? "할일이 수정되었습니다."
          : "할일이 저장되었습니다.",
        status: "success",
        duration: 3000,
      });
      navigate(ROUTES.TODO);
    },
    onError: () => {
      toast({
        title: "할일 저장에 실패했습니다.",
        status: "error",
        duration: 3000,
      });
    },
  });

  const onSubmit = async (data: TodoFormData) => {
    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        window.confirm("저장하지 않은 내용이 있습니다. 정말로 나가시겠습니까?")
      ) {
        navigate(ROUTES.TODO);
      }
    } else {
      navigate(ROUTES.TODO);
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">
            {editingTodo ? "할일 수정" : "새 할일 추가"}
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
            {/* Category and Contents */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.categoryId}>
                    <FormLabel>카테고리</FormLabel>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select placeholder="카테고리 선택" {...field}>
                          {categories
                            .filter((cat) => !cat.removed)
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </Select>
                      )}
                    />
                    {errors.categoryId && (
                      <Text color="red.500" fontSize="sm">
                        {errors.categoryId.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.contents}>
                    <FormLabel>할일 내용</FormLabel>
                    <Controller
                      name="contents"
                      control={control}
                      render={({ field }) => (
                        <Input
                          placeholder="할일 내용을 입력하세요"
                          {...field}
                        />
                      )}
                    />
                    {errors.contents && (
                      <Text color="red.500" fontSize="sm">
                        {errors.contents.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>메모</FormLabel>
                    <Controller
                      name="memo"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          placeholder="추가 메모를 입력하세요"
                          rows={3}
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Date and Time */}
            <Card>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>기간 설정</FormLabel>
                    <Controller
                      name="isPeriod"
                      control={control}
                      render={({ field }) => (
                        <HStack>
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                          <Text>시작과 종료 시간을 설정합니다</Text>
                        </HStack>
                      )}
                    />
                  </FormControl>

                  <HStack w="full" spacing={4}>
                    <FormControl isInvalid={!!errors.startDateTime}>
                      <FormLabel>시작 시간</FormLabel>
                      <Controller
                        name="startDateTime"
                        control={control}
                        render={({ field }) => (
                          <Input type="datetime-local" {...field} />
                        )}
                      />
                      {errors.startDateTime && (
                        <Text color="red.500" fontSize="sm">
                          {errors.startDateTime.message}
                        </Text>
                      )}
                    </FormControl>

                    {watchedValues.isPeriod && (
                      <FormControl isInvalid={!!errors.endDateTime}>
                        <FormLabel>종료 시간</FormLabel>
                        <Controller
                          name="endDateTime"
                          control={control}
                          render={({ field }) => (
                            <Input type="datetime-local" {...field} />
                          )}
                        />
                        {errors.endDateTime && (
                          <Text color="red.500" fontSize="sm">
                            {errors.endDateTime.message}
                          </Text>
                        )}
                      </FormControl>
                    )}
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Status */}
            <Card>
              <CardBody>
                <FormControl>
                  <FormLabel>상태</FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="NOT_STARTED">시작 전</option>
                        <option value="JUST_STARTED">시작함</option>
                        <option value="IN_PROGRESS">진행 중</option>
                        <option value="PENDING">보류</option>
                        <option value="ONEDAY">언젠가</option>
                        <option value="DONE">완료</option>
                      </Select>
                    )}
                  />
                </FormControl>
              </CardBody>
            </Card>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default TodoWritePage;
