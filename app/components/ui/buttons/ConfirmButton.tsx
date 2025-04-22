import Confetti from "react-confetti";
import Button from "./Button";
import SuccessIcon from "/public/icons/success.svg";

interface ConfirmButtonProps {
  isProcessing: boolean;
  isSuccess: boolean;
  isDisabled: boolean;
  onClick: () => void;
  disabledText?: string;
  label?: string;
  style?: {};
}

export default function ConfirmButton({
  isProcessing,
  isSuccess,
  isDisabled,
  onClick,
  disabledText,
  label = "CONFIRM",
  style,
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
            : label
        }
        icon={isSuccess ? <SuccessIcon /> : null}
        variant={isSuccess ? "success" : "dark"}
        size="large"
        onClick={onClick}
        disabled={isDisabled}
        {...style}
      />
    </>
  );
}
