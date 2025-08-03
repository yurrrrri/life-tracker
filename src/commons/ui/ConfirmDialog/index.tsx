import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  confirmColorScheme?: string;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message = "정말로 진행하시겠습니까?",
  confirmColorScheme = "blue",
}: ConfirmDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogBody mt={3} fontFamily="hahmlet" fontWeight={500}>
            {message}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme={confirmColorScheme}
              onClick={handleConfirm}
              mr={2}
            >
              확인
            </Button>
            <Button ref={cancelRef} variant="outline" onClick={onClose}>
              닫기
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { ConfirmDialogProvider, useConfirm } from "./ConfirmDialogProvider";
export { useConfirmDialog } from "./useConfirmDialog";
export default ConfirmDialog;
