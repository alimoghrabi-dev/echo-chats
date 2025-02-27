import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  className,
  labelClassName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full max-w-full">
      <input
        {...props}
        className={cn("peer w-full px-4 py-2.5 transition-all", className)}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value !== "")}
        onPaste={(e) => e.preventDefault()}
        id={props.id || label}
      />
      <label
        htmlFor={props.id || label}
        className={`absolute left-3 text-neutral-400 ${labelClassName} transition-all duration-200 px-1 cursor-text
          ${
            isFocused || props.value
              ? "top-0 transform -translate-y-1/2 text-[13px]"
              : "top-1/2 -translate-y-1/2 text-[13px]"
          }
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[13px]
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[13px] peer-focus:text-neutral-500`}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
