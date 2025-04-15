import React from "react";

type variants =
  | "dark"
  | "light"
  | "primary"
  | "secondary"
  | "disabled"
  | "success";

interface ButtonProps {
  label?: string;
  variant?: variants;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  icon2?: React.ReactNode;
  isRounded?: boolean;
  size?: "small" | "medium" | "large";
  width?: string;
  height?: string;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant,
  onClick,
  disabled = false,
  icon,
  icon2,
  isRounded = false,
  width,
  height,
  size = "small",
  ...restProps
}) => {
  let buttonClass =
    "px-[18px] py-[10px] font-fira-code flex items-center justify-center";
  let textColor = "var(--color-black)";
  let bgColor = "var(--color-light)";
  let border = `1px solid var(--border-dark)`;
  let fontSize = "14px";

  const borderRadius = isRounded ? "rounded-[16px]" : `rounded-[8px]`;

  // Button size
  if (size === "small") {
    fontSize = "14px";
  } else if (size === "medium") {
    fontSize = "18px";
    width = "166px";
    height = "43px";
  } else if (size === "large") {
    fontSize = "18px";
    width = "366px";
    height = "60px";
  }

  // Button styles (handling both background and text colors)
  switch (variant) {
    case "dark":
      bgColor = "var(--bg-dark)";
      textColor = "var(--color-light)";
      border = "1px solid var(--bg-dark)";
      break;
    case "light":
      bgColor = "var(--bg-light)";
      textColor = "var(--color-black)";
      border = "1px solid var(--color-success)";
      break;
    case "success":
      bgColor = "var(--bg-dark)";
      textColor = "var(--color-success)";
      border = "1px solid var(--bg-dark)";
      break;
    case "primary":
      bgColor = "var(--bg-primary)";
      textColor = "var(--color-primary)";
      border = "1px solid var(--border-dark)";
      break;
    case "secondary":
      bgColor = "var(--bg-secondary)";
      textColor = "var(--color-primary)";
      border = "1px solid var(--color-primary)";
      break;
    case "disabled":
      bgColor = size === "large" ? "var(--bg-dark-10)" : "var(--bg-light)";
      textColor =
        size === "large" ? "var(--color-light)" : "var(--color-disabled)";
      border = size !== "large" ? "1px solid var(--border-dark)" : "none";
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`${buttonClass} ${borderRadius} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } cursor-pointer`}
      disabled={disabled}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        color: textColor,
        border,
        fontSize,
        ...restProps,
      }}
    >
      {icon && <span className="mr-[10px]">{icon}</span>}
      {label}
      {icon2 && <span className="ml-[10px]">{icon2}</span>}
    </button>
  );
};

export default Button;
