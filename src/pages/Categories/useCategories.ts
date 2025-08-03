import { useConfirm } from "@/commons";
import { Category, CategoryFlow, ColorType } from "@/server";
import { OrderInfo } from "@/server/api/command/vo/OrderInfo";
import CategorySeek from "@/server/api/flow/CategorySeek";
import { getErrorMessage } from "@/utils/errors";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "카테고리명을 입력해주세요")
    .max(20, "카테고리명은 20자 이내로 입력해주세요"),
  colorType: z.nativeEnum(ColorType),
  orderNo: z.number().default(1),
});

export const useCategories = (
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  // *** STATE ***
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // *** CHAKRA ***
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // *** HOOKS ***
  const { confirm } = useConfirm();

  // *** FORM ***
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      colorType: ColorType.PASTEL_PINK,
    },
  });

  // *** QUERY ***
  const findCategories = CategorySeek.query.findCategories();
  const { data: categoryData, isLoading } = useQuery(findCategories);

  const { create, remove, modifyOrder, update } = CategoryFlow;
  const queryClient = useQueryClient();

  // *** HANDLER ***
  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      create(data)
        .then((e) => {
          if (e.status === 200) {
            setCategories((prev) => [...prev, e.data]);
            toast({
              status: "success",
              description: "저장되었습니다.",
              isClosable: true,
            });
          }
        })
        .catch((e) => {
          toast({
            status: "error",
            description: getErrorMessage(e),
          });
        });
    } finally {
      queryClient.refetchQueries(findCategories);
      handleClose();
    }
  };

  const handleRemove = (categoryId: string) => {
    confirm({
      type: "warn",
      message: `정말 삭제하시겠습니까?`,
      onOk: () => {
        try {
          remove({ id: categoryId }).then((e) => {
            if (e.status === 200) {
              setCategories((prev) =>
                prev.filter((cat) => cat.id !== categoryId)
              );
              toast({
                status: "success",
                description: "저장되었습니다.",
                isClosable: true,
              });
            }
          });
        } catch (e) {
          toast({
            status: "error",
            description: getErrorMessage(e),
          });
        } finally {
          queryClient.refetchQueries(findCategories);
        }
      },
    });
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    form.reset({
      name: category.name,
      colorType: category.colorType,
      orderNo: category.orderNo,
    });
    onEditOpen();
  };

  const handleEditSubmit = async (data: z.infer<typeof categorySchema>) => {
    if (!editCategory) return;

    try {
      const response = await update({
        id: editCategory.id,
        name: data.name,
        colorType: data.colorType,
        orderNo: data.orderNo,
      });

      if (response.status === 200) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editCategory.id
              ? { ...cat, name: data.name, colorType: data.colorType }
              : cat
          )
        );

        toast({
          status: "success",
          description: "카테고리가 수정되었습니다.",
          isClosable: true,
        });
        onEditClose();
      }
    } catch (e) {
      toast({
        status: "error",
        description: getErrorMessage(e),
      });
    } finally {
      queryClient.invalidateQueries(findCategories);
    }
  };

  const handleEditClose = () => {
    setEditCategory(null);
    form.reset();
    onEditClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleDragEnd = (reorderedCategories: Category[]) => {
    try {
      setCategories(reorderedCategories);

      const orderInfos: OrderInfo[] = reorderedCategories.map(
        (category, index) => ({
          categoryId: category.id,
          orderNo: index + 1,
        })
      );
      modifyOrder({ orderInfos }).then((e) => {
        if (e.status === 200) {
          toast({
            status: "success",
            description: "순서가 변경되었습니다.",
            isClosable: true,
          });
        }
      });
    } catch (e) {
      toast({
        status: "error",
        description: getErrorMessage(e),
      });
    } finally {
      queryClient.invalidateQueries(findCategories);
    }
  };

  // *** USE EFFECT ***
  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData);
    }
  }, [categoryData]);

  return {
    form,
    isOpen,
    isEditOpen,
    onOpen,
    isLoading,
    handleSubmit,
    handleEdit,
    handleEditSubmit,
    handleEditClose,
    handleRemove,
    handleClose,
    handleDragEnd,
  };
};
