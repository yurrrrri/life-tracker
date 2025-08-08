import { isDarkModeAtom } from "@/utils/atoms";
import {
  Box,
  Button,
  Flex,
  IconButton,
  useColorMode,
  useDisclosure,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { NavItem, navItems } from "./navigation";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  // *** ATOM
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);

  // *** CHAKRA ***
  const { onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  // *** HOOKS ***
  const navigate = useNavigate();
  const location = useLocation();

  // *** HANDLER ***
  const handleColorModeToggle = () => {
    toggleColorMode();
    setIsDarkMode(!isDarkMode);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  // *** RENDER ***
  const renderNavItem = (
    item: NavItem,
    level: number = 0,
    variant?: string
  ) => {
    const path = item.path;
    const isActive =
      location.pathname === path || location.pathname.startsWith(path + "/");

    return (
      <Box key={item.path}>
        <Button
          variant={variant || "ghost"}
          size="md"
          width="full"
          justifyContent="flex-start"
          leftIcon={item.icon}
          pl={level * 4 + 4}
          pr={4}
          py={3}
          colorScheme={isActive ? "blue" : "gray"}
          onClick={() => {
            navigate(item.path);
            onClose();
          }}
          fontSize="sm"
          fontWeight={isActive ? "semibold" : "medium"}
          borderRadius="lg"
          _hover={{
            bg: isActive ? "blue.50" : "gray.50",
          }}
          _active={{
            bg: isActive ? "blue.100" : "gray.100",
          }}
          transition="all 0.2s"
        >
          {item.label}
        </Button>
        {item.children && (
          <VStack spacing={1} align="stretch" mt={2} ml={4}>
            {item.children.map((child) =>
              renderNavItem(child, level + 1, "ghost")
            )}
          </VStack>
        )}
      </Box>
    );
  };

  return (
    <Flex w="full" h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        w="280px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        shadow="sm"
        position="relative"
        zIndex={10}
      >
        <VStack spacing={0} align="stretch" h="full">
          {/* Logo Section */}
          <Box p={6} borderBottom="1px solid" borderColor="gray.100">
            <HStack
              ml={4}
              cursor="pointer"
              onClick={handleGoHome}
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.2s"
            >
              {isDarkMode ? (
                <img
                  src="life-tracker-dark-mode.png"
                  width={200}
                  alt="Life Tracker"
                />
              ) : (
                <img src="life-tracker.png" width={200} alt="Life Tracker" />
              )}
            </HStack>
          </Box>

          {/* Navigation */}
          <Box flex="1" p={4} overflowY="auto">
            <VStack spacing={2} align="stretch">
              {navItems.map((item) => renderNavItem(item))}
            </VStack>
          </Box>

          {/* Footer */}
          <Box p={4} borderTop="1px solid" borderColor="gray.100">
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {colorMode === "light" ? "라이트" : "다크"} 모드
              </Text>
              <IconButton
                aria-label="Toggle color mode"
                icon={
                  colorMode === "light" ? (
                    <FiMoon size={16} />
                  ) : (
                    <FiSun size={16} />
                  )
                }
                onClick={handleColorModeToggle}
                variant="ghost"
                size="sm"
                colorScheme="gray"
                borderRadius="lg"
                _hover={{
                  bg: "gray.100",
                }}
              />
            </HStack>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflow="auto" bg="gray.50" position="relative">
        <Box w="full" maxW="1100px" mx="auto" px={8} py={{ base: 6, md: 8 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;
