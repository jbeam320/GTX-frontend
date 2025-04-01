import { Button } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Confetti from "react-confetti";

interface ConfirmButtonProps {
  isProcessing: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  onClick: () => void;
  disabledText?: string;
}

export function ConfirmButton({
  isProcessing,
  isSuccess,
  isDisabled,
  onClick,
  disabledText,
}: ConfirmButtonProps) {
  return (
    <>
      {isSuccess && <Confetti numberOfPieces={250} recycle={false} />}

      <Button
        disabled={isDisabled}
        onClick={onClick}
        fullWidth
        size="md"
        mt="md"
        className="mt-6 font-mono tracking-wide"
        variant={isSuccess ? "light" : "filled"}
        color={isSuccess ? "gray" : "dark"}
        leftSection={isSuccess ? <IconCheck size={16} /> : null}
        loading={isProcessing}
      >
        {isSuccess
          ? "SUCCESS"
          : isProcessing
          ? "PROCESSING..."
          : isDisabled
          ? disabledText
          : "CONFIRM"}
      </Button>
    </>
  );
}
