import { isDarkModeAtom } from "@/utils/atoms";
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
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
          variant={variant || "solid"}
          size="md"
          width="full"
          justifyContent="flex-start"
          leftIcon={item.icon}
          pl={level * 4 + 3}
          colorScheme={isActive ? "brand" : "gray"}
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
      {/* Sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        w="300px"
        bg={useColorModeValue("white", "gray.800")}
        borderRight="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
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
    </Flex>
  );
};

export default Layout;
