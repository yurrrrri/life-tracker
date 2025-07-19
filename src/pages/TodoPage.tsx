import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  Input,
  Select,
  useToast,
  Spinner,
  Center,
  Flex,
  Heading,
} from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todosAtom, categoriesAtom } from '@/stores'
import { ROUTES } from '@/constants'
import { Todo, TodoStatus } from '@/types'
import api from '@/services/api'

const TodoPage: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  
  const [todos, setTodos] = useAtom(todosAtom)
  const [categories] = useAtom(categoriesAtom)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<TodoStatus | ''>('')
  const [filterCategory, setFilterCategory] = useState<string>('')

  // Fetch todos
  const { data: todosData, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: () => api.get('/todos'),
  })

  React.useEffect(() => {
    if (todosData?.data) {
      setTodos(todosData.data)
    }
  }, [todosData])

  // Update todo status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ todoId, status }: { todoId: string; status: TodoStatus }) =>
      api.patch(`/todos/${todoId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast({
        title: '할일 상태가 업데이트되었습니다.',
        status: 'success',
        duration: 3000,
      })
    },
  })

  // Delete todo mutation
  const deleteMutation = useMutation({
    mutationFn: (todoId: string) => api.delete(`/todos/${todoId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast({
        title: '할일이 삭제되었습니다.',
        status: 'success',
        duration: 3000,
      })
    },
  })

  // Filter and sort todos
  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.contents.includes(searchTerm) || 
                           todo.memo?.includes(searchTerm)
      const matchesStatus = !filterStatus || todo.status === filterStatus
      const matchesCategory = !filterCategory || todo.categoryId === filterCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())

  const handleStatusChange = (todoId: string, status: TodoStatus) => {
    updateStatusMutation.mutate({ todoId, status })
  }

  const handleDelete = (todoId: string) => {
    if (window.confirm('정말로 이 할일을 삭제하시겠습니까?')) {
      deleteMutation.mutate(todoId)
    }
  }

  const handleView = (todo: Todo) => {
    navigate(ROUTES.TODO_VIEW.replace(':id', todo.id))
  }

  const handleEdit = (todo: Todo) => {
    navigate(ROUTES.TODO_WRITE, { state: { todo } })
  }

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

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">할일 목록</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => navigate(ROUTES.TODO_WRITE)}
          >
            새 할일 추가
          </Button>
        </Flex>

        {/* Search and Filter */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={4}>
                <Box flex={1}>
                  <Input
                    placeholder="할일 내용이나 메모로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}

                  />
                </Box>
              </HStack>
              
              <HStack w="full" spacing={4}>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as TodoStatus | '')}
                  placeholder="상태별 필터"
                >
                  {Object.values(TodoStatus).map(status => (
                    <option key={status} value={status}>{getStatusLabel(status)}</option>
                  ))}
                </Select>
                
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  placeholder="카테고리별 필터"
                >
                  {categories.filter(cat => !cat.removed).map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Todos Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredTodos.map((todo) => {
            const category = categories.find(cat => cat.id === todo.categoryId)
            
            return (
              <Card key={todo.id} cursor="pointer" onClick={() => handleView(todo)}>
                <CardHeader>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                      {todo.contents}
                    </Text>
                    <Badge colorScheme={getStatusColor(todo.status)}>
                      {getStatusLabel(todo.status)}
                    </Badge>
                  </HStack>
                </CardHeader>
                
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    {/* Category */}
                    {category && (
                      <HStack>
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg={category.color}
                        />
                        <Text fontSize="sm">{category.name}</Text>
                      </HStack>
                    )}

                    {/* Date */}
                    <Text fontSize="sm" color="gray.600">
                      {format(new Date(todo.startDateTime), 'yyyy-MM-dd HH:mm', { locale: ko })}
                      {todo.isPeriod && (
                        <> ~ {format(new Date(todo.endDateTime), 'yyyy-MM-dd HH:mm', { locale: ko })}</>
                      )}
                    </Text>

                    {/* Memo */}
                    {todo.memo && (
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {todo.memo}
                      </Text>
                    )}

                    {/* Actions */}
                    <HStack justify="space-between">
                      <Select
                        size="sm"
                        value={todo.status}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleStatusChange(todo.id, e.target.value as TodoStatus)
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {Object.values(TodoStatus).map(status => (
                          <option key={status} value={status}>{getStatusLabel(status)}</option>
                        ))}
                      </Select>
                      
                      <HStack spacing={1}>
                        <IconButton
                          size="sm"
                          aria-label="편집"
                          icon={<EditIcon />}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(todo)
                          }}
                        />
                        <IconButton
                          size="sm"
                          aria-label="삭제"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(todo.id)
                          }}
                        />
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )
          })}
        </SimpleGrid>

        {filteredTodos.length === 0 && (
          <Center py={10}>
            <Text color="gray.500">할일이 없습니다.</Text>
          </Center>
        )}
      </VStack>
    </Box>
  )
}

export default TodoPage 