import React from "react";

const Input = React.forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-xl border bg-white/5 text-white placeholder-slate-500
              px-4 py-2.5 text-sm transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              ${error ? "border-red-500 focus:ring-red-500" : "border-white/10 hover:border-white/20"}
              ${Icon ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
