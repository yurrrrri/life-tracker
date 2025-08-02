import {
  authTokenAtom,
  isAuthenticatedAtom,
  lastPasswordAttemptAtom,
  passwordAttemptsAtom,
} from "@/utils/atoms";
import { APP_CONSTANTS } from "@/utils/constants";
import { getErrorMessage } from "@/utils/errors";
import { ROUTES } from "@/utils/routes";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { generateToken, PASSWORD } from "./useToken";

const loginSchema = z.object({
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, setAuthToken] = useAtom(authTokenAtom);
  const [passwordAttempts, setPasswordAttempts] = useAtom(passwordAttemptsAtom);
  const [lastPasswordAttempt, setLastPasswordAttempt] = useAtom(
    lastPasswordAttemptAtom
  );

  const navigate = useNavigate();
  const toast = useToast();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Check if user is already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Check password attempt limits
  React.useEffect(() => {
    const now = Date.now();
    const timeWindow = APP_CONSTANTS.PASSWORD_ATTEMPT_WINDOW;

    if (lastPasswordAttempt && now - lastPasswordAttempt < timeWindow) {
      if (passwordAttempts >= APP_CONSTANTS.PASSWORD_ATTEMPT_LIMIT) {
        const remainingTime = Math.ceil(
          (timeWindow - (now - lastPasswordAttempt)) / 1000 / 60
        );
        toast({
          title: "로그인 제한",
          description: `${remainingTime}분 후에 다시 시도해주세요.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      // Reset attempts if time window has passed
      setPasswordAttempts(0);
      setLastPasswordAttempt(0);
    }
  }, [
    passwordAttempts,
    lastPasswordAttempt,
    toast,
    setPasswordAttempts,
    setLastPasswordAttempt,
  ]);

  const onSubmit = async (_data: LoginFormData) => {
    const now = Date.now();
    const timeWindow = APP_CONSTANTS.PASSWORD_ATTEMPT_WINDOW;

    // Check if user is locked out
    if (lastPasswordAttempt && now - lastPasswordAttempt < timeWindow) {
      if (passwordAttempts >= APP_CONSTANTS.PASSWORD_ATTEMPT_LIMIT) {
        const remainingTime = Math.ceil(
          (timeWindow - (now - lastPasswordAttempt)) / 1000 / 60
        );
        toast({
          title: "로그인 제한",
          description: `${remainingTime}분 후에 다시 시도해주세요.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // 하드코딩된 비밀번호 검증
      const isPasswordCorrect = _data.password === PASSWORD;

      if (isPasswordCorrect) {
        // 실제 토큰 생성 및 설정
        const token = generateToken();
        setAuthToken(token);
        setIsAuthenticated(true);
        setPasswordAttempts(0);
        setLastPasswordAttempt(0);

        toast({
          title: "로그인 성공",
          description: "환영합니다!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate(ROUTES.HOME);
      } else {
        throw new Error("비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      // Increment password attempts
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);
      setLastPasswordAttempt(now);

      if (newAttempts >= APP_CONSTANTS.PASSWORD_ATTEMPT_LIMIT) {
        toast({
          title: "로그인 제한",
          description: "10분 후에 다시 시도해주세요.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "로그인 실패",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const isLockedOut =
    passwordAttempts >= APP_CONSTANTS.PASSWORD_ATTEMPT_LIMIT &&
    lastPasswordAttempt &&
    Date.now() - lastPasswordAttempt < APP_CONSTANTS.PASSWORD_ATTEMPT_WINDOW;

  return (
    <Container maxW="lg" py={12}>
      <VStack spacing={10}>
        <Box
          w="full"
          bg={bg}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          p={10}
          shadow="xl"
        >
          <VStack spacing={8}>
            <VStack spacing={3}>
              <Icon as={FiLock} w={12} h={12} color="brand.500" />
              <Heading size="xl" textAlign="center">
                일기장
              </Heading>
              <Text color="gray.500" textAlign="center" fontSize="lg">
                비밀번호를 입력하여 로그인하세요
              </Text>
            </VStack>

            <Box w="full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel fontSize="lg">비밀번호</FormLabel>
                    <HStack>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요"
                        {...register("password")}
                        disabled={isLockedOut || isLoading}
                        size="lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLockedOut || isLoading}
                      >
                        <Icon as={showPassword ? FiEyeOff : FiEye} />
                      </Button>
                    </HStack>
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    h="50px"
                    fontSize="lg"
                    isLoading={isLoading}
                    loadingText="로그인 중..."
                    disabled={!!isLockedOut}
                  >
                    로그인
                  </Button>
                </VStack>
              </form>
            </Box>

            {isLockedOut && (
              <Text color="red.500" fontSize="md" textAlign="center">
                비밀번호를 5회 틀렸습니다. 10분 후에 다시 시도해주세요.
              </Text>
            )}

            {passwordAttempts > 0 && !isLockedOut && (
              <Text color="orange.500" fontSize="md" textAlign="center">
                남은 시도 횟수:{" "}
                {APP_CONSTANTS.PASSWORD_ATTEMPT_LIMIT - passwordAttempts}회
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;
