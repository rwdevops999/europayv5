"use client";

import { useTheme } from "@/hooks/use-theme";
import React, { ChangeEvent, MouseEvent } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const handleClick = (): void => {
    const element: HTMLInputElement = document.getElementById(
      "themecheck"
    ) as HTMLInputElement;

    setTheme(element.checked ? "dark" : "light");
  };

  return (
    <label data-testid="themetoggle" className="swap swap-rotate">
      <input
        id="themecheck"
        data-testid="theme-toggle-check"
        type="checkbox"
        value="light"
        className="theme-controller"
      />
      <IoIosSunny
        data-testid="sun"
        size={16}
        className="swap-off"
        onClick={handleClick}
      />
      <IoIosMoon
        data-testid="moon"
        size={16}
        className="swap-on"
        onClick={handleClick}
      />
    </label>
  );
};

export default ThemeToggle;
