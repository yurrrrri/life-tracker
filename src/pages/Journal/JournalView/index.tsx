import {
  FEELING_ICONS,
  FEELING_LABELS,
  ROUTES,
  WEATHER_ICONS,
  WEATHER_LABELS,
} from "@/constants/data";
import api from "@/services/api";
import { Journal } from "@/constants/types";
import { formatDate, formatDateTime } from "@/utils";
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
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export const JournalView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: journal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["journal", id],
    queryFn: () => api.get(`/journals/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Center w="1200px" h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !journal?.data) {
    return (
      <Center w="1200px" h="50vh">
        <Text>일기를 찾을 수 없습니다.</Text>
      </Center>
    );
  }

  const journalData: Journal = journal.data;
  const WeatherIcon = journalData.weather
    ? WEATHER_ICONS[journalData.weather]
    : null;
  const FeelingIcon = FEELING_ICONS[journalData.feeling];

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate(ROUTES.JOURNAL)}
            >
              목록으로
            </Button>
            <Heading size="md">일기 상세</Heading>
          </HStack>
          <Button
            leftIcon={<EditIcon />}
            onClick={() =>
              navigate(ROUTES.JOURNAL_WRITE, {
                state: { journal: journalData },
              })
            }
          >
            수정
          </Button>
        </Flex>

        {/* Journal Content */}
        <Card>
          <CardHeader>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="xl">
                  {formatDate(new Date(journalData.date))}
                </Text>
                <HStack spacing={2}>
                  {journalData.locked && (
                    <Badge colorScheme="red">비공개</Badge>
                  )}
                  {journalData.saved && (
                    <Badge colorScheme="green">저장됨</Badge>
                  )}
                </HStack>
              </HStack>

              {/* Weather and Feeling */}
              <HStack justify="space-between">
                {WeatherIcon && (
                  <HStack>
                    <WeatherIcon size={24} />
                    <Text>{WEATHER_LABELS[journalData.weather!]}</Text>
                    {journalData.weatherComment && (
                      <Text fontSize="sm" color="gray.600">
                        ({journalData.weatherComment})
                      </Text>
                    )}
                  </HStack>
                )}
                <HStack>
                  <FeelingIcon size={24} />
                  <Text>{FEELING_LABELS[journalData.feeling]}</Text>
                  {journalData.feelingComment && (
                    <Text fontSize="sm" color="gray.600">
                      ({journalData.feelingComment})
                    </Text>
                  )}
                </HStack>
              </HStack>
            </VStack>
          </CardHeader>

          <CardBody>
            <VStack align="stretch" spacing={6}>
              {/* Contents */}
              {journalData.contents && (
                <Box>
                  <Text fontWeight="bold" mb={3}>
                    일기 내용
                  </Text>
                  <Text whiteSpace="pre-wrap">{journalData.contents}</Text>
                </Box>
              )}

              {/* Images */}
              {(journalData.imageId1 || journalData.imageId2) && (
                <Box>
                  <Text fontWeight="bold" mb={3}>
                    첨부된 사진
                  </Text>
                  <HStack spacing={4}>
                    {journalData.imageId1 && (
                      <Image
                        src={`/api/images/${journalData.imageId1}`}
                        alt="첨부 이미지 1"
                        borderRadius="md"
                        maxH="300px"
                        objectFit="cover"
                      />
                    )}
                    {journalData.imageId2 && (
                      <Image
                        src={`/api/images/${journalData.imageId2}`}
                        alt="첨부 이미지 2"
                        borderRadius="md"
                        maxH="300px"
                        objectFit="cover"
                      />
                    )}
                  </HStack>
                </Box>
              )}

              {/* Memo */}
              {journalData.memo && (
                <Box>
                  <Text fontWeight="bold" mb={3}>
                    메모
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontStyle="italic">
                    {journalData.memo}
                  </Text>
                </Box>
              )}

              <Divider />

              {/* Metadata */}
              <HStack justify="space-between" fontSize="sm" color="gray.500">
                <Text>
                  작성일: {formatDateTime(new Date(journalData.registeredOn))}
                </Text>
                {journalData.modifiedOn !== journalData.registeredOn && (
                  <Text>
                    수정일: {formatDateTime(new Date(journalData.modifiedOn))}
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

export default JournalView;
