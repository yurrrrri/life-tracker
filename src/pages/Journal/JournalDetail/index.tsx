import { Loader, NotFoundText } from "@/commons";
import { Feeling, Weather } from "@/server";
import JournalSeek from "@/server/api/flow/JournalSeek";
import {
  FEELING_ICONS,
  FEELING_NAME,
  WEATHER_ICONS,
  WEATHER_NAME,
} from "@/utils/constants";
import { formatDate, formatDateTime } from "@/utils/dates";
import { ROUTES } from "@/utils/routes";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const JournalDetail = () => {
  // *** HOOKS ***
  const navigate = useNavigate();

  // *** QUERY ***
  const findJournal = JournalSeek.query.findDailyJournal();
  const { data: journal, isLoading, error } = useQuery(findJournal);

  // *** VAR ***
  const weatherIcon = (weather?: keyof typeof Weather) =>
    WEATHER_ICONS[weather || "SUNNY"];
  const feelingIcon = (feeling?: keyof typeof Feeling) =>
    FEELING_ICONS[feeling || "NEUTRAL"];

  // *** RENDER ***
  if (isLoading) return <Loader />;
  if (error) {
    return <NotFoundText text="일기를 찾을 수 없습니다." />;
  }
  if (!journal || journal.length === 0) {
    return <NotFoundText text="일기가 작성되지 않았습니다." />;
  }

  return (
    <Box>
      {journal.map((data) => (
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
              <Heading size="md" fontFamily="nanum-gothic-bold">일기 상세</Heading>
            </HStack>
            <Button
              leftIcon={<EditIcon />}
              onClick={() =>
                navigate(ROUTES.JOURNAL_CREATE, {
                  state: { journal: data },
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
                    {formatDate(new Date(data.date))}
                  </Text>
                  <HStack spacing={2}>
                    {data.locked && <Badge colorScheme="red">비공개</Badge>}
                    {data.saved && <Badge colorScheme="green">저장됨</Badge>}
                  </HStack>
                </HStack>

                {/* Weather and Feeling */}
                <HStack justify="space-between">
                  {weatherIcon(data.weatherComment?.weather) && (
                    <HStack>
                      <Icon fontSize={24} type={weatherIcon.toString()} />
                      <Text>
                        {!!data.weatherComment?.weather
                          ? WEATHER_NAME[
                              data.weatherComment
                                .weather as keyof typeof Weather
                            ]
                          : WEATHER_NAME[Weather.SUNNY]}
                      </Text>
                      {data.weatherComment && (
                        <Text fontSize="sm" color="gray.600">
                          ({data.weatherComment.comment || ""})
                        </Text>
                      )}
                    </HStack>
                  )}
                  {feelingIcon(data.feelingComment?.feeling) && (
                    <HStack>
                      <Icon fontSize={24} type={feelingIcon.toString()} />
                      <Text>
                        {!!data.feelingComment?.feeling
                          ? FEELING_NAME[data.feelingComment?.feeling]
                          : FEELING_NAME[Feeling.NEUTRAL]}
                      </Text>
                      {data.feelingComment && (
                        <Text fontSize="sm" color="gray.600">
                          ({data.feelingComment.comment || ""})
                        </Text>
                      )}
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </CardHeader>

            <CardBody>
              <VStack align="stretch" spacing={6}>
                {/* Contents */}
                {data.contents && (
                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      일기 내용
                    </Text>
                    <Text whiteSpace="pre-wrap">{data.contents}</Text>
                  </Box>
                )}

                {/* Images */}
                {(data.imageId1 || data.imageId2) && (
                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      첨부된 사진
                    </Text>
                    <HStack spacing={4}>
                      {data.imageId1 && (
                        <Image
                          src={`/images/${data.imageId1}`}
                          alt="첨부 이미지 1"
                          borderRadius="md"
                          maxH="300px"
                          objectFit="cover"
                        />
                      )}
                      {data.imageId2 && (
                        <Image
                          src={`/images/${data.imageId2}`}
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
                {data.memo && (
                  <Box>
                    <Text fontWeight="bold" mb={3}>
                      메모
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontStyle="italic">
                      {data.memo}
                    </Text>
                  </Box>
                )}

                <Divider />

                {/* Metadata */}
                <HStack justify="space-between" fontSize="sm" color="gray.500">
                  <Text>
                    작성일: {formatDateTime(new Date(data.registeredOn))}
                  </Text>
                  <Text>
                    수정일: {formatDateTime(new Date(data.modifiedOn))}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      ))}
    </Box>
  );
};

export default JournalDetail;
