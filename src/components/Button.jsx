import { forwardRef } from "react";
import { cn } from "../utils/cn";
import { motion } from "framer-motion";

export const Button = forwardRef(({ className, variant = "primary", children, ...props }, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-[#0B0F19] overflow-hidden";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] focus-visible:ring-indigo-500",
    secondary: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], "h-12 w-full px-4 py-2", className)}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
});
Button.displayName = "Button";
