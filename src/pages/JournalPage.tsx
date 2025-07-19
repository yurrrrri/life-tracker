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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
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
import { AddIcon } from '@chakra-ui/icons'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { journalsAtom } from '@/stores'
import { ROUTES } from '@/constants'
import { Journal, Weather, Feeling } from '@/types'
import { WEATHER_ICONS, WEATHER_LABELS, FEELING_ICONS, FEELING_LABELS } from '@/constants'
import api from '@/services/api'

const JournalPage: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [journals, setJournals] = useAtom(journalsAtom)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterWeather, setFilterWeather] = useState<Weather | ''>('')
  const [filterFeeling, setFilterFeeling] = useState<Feeling | ''>('')
  const [sortBy, setSortBy] = useState<'date' | 'feeling'>('date')

  // Fetch journals
  const { data: journalsData, isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => api.get('/journals'),
  })

  React.useEffect(() => {
    if (journalsData?.data) {
      setJournals(journalsData.data)
    }
  }, [journalsData])

  // Delete journal mutation
  const deleteMutation = useMutation({
    mutationFn: (journalId: string) => api.delete(`/journals/${journalId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] })
      toast({
        title: '일기가 삭제되었습니다.',
        status: 'success',
        duration: 3000,
      })
    },
    onError: () => {
      toast({
        title: '일기 삭제에 실패했습니다.',
        status: 'error',
        duration: 3000,
      })
    },
  })

  // Filter and sort journals
  const filteredJournals = journals
    .filter(journal => {
      const matchesSearch = journal.contents?.includes(searchTerm) || 
                           journal.memo?.includes(searchTerm)
      const matchesWeather = !filterWeather || journal.weather === filterWeather
      const matchesFeeling = !filterFeeling || journal.feeling === filterFeeling
      
      return matchesSearch && matchesWeather && matchesFeeling
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return a.feeling.localeCompare(b.feeling)
      }
    })

  const handleDelete = (journalId: string) => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      deleteMutation.mutate(journalId)
    }
  }

  const handleView = (journal: Journal) => {
    navigate(ROUTES.JOURNAL_VIEW.replace(':id', journal.id))
  }

  const handleEdit = (journal: Journal) => {
    navigate(ROUTES.JOURNAL_WRITE, { state: { journal } })
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
          <Heading size="lg">일기 목록</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => navigate(ROUTES.JOURNAL_WRITE)}
          >
            새 일기 작성
          </Button>
        </Flex>

        {/* Search and Filter */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={4}>
                <Box flex={1}>
                  <Input
                    placeholder="일기 내용이나 메모로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}

                  />
                </Box>
                <Button onClick={onOpen}>
                  필터
                </Button>
              </HStack>
              
              <HStack w="full" spacing={4}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'feeling')}
                >
                  <option value="date">날짜순</option>
                  <option value="feeling">감정순</option>
                </Select>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Journals Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredJournals.map((journal) => {
            const WeatherIcon = journal.weather ? WEATHER_ICONS[journal.weather] : null
            const FeelingIcon = FEELING_ICONS[journal.feeling]
            
            return (
              <Card key={journal.id} cursor="pointer" onClick={() => handleView(journal)}>
                <CardHeader>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" fontSize="lg">
                      {format(new Date(journal.date), 'yyyy년 MM월 dd일', { locale: ko })}
                    </Text>
                    <HStack spacing={2}>
                      {journal.locked && <Badge colorScheme="red">잠금</Badge>}
                      {journal.saved && <Badge colorScheme="green">저장됨</Badge>}
                    </HStack>
                  </HStack>
                </CardHeader>
                
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    {/* Weather and Feeling */}
                    <HStack justify="space-between">
                      {WeatherIcon && (
                        <HStack>
                          <WeatherIcon />
                          <Text fontSize="sm">{WEATHER_LABELS[journal.weather!]}</Text>
                        </HStack>
                      )}
                      <HStack>
                        <FeelingIcon />
                        <Text fontSize="sm">{FEELING_LABELS[journal.feeling]}</Text>
                      </HStack>
                    </HStack>

                    {/* Contents Preview */}
                    {journal.contents && (
                      <Text noOfLines={3} fontSize="sm" color="gray.600">
                        {journal.contents}
                      </Text>
                    )}

                    {/* Memo */}
                    {journal.memo && (
                      <Text fontSize="xs" color="gray.500" fontStyle="italic">
                        {journal.memo}
                      </Text>
                    )}

                    {/* Actions */}
                    <HStack justify="flex-end" spacing={2}>
                      <IconButton
                        size="sm"
                        aria-label="편집"
                        icon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(journal)
                        }}
                      />
                      <IconButton
                        size="sm"
                        aria-label="삭제"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(journal.id)
                        }}
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )
          })}
        </SimpleGrid>

        {filteredJournals.length === 0 && (
          <Center py={10}>
            <Text color="gray.500">일기가 없습니다.</Text>
          </Center>
        )}
      </VStack>

      {/* Filter Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>필터 설정</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2}>날씨</Text>
                <Select
                  value={filterWeather}
                  onChange={(e) => setFilterWeather(e.target.value as Weather | '')}
                >
                  <option value="">전체</option>
                  {Object.entries(WEATHER_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Select>
              </Box>
              
              <Box w="full">
                <Text mb={2}>감정</Text>
                <Select
                  value={filterFeeling}
                  onChange={(e) => setFilterFeeling(e.target.value as Feeling | '')}
                >
                  <option value="">전체</option>
                  {Object.entries(FEELING_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Select>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default JournalPage 