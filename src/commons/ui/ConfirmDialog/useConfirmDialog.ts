import { useDisclosure } from "@chakra-ui/react";
import { useCallback, useState } from "react";

interface ConfirmDialogOptions {
  message?: string;
  confirmColorScheme?: string;
}

interface ConfirmDialogReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  confirm: (options?: ConfirmDialogOptions) => Promise<boolean>;
  message: string;
  confirmColorScheme: string;
  onConfirm: () => void;
}

export const useConfirmDialog = (): ConfirmDialogReturn => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);
  const [dialogOptions, setDialogOptions] = useState<ConfirmDialogOptions>({});

  const confirm = useCallback(
    (options: ConfirmDialogOptions = {}): Promise<boolean> => {
      return new Promise((resolve) => {
        setResolveRef(() => resolve);
        setDialogOptions(options);
        onOpen();
      });
    },
    [onOpen]
  );

  const handleConfirm = useCallback(() => {
    if (resolveRef) {
      resolveRef(true);
      setResolveRef(null);
    }
    onClose();
  }, [resolveRef, onClose]);

  const handleClose = useCallback(() => {
    if (resolveRef) {
      resolveRef(false);
      setResolveRef(null);
    }
    onClose();
  }, [resolveRef, onClose]);

  return {
    isOpen,
    onOpen,
    confirm,
    onConfirm: handleConfirm,
    onClose: handleClose,
    message: dialogOptions.message || "정말로 진행하시겠습니까?",
    confirmColorScheme: dialogOptions.confirmColorScheme || "red",
  };
};
