import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-[#888898]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`flex h-[52px] w-full rounded-xl border bg-[#141414] px-4 py-3 text-sm text-white placeholder-[#5A5A6A] outline-none transition-all duration-200 focus:ring-4 focus:ring-[#FF6200]/12 focus:border-[#FF6200] ${
            error ? "border-[#EF4444] focus:ring-[#EF4444]/12" : "border-[#2E2E2E]"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs font-semibold text-[#EF4444] mt-0.5 pl-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
