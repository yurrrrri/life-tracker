import { ROUTES } from "@/utils/routes";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  useInterval,
  VStack,
  Text,
  HStack,
  Box,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import {
  FiBook,
  FiCalendar,
  FiCheckSquare,
  FiPenTool,
  FiClock,
  FiPlus,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  // *** STATE ***
  const [now, setNow] = useState(dayjs().subtract(8, "hour").toDate());

  // *** HOOKS ***
  const navigate = useNavigate();

  useInterval(() => {
    // 1분 마다 현재 시간 초기화
    setNow(dayjs().subtract(8, "hour").toDate());
  }, 60000);

  // *** VAR ***
  const quickActions = [
    {
      label: "일기 작성",
      icon: <FiBook size={20} />,
      path: ROUTES.JOURNAL_CREATE,
      color: "blue",
      description: "오늘의 하루를 기록해보세요",
    },
    {
      label: "할 일 추가",
      icon: <FiCheckSquare size={20} />,
      path: ROUTES.TODO_CREATE,
      color: "green",
      description: "새로운 할 일을 추가하세요",
    },
    {
      label: "필사노트 작성",
      icon: <FiPenTool size={20} />,
      path: ROUTES.SENTENCE_CREATE,
      color: "purple",
      description: "마음에 드는 문장을 기록하세요",
    },
    {
      label: "갤러리 보기",
      icon: <FiCalendar size={20} />,
      path: ROUTES.GALLERY,
      color: "orange",
      description: "저장된 사진들을 확인하세요",
    },
  ];

  // *** RENDER ***
  const renderTimes = () => {
    const list = [];
    for (let i = 8; i <= 24; i++) {
      list.push(
        <Text
          key={i}
          fontSize="sm"
          color="gray.500"
          fontWeight="medium"
          fontFamily="mono"
        >
          {i.toLocaleString("ko-KR", { minimumIntegerDigits: 2 })}:00
        </Text>
      );
    }
    return list;
  };

  const renderTodoItem = (
    hour: number,
    minute: number,
    diff: number,
    label: string,
    color: string
  ) => {
    return (
      <div
        className="todo-item"
        style={{
          marginTop: 64.8 * (hour - 8) + minute + 10,
        }}
      >
        <Popover placement="right">
          <PopoverTrigger>
            <Button
              className="todo-btn"
              minH={`${1.18 * diff}px`}
              w={400}
              colorScheme={color}
              variant="solid"
              fontSize="sm"
              alignItems="start"
              flexDirection="column"
              borderRadius="lg"
              shadow="md"
              _hover={{
                shadow: "lg",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
            >
              <HStack w="full" justify="space-between" mb={1}>
                <Text fontSize="xs" opacity={0.9}>
                  {dayjs().hour(hour).minute(minute).format("HH:mm")}
                  <Text as="span" mx={1}>
                    ~
                  </Text>
                  {dayjs()
                    .hour(hour)
                    .minute(minute)
                    .add(diff, "minute")
                    .format("HH:mm")}
                </Text>
                <Badge size="sm" variant="subtle" colorScheme={color}>
                  {diff}분
                </Badge>
              </HStack>
              <Text fontWeight="semibold" fontSize="sm">
                {label}
              </Text>
            </Button>
          </PopoverTrigger>

          {/* Popover */}
          <Portal>
            <PopoverContent borderRadius="xl" shadow="xl">
              <PopoverArrow />
              <PopoverHeader
                borderBottom="1px solid"
                borderColor="gray.100"
                pb={3}
              >
                <VStack align="start" spacing={1}>
                  <HStack
                    justifyContent="space-between"
                    color="gray.500"
                    width="100%"
                  >
                    <Text fontWeight="semibold">{label}</Text>
                    <HStack>
                      <FiClock size={14} />
                      <Text fontSize="sm">
                        {dayjs().hour(hour).minute(minute).format("HH:mm")} ~
                        {` `}
                        {dayjs()
                          .hour(hour)
                          .minute(minute)
                          .add(diff, "minute")
                          .format("HH:mm")}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </PopoverHeader>
              <PopoverFooter display="flex" justifyContent="end" pt={3} gap={2}>
                <IconButton
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  aria-label="수정"
                  icon={<FiEdit size={14} />}
                  _hover={{
                    bg: "blue.50",
                  }}
                />
                <IconButton
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  aria-label="삭제"
                  icon={<FiTrash2 size={14} />}
                  _hover={{
                    bg: "red.50",
                  }}
                />
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </div>
    );
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Welcome Section */}
      <Card>
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading
              size="lg"
              color="gray.800"
              fontFamily="Freesentation-9Black"
              fontWeight="semibold"
            >
              안녕하세요! 👋
            </Heading>
            <Text color="gray.600" fontSize="lg">
              오늘도 소중한 하루를 기록해보세요
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader pb={2}>
          <Heading
            size="md"
            color="gray.800"
            fontWeight="semibold"
            fontFamily="nanum-gothic-bold"
          >
            빠른 작업
          </Heading>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} mt={6} spacing={6}>
            {quickActions.map((action) => (
              <Button
                key={action.path}
                colorScheme={action.color}
                variant="outline"
                onClick={() => navigate(action.path)}
                h="auto"
                p={6}
                flexDirection="column"
                alignItems="center"
                borderRadius="xl"
                borderWidth="2px"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                }}
                transition="all 0.2s"
              >
                <HStack spacing={3} align="center">
                  <Box color={`${action.color}.500`}>{action.icon}</Box>
                  <VStack spacing={1} align="start">
                    <Text fontWeight="semibold" fontSize="sm">
                      {action.label}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {action.description}
                    </Text>
                  </VStack>
                </HStack>
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Timeline view */}
      <Card>
        <CardHeader pb={2}>
          <HStack justify="space-between" align="center">
            <Heading
              size="md"
              color="gray.800"
              fontWeight="semibold"
              fontFamily="nanum-gothic-bold"
            >
              오늘의 일정
            </Heading>
            <Button
              leftIcon={<FiPlus size={16} />}
              size="sm"
              colorScheme="blue"
              variant="outline"
              borderRadius="lg"
            >
              일정 추가
            </Button>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <Box h={1050} position="relative">
            <div className="timeline-bar">
              <div
                className="bar-now"
                style={{
                  marginTop: 65 * now.getHours() + 1.1 * now.getMinutes(),
                }}
              />
              <VStack className="todo-items" w="full">
                {renderTodoItem(8, 30, 60, "사이드 프로젝트 개발", "blue")}
                {renderTodoItem(16, 30, 60, "운동", "blue")}
              </VStack>
              <div className="bar-item">
                <Flex position="relative">
                  <VStack
                    position="relative"
                    justifyContent="flex-start"
                    gap={10}
                    ml={8}
                    mt={1.5}
                  >
                    {...renderTimes()}
                  </VStack>
                </Flex>
              </div>
            </div>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Dashboard;
