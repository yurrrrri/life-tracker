import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Spinner,
  Center,
  Flex,
  Heading,
  Divider,
} from '@chakra-ui/react'

import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { EditIcon, ArrowBackIcon } from '@chakra-ui/icons'
import { ROUTES } from '@/constants'
import { Todo, TodoStatus } from '@/types'
import api from '@/services/api'

const TodoViewPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => api.get(`/todos/${id}`),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (error || !todo?.data) {
    return (
      <Center h="50vh">
        <Text>할일을 찾을 수 없습니다.</Text>
      </Center>
    )
  }

  const todoData: Todo = todo.data

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case 'NOT_STARTED': return 'gray'
      case 'JUST_STARTED': return 'blue'
      case 'IN_PROGRESS': return 'yellow'
      case 'PENDING': return 'orange'
      case 'ONEDAY': return 'purple'
      case 'DONE': return 'green'
      default: return 'gray'
    }
  }

  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case 'NOT_STARTED': return '시작 전'
      case 'JUST_STARTED': return '시작함'
      case 'IN_PROGRESS': return '진행 중'
      case 'PENDING': return '보류'
      case 'ONEDAY': return '언젠가'
      case 'DONE': return '완료'
      default: return status
    }
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate(ROUTES.TODO)}
            >
              목록으로
            </Button>
            <Heading size="lg">할일 상세</Heading>
          </HStack>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            onClick={() => navigate(ROUTES.TODO_WRITE, { state: { todo: todoData } })}
          >
            수정
          </Button>
        </Flex>

        {/* Todo Content */}
        <Card>
          <CardHeader>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="xl">
                  {todoData.contents}
                </Text>
                <Badge colorScheme={getStatusColor(todoData.status)} size="lg">
                  {getStatusLabel(todoData.status)}
                </Badge>
              </HStack>
            </VStack>
          </CardHeader>

          <CardBody>
            <VStack align="stretch" spacing={6}>
              {/* Date and Time */}
              <Box>
                <Text fontWeight="bold" mb={3}>일정</Text>
                <VStack align="stretch" spacing={2}>
                  <Text>
                    시작: {format(new Date(todoData.startDateTime), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                  </Text>
                  {todoData.isPeriod && (
                    <Text>
                      종료: {format(new Date(todoData.endDateTime), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                    </Text>
                  )}
                </VStack>
              </Box>

              {/* Memo */}
              {todoData.memo && (
                <Box>
                  <Text fontWeight="bold" mb={3}>메모</Text>
                  <Text fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                    {todoData.memo}
                  </Text>
                </Box>
              )}

              <Divider />

              {/* Metadata */}
              <HStack justify="space-between" fontSize="sm" color="gray.500">
                <Text>작성일: {format(new Date(todoData.registeredOn), 'yyyy-MM-dd HH:mm')}</Text>
                {todoData.registeredOn !== todoData.registeredOn && (
                  <Text>수정일: {format(new Date(todoData.registeredOn), 'yyyy-MM-dd HH:mm')}</Text>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  )
}

export default TodoViewPage 