import { Feeling, Weather } from "@/server";
import {
  categoriesAtom,
  currentDateAtom,
  journalsAtom,
  selectedDateAtom,
  todosAtom,
} from "@/utils/atoms";
import { FEELING_LABELS, WEATHER_LABELS } from "@/utils/constants";
import { formatDate, isFuture, isToday } from "@/utils/dates";
import { ROUTES } from "@/utils/routes";
import { AddIcon } from "@chakra-ui/icons";
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
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const JournalList = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom);
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [journals] = useAtom(journalsAtom);
  const [todos] = useAtom(todosAtom);
  const [categories] = useAtom(categoriesAtom);

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterWeather, setFilterWeather] = useState<keyof typeof Weather | "">(
    ""
  );
  const [filterFeeling, setFilterFeeling] = useState<keyof typeof Feeling | "">(
    ""
  );
  const [sortBy, setSortBy] = useState<"desc" | "asc">("desc");

  const borderColor = useColorModeValue("gray.200", "gray.700");

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
    const isFutureDate = isFuture(date);

    const journal = getJournalForDate(date);
    const todos = getTodosForDate(date);

    const dayBg = useColorModeValue(
      isTodayDate ? "brand.50" : isSelected ? "brand.100" : "transparent",
      isTodayDate ? "brand.600" : isSelected ? "brand.300" : "transparent"
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

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md">일기 목록</Heading>
          <Box>
            <Button
              style={{ marginRight: 8 }}
              leftIcon={<AddIcon />}
              onClick={() => navigate(ROUTES.JOURNAL_CREATE)}
            >
              새 일기 작성
            </Button>
            <Button size="md" variant="outline">
              타임라인으로 보기
            </Button>
          </Box>
        </Flex>

        {/* Search and Filter */}
        <Card>
          <CardBody>
            <VStack>
              <HStack w="full">
                <Box flex={1}>
                  <Input
                    placeholder="일기 내용이나 메모로 검색할 수 있어요."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Box>
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

        {/* Timeline View */}
        <Card>
          <CardHeader>
            <Flex justify="space-between">
              <Heading size="md">타임라인</Heading>
              <HStack spacing={2}>
                <Select
                  w={120}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "desc" | "asc")}
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </Select>
                <Button onClick={onOpen}>필터</Button>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack w="full" spacing={4}></VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Filter Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>필터 설정</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2}>날씨</Text>
                <Select
                  value={filterWeather}
                  onChange={(e) =>
                    setFilterWeather(
                      e.target.value as keyof typeof Weather | ""
                    )
                  }
                >
                  <option value="">전체</option>
                  {Object.entries(WEATHER_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box w="full">
                <Text mb={2}>감정</Text>
                <Select
                  value={filterFeeling}
                  onChange={(e) =>
                    setFilterFeeling(
                      e.target.value as keyof typeof Feeling | ""
                    )
                  }
                >
                  <option value="">전체</option>
                  {Object.entries(FEELING_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default JournalList;
