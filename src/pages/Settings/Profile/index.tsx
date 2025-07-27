import { Loader } from "@/commons";
import { ProfileFlow } from "@/server/api/flow/ProfileFlow";
import ProfileSeek from "@/server/api/flow/ProfileSeek";
import { profileAtom } from "@/utils/atoms";
import { formatDate } from "@/utils/dates";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  phoneNumber: z.string().min(1, "전화번호를 입력해주세요"),
  remark: z.string().max(200, "비고는 200자 이내로 입력해주세요"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const Profile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [profile, setProfile] = useAtom(profileAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // *** QUERY ***
  const { changeName } = ProfileFlow;

  const findProfile = ProfileSeek.query.findProfile({ id: "current" });
  const { data: profileData, isLoading } = useQuery(findProfile);

  React.useEffect(() => {
    if (profileData && profileData.length > 0) {
      setProfile(profileData[0]);
    }
  }, [profileData]);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile
      ? {
          name: profile.name,
          birthDate: profile.birthDate,
          phoneNumber: profile.phoneNumber,
          remark: profile.remark,
        }
      : {
          name: "",
          birthDate: "",
          phoneNumber: "",
          remark: "",
        },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (!profile) return;
      
      changeName({ id: profile.id, name: data.name }).then((e) => {
        if (e.status === 200) {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast({
            title: "프로필이 업데이트되었습니다.",
            status: "success",
            duration: 3000,
          });
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Heading size="md">프로필</Heading>

        {/* Profile Info */}
        {profile && (
          <Card>
            <CardHeader>
              <HStack spacing={4}>
                <Avatar size="lg" name={profile.name} />
                <VStack align="start" spacing={1}>
                  <Heading size="md">{profile.name}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    가입일: {formatDate(new Date(profile.registeredOn))}
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">생년월일</Text>
                  <Text>{formatDate(new Date(profile.birthDate))}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">전화번호</Text>
                  <Text>{profile.phoneNumber}</Text>
                </HStack>
                {profile.remark && (
                  <HStack justify="space-between">
                    <Text fontWeight="bold">비고</Text>
                    <Text>{profile.remark}</Text>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <Heading size="md">프로필 수정</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>이름</FormLabel>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="이름을 입력하세요" {...field} />
                    )}
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">
                      {errors.name.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.birthDate}>
                  <FormLabel>생년월일</FormLabel>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => <Input type="date" {...field} />}
                  />
                  {errors.birthDate && (
                    <Text color="red.500" fontSize="sm">
                      {errors.birthDate.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.phoneNumber}>
                  <FormLabel>전화번호</FormLabel>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="전화번호를 입력하세요" {...field} />
                    )}
                  />
                  {errors.phoneNumber && (
                    <Text color="red.500" fontSize="sm">
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.remark}>
                  <FormLabel>한 마디</FormLabel>
                  <Controller
                    name="remark"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="하고 싶은 말을 남겨 보세요."
                        rows={3}
                        {...field}
                      />
                    )}
                  />
                  {errors.remark && (
                    <Text color="red.500" fontSize="sm">
                      {errors.remark.message}
                    </Text>
                  )}
                </FormControl>

                <HStack justify="flex-end" w="full" spacing={3}>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    loadingText="저장 중..."
                    isDisabled={!isDirty}
                  >
                    프로필 저장
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Profile;
