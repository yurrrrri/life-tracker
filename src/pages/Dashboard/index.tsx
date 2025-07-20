import { ROUTES } from "@/constants";
import {
  categoriesAtom,
  currentDateAtom,
  journalsAtom,
  selectedDateAtom,
  todosAtom,
} from "@/stores";
import { formatDate, isDateFuture, isServiceDate, isToday } from "@/utils";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import {
  FiBook,
  FiCalendar,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [journals] = useAtom(journalsAtom);
  const [todos] = useAtom(todosAtom);
  const [categories] = useAtom(categoriesAtom);

  const navigate = useNavigate();

  const borderColor = useColorModeValue("gray.200", "gray.700");

  const goToPreviousMonth = () => {
    setCurrentDate(dayjs(currentDate).subtract(1, "month").toDate());
  };

  const goToNextMonth = () => {
    setCurrentDate(dayjs(currentDate).add(1, "month").toDate());
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(formatDate(today));
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDate(date);

    // Don't allow future dates
    if (isDateFuture(date)) {
      return;
    }

    // Check if date is within service period
    if (!isServiceDate(dateString)) {
      return;
    }

    setSelectedDate(dateString);
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

  const getJournalForDate = (date: Date) => {
    const dateString = formatDate(date);
    return journals.find((journal) => journal.date === dateString);
  };

  const getTodosForDate = (date: Date) => {
    const dateString = formatDate(date);
    return todos.filter((todo) => {
      const todoDate = formatDate(new Date(todo.startDateTime));
      return todoDate === dateString;
    });
  };

  const getCategoryForTodo = (categoryId: string) => {
    return categories.find((category) => category.id === categoryId);
  };

  const renderCalendarDay = (date: Date, index: number) => {
    const isCurrentMonth = dayjs(date).isSame(currentDate, "month");
    const isSelected = selectedDate === formatDate(date);
    const isTodayDate = isToday(date);
    const isFutureDate = isDateFuture(date);
    const isServiceDateValid = isServiceDate(formatDate(date));

    const journal = getJournalForDate(date);
    const todos = getTodosForDate(date);

    const dayBg = useColorModeValue(
      isSelected ? "brand.100" : isTodayDate ? "brand.50" : "transparent",
      isSelected ? "brand.900" : isTodayDate ? "brand.900" : "transparent"
    );

    const dayColor = useColorModeValue(
      isCurrentMonth ? "gray.800" : "gray.400",
      isCurrentMonth ? "white" : "gray.500"
    );

    return (
      <Box
        key={index}
        p={3}
        h="100px"
        bg={dayBg}
        border="1px"
        borderColor={borderColor}
        cursor={
          isCurrentMonth && !isFutureDate && isServiceDateValid
            ? "pointer"
            : "default"
        }
        onClick={() => handleDateClick(date)}
        position="relative"
        _hover={
          isCurrentMonth && !isFutureDate && isServiceDateValid
            ? { bg: useColorModeValue("gray.50", "gray.700") }
            : {}
        }
      >
        <Text
          fontSize="md"
          fontWeight={isTodayDate ? "bold" : "normal"}
          color={dayColor}
          mb={2}
        >
          {date.getDate()}
        </Text>

        <VStack spacing={1} align="start">
          {journal && (
            <Badge size="md" colorScheme="green" variant="subtle">
              일기
            </Badge>
          )}
          {todos.slice(0, 2).map((todo, todoIndex) => {
            const category = getCategoryForTodo(todo.categoryId);
            return (
              <Badge
                key={todoIndex}
                size="md"
                variant="subtle"
                bg={category?.color || "brand.100"}
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

  const quickActions = [
    {
      label: "일기 작성",
      icon: <FiBook />,
      path: ROUTES.JOURNAL_WRITE,
      color: "purple",
    },
    {
      label: "할 일 추가",
      icon: <FiCheckSquare />,
      path: ROUTES.TODO_WRITE,
      color: "teal",
    },
    {
      label: "갤러리 보기",
      icon: <FiCalendar />,
      path: ROUTES.GALLERY,
      color: "blue",
    },
  ];

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Heading size="xl">홈</Heading>
        <Button rounded="l1" onClick={goToToday} size="md" variant="outline">
          오늘
        </Button>
      </Flex>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <Heading size="md">빠른 작업</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {quickActions.map((action) => (
              <Button
                key={action.path}
                leftIcon={action.icon}
                colorScheme={action.color}
                variant="outline"
                onClick={() => navigate(action.path)}
                h="46px"
                fontSize="smaller"
              >
                {action.label}
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">캘린더</Heading>
            <HStack spacing={3}>
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

      {/* Selected Date Info */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <Heading size="md">{formatDate(selectedDate)}</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={3} fontSize="lg">
                  일기
                </Text>
                {getJournalForDate(new Date(selectedDate)) ? (
                  <Button
                    leftIcon={<FiBook />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() =>
                      navigate(`${ROUTES.JOURNAL_VIEW.replace(":id", "temp")}`)
                    }
                    size="md"
                  >
                    일기 보기
                  </Button>
                ) : (
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => navigate(ROUTES.JOURNAL_WRITE)}
                    size="md"
                  >
                    일기 작성
                  </Button>
                )}
              </Box>

              <Box>
                <Text fontWeight="bold" mb={3} fontSize="lg">
                  할 일
                </Text>
                {getTodosForDate(new Date(selectedDate)).length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {getTodosForDate(new Date(selectedDate)).map((todo) => {
                      const category = getCategoryForTodo(todo.categoryId);
                      return (
                        <Box
                          key={todo.id}
                          p={3}
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="md"
                          bg={category?.color || "gray.100"}
                        >
                          <Text fontSize="md">{todo.contents}</Text>
                        </Box>
                      );
                    })}
                  </VStack>
                ) : (
                  <Button
                    leftIcon={<FiPlus />}
                    variant="outline"
                    onClick={() => navigate(ROUTES.TODO_WRITE)}
                    size="md"
                  >
                    할 일 추가
                  </Button>
                )}
              </Box>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default Dashboard;
