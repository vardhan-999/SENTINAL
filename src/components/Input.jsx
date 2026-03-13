import { forwardRef } from "react";
import { cn } from "../utils/cn";

export const Input = forwardRef(({ className, icon: Icon, rightIcon: RightIcon, ...props }, ref) => {
  return (
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-400 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50",
          "hover:border-white/20 transition-all duration-300",
          Icon && "pl-11",
          RightIcon && "pr-11",
          className
        )}
        {...props}
      />
      {RightIcon && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors">
          {RightIcon}
        </div>
      )}
    </div>
  );
});
Input.displayName = "Input";
