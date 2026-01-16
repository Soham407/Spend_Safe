"use client";

import { useState, useEffect } from "react";
import { PassiveModeToggle } from "@/features/settings/components/PassiveModeToggle";
import { AccountSettingsModal } from "@/features/settings/components/AccountSettingsModal";
import { UserCircle, Target, Clock, Settings } from "lucide-react";
import { COPY } from "@/copy/en";
import { createClient } from "@/lib/supabase/client";

interface ProfileViewProps {
  isPassiveMode: boolean;
  onTogglePassiveMode: (enabled: boolean) => Promise<void>;
  lastRealityCheck: number | null;
}

export function ProfileView({
  isPassiveMode,
  onTogglePassiveMode,
  lastRealityCheck,
}: ProfileViewProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("User");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-12 py-8 md:py-16">
      <header className="text-center space-y-6">
        <div className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-[48px] neo-outset flex items-center justify-center text-slate-300 bg-white border border-white relative group">
          <UserCircle size={80} strokeWidth={1} />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">
            {COPY.PROFILE.TITLE}
          </h1>
          <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
            {userEmail}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-[0.95]"
          >
            <Settings size={14} />
            <span>Account Settings</span>
          </button>

          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-rose-500 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all active:scale-[0.95]"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="space-y-8">
        {/* Passive Mode Toggle */}
        <PassiveModeToggle
          isEnabled={isPassiveMode}
          onToggle={onTogglePassiveMode}
        />

        {/* Divider */}
        <div className="border-t border-slate-200/50" />

        <div className="neo-inset p-8 md:p-12 rounded-[50px] space-y-10 border border-white/20">
          <div className="space-y-5">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Last Check-In
                </span>
              </div>
              <span className="text-[12px] font-bold text-slate-700">
                {lastRealityCheck
                  ? new Date(lastRealityCheck).toLocaleDateString()
                  : "Never"}
              </span>
            </div>
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center space-x-2">
                <Target size={14} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Data Privacy
                </span>
              </div>
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter">
                Server-Side Secured
              </span>
            </div>
          </div>
        </div>
      </div>

      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userEmail={userEmail}
      />
    </div>
  );
}
