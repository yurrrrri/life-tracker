import { Loader } from "@/commons";
import { getStatusColor, getStatusName, Status, Todo } from "@/server";
import { TodoFlow } from "@/server/api/flow/TodoFlow";
import TodoSeek from "@/server/api/flow/TodoSeek";
import { useConfirm } from "@/commons/ui";
import {
  categoriesAtom,
  currentDateAtom,
  selectedDateAtom,
} from "@/utils/atoms";
import { formatDate, formatDateTime, isFuture, isToday } from "@/utils/dates";
import { ROUTES } from "@/utils/routes";
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
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const TodoList = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);

  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();

  const [categories] = useAtom(categoriesAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<keyof typeof Status | "">(
    ""
  );
  const [filterCategory, setFilterCategory] = useState<string>("");

  // *** QUERY ***
  const { changeTodoStatus, remove } = TodoFlow;

  const findDailyTodo = TodoSeek.query.findDailyTodo();
  const { data: todosData, isLoading } = useQuery(findDailyTodo);
  const todos = useMemo(() => todosData || [], [todosData]);

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(formatDate(today));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
  };

  const goToNextMonth = () => {
    setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDate(date));
  };

  const getCalendarDays = () => {
    const dayList = [];
    const start = 1;
    const end = dayjs(start).daysInMonth();

    for (let i = 1; i <= end; i++) {
      dayList.push(dayjs().date(i).toDate());
    }

    return dayList;
  };

  const getCategoryForTodo = (categoryId: string) => {
    return categories.find((category) => category.id === categoryId);
  };

  const renderCalendarDay = (date: Date, index: number) => {
    const isCurrentMonth = dayjs(date).isSame(currentDate, "month");
    const isSelected = selectedDate === formatDate(date);
    const isTodayDate = isToday(date);
    const isFutureDate = isFuture(date);

    const dayBg = useColorModeValue(
      isTodayDate ? "brand.50" : isSelected ? "brand.100" : "transparent",
      isTodayDate ? "brand.600" : isSelected ? "brand.300" : "transparent"
    );

    const dayColor = useColorModeValue(
      isCurrentMonth ? "gray.800" : "gray.400",
      isCurrentMonth ? "white" : "gray.500"
    );

    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
      <Box
        key={index}
        p={3}
        h="100px"
        bg={dayBg}
        border="1px"
        borderColor={borderColor}
        cursor="pointer"
        onClick={() => handleDateClick(date)}
        position="relative"
        _hover={
          isCurrentMonth && !isFutureDate
            ? { bg: useColorModeValue("gray.50", "gray.700") }
            : {}
        }
      >
        <Text fontSize="md" color={dayColor} mb={2}>
          {date.getDate()}
        </Text>

        <VStack spacing={1} align="start">
          {todos.slice(0, 2).map((todo, todoIndex) => {
            const category = getCategoryForTodo(todo.categoryId);
            return (
              <Badge
                key={todoIndex}
                size="md"
                variant="subtle"
                bg={category?.colorType || "brand.100"}
                color="white"
                fontSize="xs"
              >
                {todo.contents}
              </Badge>
            );
          })}
          {todos.length > 2 && (
            <Badge size="md" colorScheme="gray" variant="subtle">
              +{todos.length - 2}
            </Badge>
          )}
        </VStack>
      </Box>
    );
  };

  // React.useEffect(() => {
  //   if (todosData?.data) {
  //     setTodos(todosData.data);
  //   }
  // }, [todosData]);

  // Filter and sort todos
  const filteredTodos = todos
    .filter((todo) => {
      const matchesSearch =
        todo.contents.includes(searchTerm) || todo.memo?.includes(searchTerm);
      const matchesStatus = !filterStatus || todo.status === filterStatus;
      const matchesCategory =
        !filterCategory || todo.categoryId === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime()
    );

  const handleStatusChange = (todoId: string, status: keyof typeof Status) => {
    changeTodoStatus({ id: todoId, status }).then((e) => {
      if (e.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        toast({
          title: "할일 상태가 업데이트되었습니다.",
          status: "success",
          duration: 3000,
        });
      }
    });
  };

  const handleDelete = (todoId: string) => {
    confirm({
      type: 'warn',
      message: "정말로 이 할일을 삭제하시겠습니까?",
      onOk: () => {
        remove({ id: todoId }).then((e) => {
          if (e.status === 200) {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
            toast({
              title: "할일이 삭제되었습니다.",
              status: "success",
              duration: 3000,
            });
          }
        });
      },
    });
  };

  const handleView = (todo: Todo) => {
    navigate(ROUTES.TODO_DETAIL.replace(":id", todo.id));
  };

  const handleEdit = (todo: Todo) => {
    navigate(ROUTES.TODO_CREATE, { state: { todo } });
  };

  if (isLoading) return <Loader />;

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md">할일 목록</Heading>
          <Button
            leftIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.TODO_CREATE)}
          >
            새 할일 추가
          </Button>
        </Flex>

        {/* Search and Filter */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={4}>
                <Box flex={1}>
                  <Input
                    placeholder="할 일을 검색해 보세요."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
              </HStack>

              <HStack w="full" spacing={4}>
                <Select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as keyof typeof Status | "")
                  }
                  placeholder="상태별 필터"
                >
                  {Object.values(Status).map((status) => (
                    <option key={status} value={status}>
                      {getStatusName(status)}
                    </option>
                  ))}
                </Select>

                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  placeholder="카테고리별 필터"
                >
                  {categories
                    .filter((cat) => !cat.removed)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </Select>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">캘린더</Heading>
              <HStack spacing={3} marginLeft={12}>
                <IconButton
                  aria-label="Previous month"
                  icon={<FiChevronLeft />}
                  onClick={goToPreviousMonth}
                  size="md"
                  variant="ghost"
                />
                <Text
                  fontWeight="bold"
                  minW="150px"
                  textAlign="center"
                  fontSize="lg"
                >
                  {dayjs(currentDate).format("YYYY년 M월")}
                </Text>
                <IconButton
                  aria-label="Next month"
                  icon={<FiChevronRight />}
                  onClick={goToNextMonth}
                  size="md"
                  variant="ghost"
                />
              </HStack>
              <Button onClick={goToToday} variant="outline">
                오늘
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            {/* Calendar Header */}
            <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={3}>
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <GridItem key={day}>
                  <Text
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="md"
                    color="gray.500"
                    py={2}
                  >
                    {day}
                  </Text>
                </GridItem>
              ))}
            </Grid>

            {/* Calendar Days */}
            <Grid templateColumns="repeat(7, 1fr)" gap={2}>
              {getCalendarDays().map((date, index) =>
                renderCalendarDay(date, index)
              )}
            </Grid>
          </CardBody>
        </Card>

        {/* Todos Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredTodos.map((todo) => {
            const category = categories.find(
              (cat) => cat.id === todo.categoryId
            );

            return (
              <Card
                key={todo.id}
                cursor="pointer"
                onClick={() => handleView(todo)}
              >
                <CardHeader>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                      {todo.contents}
                    </Text>
                    <Badge colorScheme={getStatusColor(todo.status)}>
                      {getStatusName(todo.status)}
                    </Badge>
                  </HStack>
                </CardHeader>

                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    {/* Category */}
                    {category && (
                      <HStack>
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg={category.colorType}
                        />
                        <Text fontSize="sm">{category.name}</Text>
                      </HStack>
                    )}

                    {/* Date */}
                    <Text fontSize="sm" color="gray.600">
                      {formatDateTime(new Date(todo.startDateTime))}
                      {todo.isPeriod && (
                        <> ~ {formatDateTime(new Date(todo.endDateTime))}</>
                      )}
                    </Text>

                    {/* Memo */}
                    {todo.memo && (
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {todo.memo}
                      </Text>
                    )}

                    {/* Actions */}
                    <HStack justify="space-between">
                      <Select
                        size="sm"
                        value={todo.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(
                            todo.id,
                            e.target.value as keyof typeof Status
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {Object.values(Status).map((status) => (
                          <option key={status} value={status}>
                            {getStatusName(status)}
                          </option>
                        ))}
                      </Select>

                      <HStack spacing={1}>
                        <IconButton
                          size="sm"
                          aria-label="편집"
                          icon={<EditIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(todo);
                          }}
                        />
                        <IconButton
                          size="sm"
                          aria-label="삭제"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(todo.id);
                          }}
                        />
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>

        {filteredTodos.length === 0 && (
          <Center py={10}>
            <Text color="gray.500">할일이 없습니다.</Text>
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default TodoList;
