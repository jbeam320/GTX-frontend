import Button from "./Button";
import Confetti from "react-confetti";
import SuccessIcon from "/public/icons/success.svg";
import { getFontSize } from "@mantine/core";

interface ConfirmButtonProps {
  isProcessing: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  onClick: () => void;
  disabledText?: string;
}

export default function ConfirmButton({
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
        label={
          isSuccess
            ? "SUCCESS"
            : isProcessing
            ? "PROCESSING..."
            : isDisabled
            ? disabledText
            : "CONFIRM"
        }
        icon={isSuccess ? <SuccessIcon /> : null}
        variant={isSuccess ? "success" : "dark"}
        size="large"
        onClick={onClick}
        disabled={isDisabled}
      />
    </>
  );
}
