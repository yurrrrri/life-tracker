import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Grid,
  GridItem,
  useColorModeValue,
  IconButton,
  Badge,
  Flex,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,

} from '@chakra-ui/react'
import {
  FiPlus,
  FiBook,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
} from 'react-icons/fi'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ROUTES } from '@/constants'
import { currentDateAtom, selectedDateAtom, journalsAtom, todosAtom, categoriesAtom } from '@/stores'
import { formatDate, isDateFuture, isServiceDate } from '@/utils'

const HomePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom)
  const [journals] = useAtom(journalsAtom)
  const [todos] = useAtom(todosAtom)
  const [categories] = useAtom(categoriesAtom)
  
  const navigate = useNavigate()

  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(formatDate(today))
  }

  const handleDateClick = (date: Date) => {
    const dateString = formatDate(date)
    
    // Don't allow future dates
    if (isDateFuture(date)) {
      return
    }
    
    // Check if date is within service period
    if (!isServiceDate(dateString)) {
      return
    }
    
    setSelectedDate(dateString)
  }

  const getCalendarDays = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })
    
    // Add padding days to start from Sunday
    const firstDay = start.getDay()
    const paddingDays = Array.from({ length: firstDay }, (_, i) => {
      const date = new Date(start)
      date.setDate(date.getDate() - (firstDay - i))
      return date
    })
    
    return [...paddingDays, ...days]
  }

  const getJournalForDate = (date: Date) => {
    const dateString = formatDate(date)
    return journals.find(journal => journal.date === dateString)
  }

  const getTodosForDate = (date: Date) => {
    const dateString = formatDate(date)
    return todos.filter(todo => {
      const todoDate = formatDate(new Date(todo.startDateTime))
      return todoDate === dateString
    })
  }

  const getCategoryForTodo = (categoryId: string) => {
    return categories.find(category => category.id === categoryId)
  }

  const renderCalendarDay = (date: Date, index: number) => {
    const isCurrentMonth = isSameMonth(date, currentDate)
    const isSelected = selectedDate === formatDate(date)
    const isTodayDate = isToday(date)
    const isFutureDate = isDateFuture(date)
    const isServiceDateValid = isServiceDate(formatDate(date))
    
    const journal = getJournalForDate(date)
    const todos = getTodosForDate(date)
    
    const dayBg = useColorModeValue(
      isSelected ? 'brand.100' : isTodayDate ? 'blue.50' : 'transparent',
      isSelected ? 'brand.900' : isTodayDate ? 'blue.900' : 'transparent'
    )
    
    const dayColor = useColorModeValue(
      isCurrentMonth ? 'gray.800' : 'gray.400',
      isCurrentMonth ? 'white' : 'gray.500'
    )

    return (
      <Box
        key={index}
        p={3}
        h="100px"
        bg={dayBg}
        border="1px"
        borderColor={borderColor}
        cursor={isCurrentMonth && !isFutureDate && isServiceDateValid ? 'pointer' : 'default'}
        onClick={() => handleDateClick(date)}
        position="relative"
        _hover={
          isCurrentMonth && !isFutureDate && isServiceDateValid
            ? { bg: useColorModeValue('gray.50', 'gray.700') }
            : {}
        }
      >
        <Text
          fontSize="md"
          fontWeight={isTodayDate ? 'bold' : 'normal'}
          color={dayColor}
          mb={2}
        >
          {format(date, 'd')}
        </Text>
        
        <VStack spacing={1} align="start">
          {journal && (
            <Badge size="md" colorScheme="green" variant="subtle">
              일기
            </Badge>
          )}
          {todos.slice(0, 2).map((todo, todoIndex) => {
            const category = getCategoryForTodo(todo.categoryId)
            return (
              <Badge
                key={todoIndex}
                size="md"
                colorScheme="blue"
                variant="subtle"
                bg={category?.color || 'blue.100'}
                color="white"
                fontSize="xs"
              >
                {todo.contents}
              </Badge>
            )
          })}
          {todos.length > 2 && (
            <Badge size="md" colorScheme="gray" variant="subtle">
              +{todos.length - 2}
            </Badge>
          )}
        </VStack>
      </Box>
    )
  }

  const quickActions = [
    {
      label: '일기 작성',
      icon: <FiBook />,
      path: ROUTES.JOURNAL_WRITE,
      color: 'green',
    },
    {
      label: '할 일 추가',
      icon: <FiCheckSquare />,
      path: ROUTES.TODO_WRITE,
      color: 'blue',
    },
    {
      label: '갤러리 보기',
      icon: <FiCalendar />,
      path: ROUTES.GALLERY,
      color: 'purple',
    },
  ]

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Heading size="xl">홈</Heading>
        <Button onClick={goToToday} size="md" variant="outline">
          오늘
        </Button>
      </Flex>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <Heading size="lg">빠른 작업</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {quickActions.map((action) => (
              <Button
                key={action.path}
                leftIcon={action.icon}
                colorScheme={action.color}
                variant="outline"
                onClick={() => navigate(action.path)}
                h="80px"
                fontSize="lg"
              >
                {action.label}
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="lg">캘린더</Heading>
            <HStack spacing={3}>
              <IconButton
                aria-label="Previous month"
                icon={<FiChevronLeft />}
                onClick={goToPreviousMonth}
                size="md"
                variant="ghost"
              />
              <Text fontWeight="bold" minW="150px" textAlign="center" fontSize="lg">
                {format(currentDate, 'yyyy년 M월', { locale: ko })}
              </Text>
              <IconButton
                aria-label="Next month"
                icon={<FiChevronRight />}
                onClick={goToNextMonth}
                size="md"
                variant="ghost"
              />
            </HStack>
          </Flex>
        </CardHeader>
        <CardBody>
          {/* Calendar Header */}
          <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={3}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
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
            {getCalendarDays().map((date, index) => renderCalendarDay(date, index))}
          </Grid>
        </CardBody>
      </Card>

      {/* Selected Date Info */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <Heading size="lg">{formatDate(selectedDate, 'yyyy년 M월 d일')}</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={3} fontSize="lg">일기</Text>
                {getJournalForDate(new Date(selectedDate)) ? (
                  <Button
                    leftIcon={<FiBook />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => navigate(`${ROUTES.JOURNAL_VIEW.replace(':id', 'temp')}`)}
                    size="md"
                  >
                    일기 보기
                  </Button>
                ) : (
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="green"
                    variant="outline"
                    onClick={() => navigate(ROUTES.JOURNAL_WRITE)}
                    size="md"
                  >
                    일기 작성
                  </Button>
                )}
              </Box>

              <Box>
                <Text fontWeight="bold" mb={3} fontSize="lg">할 일</Text>
                {getTodosForDate(new Date(selectedDate)).length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {getTodosForDate(new Date(selectedDate)).map((todo) => {
                      const category = getCategoryForTodo(todo.categoryId)
                      return (
                        <Box
                          key={todo.id}
                          p={3}
                          border="1px"
                          borderColor={borderColor}
                          borderRadius="md"
                          bg={category?.color || 'gray.100'}
                        >
                          <Text fontSize="md">{todo.contents}</Text>
                        </Box>
                      )
                    })}
                  </VStack>
                ) : (
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => navigate(ROUTES.TODO_WRITE)}
                    size="md"
                  >
                    할 일 추가
                  </Button>
                )}
              </Box>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}

export default HomePage 