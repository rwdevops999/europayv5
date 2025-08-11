import React, { JSX, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/functions";

const button = cva("btn", {
  variants: {
    intent: {
      neutral: "btn-neutral",
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      info: "btn-info",
      warning: "btn-warning",
      error: "btn-error",
      success: "btn-success",
    },
    size: {
      extrasmall: "btn-xs",
      small: "btn-sm",
      medium: "btn-md",
      large: "btn-lg",
      extralarge: "btn-xl",
    },
    style: {
      outline: "btn-outline",
      ghost: "btn-ghost",
      soft: "btn-soft",
      link: "btn-link",
    },
    behaviour: {
      active: "btn-active",
      disabled: "btn-disabled",
    },
    modifier: {
      square: "btn-square",
      circle: "btn-circle",
    },
  },
  compoundVariants: [
    // {
    //   intent: "primary",
    //   // disabled: false,
    //   class: "hover:bg-blue-600",
    // },
    // {
    //   intent: "secondary",
    //   // disabled: false,
    //   class: "hover:bg-red-500",
    // },
    // { intent: "primary", size: "medium", class: "uppercase" },
  ],
  defaultVariants: {
    intent: "neutral",
    size: "medium",
    style: "ghost",
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style">,
    VariantProps<typeof button> {
  icon?: ReactNode;
  iconFirst?: boolean;
  comp?: JSX.Element;
}

const Button = ({
  id,
  className,
  name,
  intent,
  size,
  style,
  behaviour,
  modifier,
  icon,
  iconFirst = true,
  ...props
}: ButtonProps) => (
  <button
    id={id}
    className={cn(
      "btn",
      button({ intent, size, style, behaviour, modifier }),
      className
    )}
    // disabled={modifier || undefined}
    {...props}
  >
    {props.comp && <>{props.comp}</>}
    {!props.comp && (
      <>
        {iconFirst && <>{icon}</>}
        {name}
        {!iconFirst && <>{icon}</>}
      </>
    )}
  </button>
);

export default Button;
