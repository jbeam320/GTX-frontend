"use client";

import React, { useState } from "react";
import Button from "../buttons/Button";
import ArrowDownIcon from "/public/icons/arrow-down.svg";

interface Option {
  label: string;
  value: string;
}

interface DropdownMenuProps {
  options: Option[];
  selectedOption: Option;
  setOption?: (value: Option) => void;
  [key: string]: any;
}

const dropdownStyle = {
  border: "1px solid var(--border-black-15)",
  width: "167px",
  height: "40px",
  borderRadius: "8px",
  borderWidth: "1px",
  paddingTop: "8px",
  paddingRight: "10px",
  paddingBottom: "8px",
  paddingLeft: "10px",
  gap: "13px",
  fontSize: "12px",
  fontWeight: "400",
  lineHeight: "100%",
  letterSpacing: "0%",
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  setOption,
  selectedOption,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: Option) => {
    setOption?.(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button that toggles the dropdown */}
      <button
        onClick={handleDropdownClick}
        className="flex items-center justify-center hover:bg-gray-100"
        style={dropdownStyle}
        {...restProps}
      >
        <span className="text-[12px]">{selectedOption.label}</span>
        <ArrowDownIcon />
      </button>
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-[167px] origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors duration-150"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
