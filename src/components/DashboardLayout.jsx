import { Outlet, useNavigate } from "react-router-dom";
import { CameraMonitor } from "./CameraMonitor";
import { ProfileMenu } from "./ProfileMenu";
import { ArrowLeft } from "lucide-react";

export function DashboardLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07090E] text-white overflow-hidden relative">
      {/* Dashboard Top Persistent Elements */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50 pointer-events-none">
        
        {/* Top Left: Camera Monitor */}
        <div className="pointer-events-auto">
          <CameraMonitor />
        </div>

        {/* Top Right: Back + Profile Menu */}
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <ProfileMenu />
        </div>

      </div>

      {/* Main Page Content */}
      <main className="w-full h-screen pt-24 px-6 pb-6 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
