import { ROUTES } from "@/constants";
import api from "@/services/api";
import { Todo, TodoStatus } from "@/types";
import { formatDateTime } from "@/utils";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

const TodoViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: todo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => api.get(`/todos/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Center w="1200px" h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !todo?.data) {
    return (
      <Center w="1200px" h="50vh">
        <Text>할일을 찾을 수 없습니다.</Text>
      </Center>
    );
  }

  const todoData: Todo = todo.data;

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case "NOT_STARTED":
        return "gray";
      case "JUST_STARTED":
        return "blue";
      case "IN_PROGRESS":
        return "yellow";
      case "PENDING":
        return "orange";
      case "ONEDAY":
        return "purple";
      case "DONE":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case "NOT_STARTED":
        return "시작 전";
      case "JUST_STARTED":
        return "시작함";
      case "IN_PROGRESS":
        return "진행 중";
      case "PENDING":
        return "보류";
      case "ONEDAY":
        return "언젠가";
      case "DONE":
        return "완료";
      default:
        return status;
    }
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate(ROUTES.TODO)}
            >
              목록으로
            </Button>
            <Heading size="md">할일 상세</Heading>
          </HStack>
          <Button
            leftIcon={<EditIcon />}
            onClick={() =>
              navigate(ROUTES.TODO_WRITE, { state: { todo: todoData } })
            }
          >
            수정
          </Button>
        </Flex>

        {/* Todo Content */}
        <Card>
          <CardHeader>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="xl">
                  {todoData.contents}
                </Text>
                <Badge colorScheme={getStatusColor(todoData.status)} size="lg">
                  {getStatusLabel(todoData.status)}
                </Badge>
              </HStack>
            </VStack>
          </CardHeader>

          <CardBody>
            <VStack align="stretch" spacing={6}>
              {/* Date and Time */}
              <Box>
                <Text fontWeight="bold" mb={3}>
                  일정
                </Text>
                <VStack align="stretch" spacing={2}>
                  <Text>
                    시작: {formatDateTime(new Date(todoData.startDateTime))}
                  </Text>
                  {todoData.isPeriod && (
                    <Text>
                      종료: {formatDateTime(new Date(todoData.endDateTime))}
                    </Text>
                  )}
                </VStack>
              </Box>

              {/* Memo */}
              {todoData.memo && (
                <Box>
                  <Text fontWeight="bold" mb={3}>
                    메모
                  </Text>
                  <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                    {todoData.memo}
                  </Text>
                </Box>
              )}

              <Divider />

              {/* Metadata */}
              <HStack justify="space-between" fontSize="sm" color="gray.500">
                <Text>
                  작성일: {formatDateTime(new Date(todoData.registeredOn))}
                </Text>
                {todoData.registeredOn !== todoData.registeredOn && (
                  <Text>
                    수정일: {formatDateTime(new Date(todoData.registeredOn))}
                  </Text>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default TodoViewPage;
