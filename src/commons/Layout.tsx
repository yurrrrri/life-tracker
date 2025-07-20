import { ROUTES } from "@/constants/data";
import { isDarkModeAtom } from "@/utils/atoms";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";
import {
  FiBarChart,
  FiBook,
  FiCalendar,
  FiCheckSquare,
  FiHome,
  FiImage,
  FiMenu,
  FiMoon,
  FiPenTool,
  FiSettings,
  FiSun,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactElement;
  path: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "홈",
    icon: <FiHome />,
    path: ROUTES.HOME,
  },
  {
    label: "일기",
    icon: <FiBook />,
    path: ROUTES.JOURNAL,
  },
  {
    label: "투두리스트",
    icon: <FiCheckSquare />,
    path: ROUTES.TODO,
  },
  {
    label: "필사노트",
    icon: <FiPenTool />,
    path: ROUTES.SENTENCE,
  },
  {
    label: "갤러리",
    icon: <FiImage />,
    path: ROUTES.GALLERY,
  },
  {
    label: "통계",
    icon: <FiBarChart />,
    path: ROUTES.STATS,
  },
  {
    label: "설정",
    icon: <FiSettings />,
    path: ROUTES.SETTINGS,
    children: [
      {
        label: "프로필",
        icon: <FiUser />,
        path: ROUTES.PROFILE,
      },
      {
        label: "카테고리",
        icon: <FiTag />,
        path: ROUTES.CATEGORIES,
      },
      {
        label: "특별한 날",
        icon: <FiCalendar />,
        path: ROUTES.ANNIVERSARIES,
      },
    ],
  },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleColorModeToggle = () => {
    toggleColorMode();
    setIsDarkMode(!isDarkMode);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const renderNavItem = (
    item: NavItem,
    level: number = 0,
    variant?: string
  ) => {
    const isActiveItem = isActive(item.path);
    const paddingLeft = level * 4 + 3;

    return (
      <Box key={item.path}>
        <Button
          variant={variant || "solid"}
          size="md"
          width="full"
          justifyContent="flex-start"
          leftIcon={item.icon}
          pl={paddingLeft}
          colorScheme={isActiveItem ? "brand" : "gray"}
          onClick={() => {
            navigate(item.path);
            onClose();
          }}
          fontSize="sm"
          fontFamily="Hahmlet"
          fontWeight={300}
        >
          {item.label}
        </Button>
        {item.children && (
          <VStack spacing={0} align="stretch" mt={2}>
            {item.children.map((child) =>
              renderNavItem(child, level + 1, "ghost")
            )}
          </VStack>
        )}
      </Box>
    );
  };

  return (
    <Flex w="1500px" h="100vh">
      {/* Desktop Sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        w="300px"
        bg={bg}
        borderRight="1px"
        borderColor={borderColor}
        py={6}
      >
        <VStack spacing={6} align="stretch">
          {isDarkMode ? (
            <img
              src="life-tracker-dark-mode.png"
              width={225}
              style={{ margin: "auto", cursor: "pointer" }}
              onClick={handleGoHome}
            />
          ) : (
            <img
              src="life-tracker.png"
              width={220}
              style={{ margin: "auto", marginBottom: 4, cursor: "pointer" }}
              onClick={handleGoHome}
            />
          )}
          <Divider />
          <VStack spacing={3} align="stretch" px={5} height="100%">
            {navItems.map((item) => renderNavItem(item))}
          </VStack>
          <Box px={5} mb={10}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={handleColorModeToggle}
              variant="outline"
              size="sm"
            />
          </Box>
        </VStack>
      </Box>

      {/* Mobile Header */}
      <Box display={{ base: "block", md: "none" }} w="full">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px={5}
          py={3}
          bg={bg}
          borderBottom="1px"
          borderColor={borderColor}
        >
          <Text fontSize="xl" fontWeight="bold" color="brand.500">
            LIFE TRACKER
          </Text>
          <HStack spacing={3}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={handleColorModeToggle}
              variant="ghost"
              size="md"
            />
            <IconButton
              aria-label="Open menu"
              icon={<FiMenu />}
              onClick={onOpen}
              variant="ghost"
              size="md"
            />
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box
        flex="1"
        overflow="auto"
        pt={{ base: 0, md: 0 }}
        px={{ base: 6, md: 8 }}
        py={{ base: 6, md: 8 }}
        display="flex"
        justifyContent="center"
      >
        <Box w="full" maxW="1500px">
          {children}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>메뉴</DrawerHeader>
          <DrawerBody>
            <VStack spacing={2} align="stretch">
              {navItems.map((item) => renderNavItem(item))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Layout;
