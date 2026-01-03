import React, { ReactNode } from "react";
import "./Button.scss";

export type ButtonSize = "small" | "large";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "blue"
  | "custom";

interface ButtonProps {
  text: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  type?: "submit" | "reset" | "button";
}

export const Button = ({
  text,
  onClick,
  size = "small",
  variant = "primary",
  icon,
  iconPosition = "left",
  disabled = false,
  fullWidth = false,
  className = "",
  backgroundColor,
  textColor,
  hoverBackgroundColor,
  hoverTextColor,
  type = "button",
}: ButtonProps) => {
  const customStyles =
    variant === "custom"
      ? ({
          "--btn-bg": backgroundColor || "#7c3aed",
          "--btn-color": textColor || "#ffffff",
          "--btn-hover-bg": hoverBackgroundColor || "#6d28d9",
          "--btn-hover-color": hoverTextColor || "#ffffff",

        } as React.CSSProperties)
      : {};

  return (
    <button
      type={type}
      className={`
        button 
        button--${size} 
        button--${variant}
        ${fullWidth ? "button--full-width" : ""}
        ${className}
      `.trim()}
      onClick={onClick}
      disabled={disabled}
      style={customStyles}
    >
      {icon && iconPosition === "left" && (
        <span className="button__icon button__icon--left">{icon}</span>
      )}

      <span className="button__text">{text}</span>

      {icon && iconPosition === "right" && (
        <span className="button__icon button__icon--right">{icon}</span>
      )}
    </button>
  );
};
