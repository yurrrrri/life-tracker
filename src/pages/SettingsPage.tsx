import api from "@/services/api";
import { fontTypeAtom, isDarkModeAtom, settingsAtom } from "@/stores";
import { FontType } from "@/types";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const settingsSchema = z.object({
  password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다"),
  notificationTime: z.string(),
  isDark: z.boolean(),
  fontType: z.nativeEnum(FontType),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useAtom(settingsAtom);
  const [, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [, setFontType] = useAtom(fontTypeAtom);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
  });

  React.useEffect(() => {
    if (settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings
      ? {
          password: settings.password,
          notificationTime: settings.notificationTime,
          isDark: settings.isDark,
          fontType: settings.fontType,
        }
      : {
          password: "",
          notificationTime: "09:00",
          isDark: false,
          fontType: "DEFAULT" as FontType,
        },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: SettingsFormData) => api.put("/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "설정이 저장되었습니다.",
        status: "success",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "설정 저장에 실패했습니다.",
        status: "error",
        duration: 3000,
      });
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      await updateSettingsMutation.mutateAsync(data);
      setIsDarkMode(data.isDark);
      setFontType(data.fontType);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFontTypeLabel = (fontType: FontType) => {
    switch (fontType) {
      case "DEFAULT":
        return "기본";
      case "SERIF":
        return "명조체";
      case "MONOSPACE":
        return "고정폭";
      default:
        return fontType;
    }
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Heading size="lg">설정</Heading>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {/* Security Settings */}
            <Card>
              <CardHeader>
                <Heading size="md">보안 설정</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>비밀번호 변경</FormLabel>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="password"
                          placeholder="새 비밀번호를 입력하세요"
                          {...field}
                        />
                      )}
                    />
                    {errors.password && (
                      <Text color="red.500" fontSize="sm">
                        {errors.password.message}
                      </Text>
                    )}
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <Heading size="md">알림 설정</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>일기 작성 알림 시간</FormLabel>
                    <Controller
                      name="notificationTime"
                      control={control}
                      render={({ field }) => <Input type="time" {...field} />}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <Heading size="md">화면 설정</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>다크 모드</FormLabel>
                    <Controller
                      name="isDark"
                      control={control}
                      render={({ field }) => (
                        <HStack>
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                          <Text>다크 모드를 사용합니다</Text>
                        </HStack>
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>글꼴 설정</FormLabel>
                    <Controller
                      name="fontType"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          {Object.values(FontType).map((fontType) => (
                            <option key={fontType} value={fontType}>
                              {getFontTypeLabel(fontType)}
                            </option>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <Heading size="md">데이터 관리</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Alert status="info">
                    <AlertIcon />
                    <Text fontSize="sm">
                      데이터 백업 및 복원 기능은 추후 업데이트 예정입니다.
                    </Text>
                  </Alert>

                  <HStack spacing={4}>
                    <Button variant="outline" isDisabled>
                      데이터 내보내기
                    </Button>
                    <Button variant="outline" isDisabled>
                      데이터 가져오기
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Save Button */}
            <Card>
              <CardBody>
                <HStack justify="flex-end" spacing={3}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="저장 중..."
                    isDisabled={!isDirty}
                  >
                    설정 저장
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
