import { Loader } from "@/commons";
import { getStatusColor, getStatusName, Todo } from "@/server";
// import TodoSeek from "@/server/api/flow/TodoSeek"; // TODO: TodoSeek.findTodo 구현 필요
import { formatDateTime } from "@/utils/dates";
import { ROUTES } from "@/utils/routes";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export const TodoDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: todo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => Promise.resolve({ data: null }), // TODO: TodoSeek.findTodo 구현 필요
    enabled: !!id,
  });

  if (isLoading) return <Loader />;

  if (error || !todo?.data) {
    return (
      <Center w="1200px" h="50vh">
        <Text>할일을 찾을 수 없습니다.</Text>
      </Center>
    );
  }

  const todoData: Todo = todo.data;

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
              navigate(ROUTES.TODO_CREATE, { state: { todo: todoData } })
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
                  {getStatusName(todoData.status)}
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

export default TodoDetail;
