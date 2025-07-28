"use client";

import React, { ChangeEvent, MouseEvent } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";

const ThemeToggle = () => {
  return (
    // <label className="toggle text-base-content">
    <label data-testid="themetoggle" className="swap swap-rotate">
      <input
        data-testid="theme-toggle-check"
        type="checkbox"
        value="light"
        className="theme-controller"
      />
      <IoIosSunny data-testid="sun" size={16} className="swap-off" />
      <IoIosMoon data-testid="moon" size={16} className="swap-on" />
    </label>
  );
};

export default ThemeToggle;
