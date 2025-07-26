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
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { FiBook, FiCalendar, FiCheckSquare, FiPenTool } from "react-icons/fi";
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
      icon: <FiBook />,
      path: ROUTES.JOURNAL_CREATE,
      color: "purple",
    },
    {
      label: "할 일 추가",
      icon: <FiCheckSquare />,
      path: ROUTES.TODO_CREATE,
      color: "teal",
    },
    {
      label: "필사노트 작성",
      icon: <FiPenTool />,
      path: ROUTES.SENTENCE_CREATE,
      color: "pink",
    },
    {
      label: "갤러리 보기",
      icon: <FiCalendar />,
      path: ROUTES.GALLERY,
      color: "dark-gray",
    },
  ];

  // *** RENDER ***
  const renderTimes = () => {
    const list = [];
    for (let i = 8; i <= 24; i++) {
      list.push(
        <span>{i.toLocaleString("ko-KR", { minimumIntegerDigits: 2 })}:00</span>
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
        <Popover>
          <PopoverTrigger>
            <Button
              className="todo-btn"
              minH={`${1.18 * diff}px`}
              w={400}
              colorScheme={color}
              variant="solid"
              fontSize="smaller"
              alignItems="start"
              flexDirection="column"
            >
              <p>
                {dayjs().hour(hour).minute(minute).format("HH:mm")}
                <em style={{ margin: "0 4px 0" }}>~</em>
                {dayjs()
                  .hour(hour)
                  .minute(minute)
                  .add(diff, "minute")
                  .format("HH:mm")}
              </p>
              <p style={{ fontFamily: "Hahmlet", fontWeight: 700 }}>{label}</p>
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>{label}</PopoverHeader>
              <PopoverFooter display="flex" justifyContent="end">
                <Button w={12} variant="outline">
                  수정
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </div>
    );
  };

  return (
    <>
      <VStack spacing={8} align="stretch">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <Heading size="md">빠른 작업</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
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

        {/* Timeline view */}
        <Card h={1100} mb={10}>
          <CardBody>
            <div className="timeline-bar">
              <div
                className="bar-now"
                style={{
                  marginTop: 65 * now.getHours() + 1.1 * now.getMinutes(),
                }}
              />
              <VStack className="todo-items" w="full">
                {renderTodoItem(8, 30, 60, "사이드 프로젝트 개발", "brand")}
                {renderTodoItem(16, 30, 60, "운동", "green")}
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
          </CardBody>
        </Card>
      </VStack>
    </>
  );
};

export default Dashboard;
