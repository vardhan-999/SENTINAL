import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#07090E]">
      {/* Background Animated Blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" 
      />
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[440px] p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col items-center border border-white/5 bg-white/[0.02]"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)] mb-5"
            >
              <Shield className="absolute w-8 h-8 text-indigo-400" strokeWidth={1.5} />
              <Eye className="absolute w-3.5 h-3.5 text-white mt-1" strokeWidth={3} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sentinel</h1>
            <p className="text-[11px] text-indigo-300/70 font-semibold mt-1 tracking-[0.2em] uppercase">
              Your AI Study Companion
            </p>
          </div>

          {/* Form Header */}
          <div className="w-full text-center sm:text-left mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Welcome Back</h2>
            <p className="text-sm text-gray-400 mt-1.5">
              Sign in to continue your study session
            </p>
          </div>

          {/* Form Elements */}
          <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md transition-all"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 rounded border border-gray-600 bg-black/20 group-hover:border-indigo-400 transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="absolute inset-0 bg-indigo-500 rounded opacity-0 peer-checked:opacity-100 transition-opacity" />
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 relative z-10 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors font-medium">Remember me</span>
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Button type="submit" className="text-[15px] shadow-lg" onClick={() => navigate("/dashboard")}>
                Sign In
              </Button>
              <Button variant="secondary" type="button">
                Create Account
              </Button>
            </div>
          </form>

          {/* Footer Message */}
          <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
            <p className="text-xs text-gray-500 font-medium italic">
              “Stay focused. Stay productive.”
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
