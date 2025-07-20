import { ROUTES } from "@/constants/data";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  useInterval,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { FiBook, FiCalendar, FiCheckSquare, FiPenTool } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [now, setNow] = useState(dayjs().subtract(8, "hour").toDate());

  const navigate = useNavigate();

  const getTimes = () => {
    const list = [];
    for (let i = 8; i <= 24; i++) {
      list.push(
        <span>{i.toLocaleString("ko-KR", { minimumIntegerDigits: 2 })}:00</span>
      );
    }
    return list;
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
      label: "필사노트 작성",
      icon: <FiPenTool />,
      path: ROUTES.SENTENCE_WRTE,
      color: "pink",
    },
    {
      label: "갤러리 보기",
      icon: <FiCalendar />,
      path: ROUTES.GALLERY,
      color: "dark-gray",
    },
  ];

  const renderTodoItem = (
    hour: number,
    minute: number,
    diff: number,
    label: string
  ) => {
    return (
      <div
        className="todo-item"
        style={{
          marginTop: 91 * hour + 1.6 * minute,
        }}
      >
        <Button
          minH={`${1.6 * diff}px`}
          w={400}
          variant="solid"
          fontSize="smaller"
          alignItems="start"
          flexDirection="column"
        >
          <p>
            {dayjs().hour(hour).minute(minute).add(8, "hour").format("HH:mm")}
            <em style={{ margin: "0 4px 0" }}>~</em>
            {dayjs()
              .hour(hour)
              .minute(minute)
              .add(8, "hour")
              .add(diff, "minute")
              .format("HH:mm")}
          </p>
          <p style={{ fontFamily: "Hahmlet", fontWeight: 600 }}>{label}</p>
        </Button>
      </div>
    );
  };

  useInterval(() => {
    // 1분 마다 현재 시간 초기화
    setNow(dayjs().subtract(8, "hour").toDate());
  }, 60000);

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
        <Card h={1485} mb={10}>
          <CardBody>
            <div className="timeline-bar">
              <div
                className="bar-now"
                style={{
                  marginTop: 91 * now.getHours() + 1.45 * now.getMinutes(),
                }}
              />
              <VStack className="todo-items" w="full">
                {renderTodoItem(0, 30, 60, "사이드 프로젝트 개발")}
              </VStack>
              <div className="bar-item">
                <Flex position="relative">
                  <VStack
                    position="relative"
                    justifyContent="flex-start"
                    gap={16}
                    ml={8}
                    mt={1.5}
                  >
                    {...getTimes()}
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
