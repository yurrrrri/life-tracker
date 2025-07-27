import { getErrorMessage } from "@/utils/errors";
import React, { createContext, useCallback, useContext, useState } from "react";
import { ConfirmDialog } from "./index";

type ConfirmDialogType = "success" | "warn" | "error";

interface ConfirmDialogOptions {
  type?: ConfirmDialogType;
  message: string;
  onOk?: () => void;
}

interface ConfirmDialogContextType {
  confirm: (options: ConfirmDialogOptions) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | null>(
  null
);

interface ConfirmDialogState {
  isOpen: boolean;
  type: ConfirmDialogType;
  message: string;
  onOk: (() => void) | null;
}

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    type: "warn",
    message: "",
    onOk: null,
  });

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    setDialogState({
      isOpen: true,
      type: options.type || "warn",
      message: options.message,
      onOk: options.onOk || null,
    });
  }, []);

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({ ...prev, isOpen: false, onOk: null }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState.onOk) {
      dialogState.onOk();
    }
    setDialogState((prev) => ({ ...prev, isOpen: false, onOk: null }));
  }, [dialogState.onOk]);

  const getColorScheme = () => {
    return dialogState.type === "error" ? "red" : "blue";
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={dialogState.message}
        confirmColorScheme={getColorScheme()}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirm = (): ConfirmDialogContextType => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    getErrorMessage("");
  }
  return context!;
};
