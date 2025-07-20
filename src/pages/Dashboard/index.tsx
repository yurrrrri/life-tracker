import { ROUTES } from "@/constants";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import { FiBook, FiCalendar, FiCheckSquare, FiPenTool } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

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

  return (
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
    </VStack>
  );
};

export default Dashboard;
