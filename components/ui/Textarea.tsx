import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-[#888898]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`flex min-h-[120px] w-full rounded-xl border bg-[#141414] px-4 py-3 text-sm text-white placeholder-[#5A5A6A] outline-none transition-all duration-200 focus:ring-4 focus:ring-[#FF6200]/12 focus:border-[#FF6200] resize-y ${
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

Textarea.displayName = "Textarea";
