import { Loader } from "@/commons";
import {
  Feeling,
  getStatusColor,
  getStatusName,
  Status,
  Strategy,
} from "@/server";
// import { FeelingStatsFlow } from "@/server/api/flow/stats/FeelingStatsFlow"; // TODO: 구현 필요
// import { TodoStatsFlow } from "@/server/api/flow/stats/TodoStatsFlow"; // TODO: 구현 필요
import {
  feelingStatsAtom,
  journalsAtom,
  todosAtom,
  todoStatsAtom,
} from "@/utils/atoms";
import { FEELING_NAME } from "@/utils/constants";
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Progress,
  Select,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";

export const Stats = () => {
  const [strategy, setStrategy] = useState<keyof typeof Strategy>(
    "MONTHLY" as keyof typeof Strategy
  );
  const [, setFeelingStats] = useAtom(feelingStatsAtom);
  const [, setTodoStats] = useAtom(todoStatsAtom);

  const [journals] = useAtom(journalsAtom);
  const [todos] = useAtom(todosAtom);

  // *** QUERY ***
  // TODO: FeelingStatsFlow와 TodoStatsFlow 구현 필요
  // const { findFeelingStats } = FeelingStatsFlow;
  // const { findTodoStats } = TodoStatsFlow;

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["stats", strategy],
    queryFn: () =>
      Promise.resolve({ data: { feelingStats: [], todoStats: [] } }), // TODO: 실제 API 구현 필요
  });

  React.useEffect(() => {
    if (statsData?.data) {
      setFeelingStats(statsData.data.feelingStats || []);
      setTodoStats(statsData.data.todoStats || []);
    }
  }, [statsData]);

  // Calculate summary stats
  const totalJournals = journals.length;
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.status === "DONE").length;
  const completionRate =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // Get feeling distribution
  const feelingDistribution = Object.values(Feeling)
    .map((feeling) => {
      const count = journals.filter(
        (journal) => journal.feelingComment?.feeling === feeling
      ).length;
      return {
        feeling,
        count,
        percentage: totalJournals > 0 ? (count / totalJournals) * 100 : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Get todo status distribution
  const todoStatusDistribution = Object.values(Status)
    .map((status) => {
      const count = todos.filter((todo) => todo.status === status).length;
      return {
        status,
        count,
        percentage: totalTodos > 0 ? (count / totalTodos) * 100 : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  if (isLoading) return <Loader />;

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md">통계</Heading>
          <Select
            value={strategy}
            onChange={(e) =>
              setStrategy(e.target.value as keyof typeof Strategy)
            }
            w="200px"
          >
            <option value="MONTHLY">월별</option>
            <option value="QUARTERLY">분기별</option>
            <option value="YEARLY">연도별</option>
          </Select>
        </Flex>

        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>총 일기 수</StatLabel>
                <StatNumber>{totalJournals}</StatNumber>
                <StatHelpText>전체 작성된 일기</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>총 할일 수</StatLabel>
                <StatNumber>{totalTodos}</StatNumber>
                <StatHelpText>전체 등록된 할일</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>완료된 할일</StatLabel>
                <StatNumber>{completedTodos}</StatNumber>
                <StatHelpText>
                  완료율: {completionRate.toFixed(1)}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>평균 일기 작성</StatLabel>
                <StatNumber>
                  {totalJournals > 0
                    ? (
                        totalJournals /
                        Math.max(
                          1,
                          Math.ceil(
                            (Date.now() - new Date("2025-01-01").getTime()) /
                              (1000 * 60 * 60 * 24 * 30)
                          )
                        )
                      ).toFixed(1)
                    : 0}
                </StatNumber>
                <StatHelpText>월 평균</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Feeling Distribution */}
        <Card>
          <CardHeader>
            <Heading size="md">감정 분포</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {feelingDistribution.map(({ feeling, count, percentage }) => (
                <Box key={feeling}>
                  <HStack justify="space-between" mb={2}>
                    <Text>{FEELING_NAME[feeling]}</Text>
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.500">
                        {count}개 ({percentage.toFixed(1)}%)
                      </Text>
                    </HStack>
                  </HStack>
                  <Progress value={percentage} size="sm" borderRadius="full" />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Todo Status Distribution */}
        <Card>
          <CardHeader>
            <Heading size="md">할일 상태 분포</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {todoStatusDistribution.map(({ status, count, percentage }) => (
                <Box key={status}>
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Badge colorScheme={getStatusColor(status)}>
                        {getStatusName(status)}
                      </Badge>
                      <Text>{count}개</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {percentage.toFixed(1)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={percentage}
                    colorScheme={getStatusColor(status)}
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <Heading size="md">최근 활동</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text>최근 일기 작성</Text>
                <Text fontSize="sm" color="gray.500">
                  {journals.length > 0
                    ? new Date(
                        journals[journals.length - 1].date
                      ).toLocaleDateString("ko-KR")
                    : "없음"}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text>최근 할일 완료</Text>
                <Text fontSize="sm" color="gray.500">
                  {todos.filter((todo) => todo.status === "DONE").length > 0
                    ? new Date(
                        todos.filter(
                          (todo) => todo.status === "DONE"
                        )[0].registeredOn
                      ).toLocaleDateString("ko-KR")
                    : "없음"}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Stats;
