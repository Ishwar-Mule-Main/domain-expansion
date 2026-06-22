import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-[#888898]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`flex h-[52px] w-full rounded-xl border bg-[#141414] px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:ring-4 focus:ring-[#FF6200]/12 focus:border-[#FF6200] appearance-none cursor-pointer ${
              error ? "border-[#EF4444] focus:ring-[#EF4444]/12" : "border-[#2E2E2E]"
            } ${className}`}
            {...props}
          >
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value} className="bg-[#1A1A1A]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#888898]">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-xs font-semibold text-[#EF4444] mt-0.5 pl-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
