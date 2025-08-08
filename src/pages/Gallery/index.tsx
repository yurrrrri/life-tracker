import { Loader } from "@/commons";
import { Image } from "@/server";
// import { ImageFlow } from "@/server/api/flow/ImageFlow"; // TODO: ImageFlow 구현 필요
import { useConfirm, NotFoundText } from "@/commons/ui";
import { galleryImagesAtom, selectedImageAtom } from "@/utils/atoms";
import { formatDateTime } from "@/utils/dates";
import { DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Image as CKImage,
  Flex,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";

export const Gallery = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { confirm } = useConfirm();

  const [galleryImages, setGalleryImages] = useAtom(galleryImagesAtom);
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [filterType, setFilterType] = useState<"all" | "journal">("all");

  // *** QUERY ***
  // TODO: ImageFlow가 구현되면 사용
  // const { remove } = ImageFlow;

  // Fetch gallery images
  const { data: galleryData, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => Promise.resolve({ data: [] }), // 임시로 빈 배열 반환
  });

  React.useEffect(() => {
    if (galleryData?.data) {
      setGalleryImages(galleryData.data);
    }
  }, [galleryData]);

  // Filter images
  const filteredImages = galleryImages.filter((image) => {
    if (filterType === "journal") {
      return image.forJournal;
    }
    return true;
  });

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    onOpen();
  };

  const handleDelete = (imageId: string) => {
    confirm({
      type: "warn",
      message: "정말로 이 이미지를 삭제하시겠습니까?",
      onOk: () => {
        console.log("Delete image:", imageId);
      },
    });
  };

  const handleDownload = (image: Image) => {
    const link = document.createElement("a");
    link.href = `/images/${image.id}`;
    link.download = image.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <Loader />;

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="md" fontFamily="nanum-gothic-bold">갤러리</Heading>
          <HStack spacing={3}>
            <Button
              variant={filterType === "all" ? "solid" : "outline"}
              onClick={() => setFilterType("all")}
            >
              전체
            </Button>
            <Button
              variant={filterType === "journal" ? "solid" : "outline"}
              onClick={() => setFilterType("journal")}
            >
              일기 이미지
            </Button>
          </HStack>
        </Flex>

        {/* Images Grid */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing={4}>
          {filteredImages.map((image) => (
            <Box
              key={image.id}
              position="relative"
              cursor="pointer"
              onClick={() => handleImageClick(image)}
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
            >
              <CKImage
                src={`/images/${image.id}`}
                alt={image.filename}
                borderRadius="md"
                w="full"
                h="200px"
                objectFit="cover"
              />

              {/* Overlay with actions */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.600"
                opacity={0}
                _hover={{ opacity: 1 }}
                transition="opacity 0.2s"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <HStack spacing={2}>
                  <IconButton
                    size="sm"
                    aria-label="다운로드"
                    icon={<DownloadIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                  />
                  <IconButton
                    size="sm"
                    aria-label="삭제"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id);
                    }}
                  />
                </HStack>
              </Box>

              {/* Badge for journal images */}
              {image.forJournal && (
                <Badge
                  position="absolute"
                  top={2}
                  right={2}
                  colorScheme="green"
                  size="sm"
                >
                  일기
                </Badge>
              )}
            </Box>
          ))}
        </SimpleGrid>

        {filteredImages.length === 0 && (
          <NotFoundText text="이미지가 없습니다." />
        )}

        {/* Image Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody p={0}>
              {selectedImage && (
                <VStack spacing={4} p={4}>
                  <CKImage
                    src={`/images/${selectedImage.id}`}
                    alt={selectedImage.filename}
                    maxH="70vh"
                    objectFit="contain"
                  />
                  <VStack spacing={2} w="full">
                    <Text fontWeight="bold">{selectedImage.filename}</Text>
                    <Text fontSize="sm" color="gray.500">
                      업로드:{" "}
                      {formatDateTime(new Date(selectedImage.registeredOn))}
                    </Text>
                    {selectedImage.forJournal && (
                      <Badge colorScheme="green">일기 이미지</Badge>
                    )}
                    <HStack spacing={3}>
                      <Button
                        leftIcon={<DownloadIcon />}
                        onClick={() => handleDownload(selectedImage)}
                      >
                        다운로드
                      </Button>
                      <Button
                        leftIcon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => {
                          handleDelete(selectedImage.id);
                          onClose();
                        }}
                      >
                        삭제
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default Gallery;
